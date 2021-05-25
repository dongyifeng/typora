[TOC]

# 生产者

1. 创建 Topic

2. 配置信息

```yaml
kafka-bigdata:
  producer:
    bootstrap-servers: IP1:9092,IP2:9092,IP3:9092,IP4:9092
    retries: 1
    batchSize: 4096
    linger: 1
    bufferMemory: 40960
    key-serializer: org.apache.kafka.common.serialization.StringSerializer
    value-serializer: org.apache.kafka.common.serialization.StringSerializer
```

3. 加载配置信息

   ```java
   import lombok.Getter;
   import lombok.Setter;
   import org.springframework.boot.context.properties.ConfigurationProperties;
   
   @ConfigurationProperties("kafka-bigdata.producer")
   @Setter
   @Getter
   public class KafkaBigDataProducerProperties {
       private String bootstrapServers;
       private int retries;
       private int batchSize;
       private int linger;
       private int bufferMemory;
       private String keySerializer;
       private String valueSerializer;
   
       @Override
       public String toString() {
           return "KafkaProducerProperties{" +
                   "bootstrapServers='" + bootstrapServers + '\'' +
                   ", retries=" + retries +
                   ", batchSize=" + batchSize +
                   ", linger=" + linger +
                   ", bufferMemory=" + bufferMemory +
                   ", keySerializer='" + keySerializer + '\'' +
                   ", valueSerializer='" + valueSerializer + '\'' +
                   '}';
       }
   }
   ```

4. Spring 加载

   ```java
   import com.alibaba.fastjson.JSON;
   import lombok.extern.slf4j.Slf4j;
   import org.apache.kafka.clients.producer.KafkaProducer;
   import org.apache.kafka.clients.producer.ProducerConfig;
   import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
   import org.springframework.boot.context.properties.EnableConfigurationProperties;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   
   import java.util.HashMap;
   import java.util.Map;
   
   /**
    * kafka配置类
    */
   @Configuration
   @EnableConfigurationProperties({KafkaProducerProperties.class, KafkaBigDataProducerProperties.class})
   @Slf4j
   public class KafkaAutoConfiguration {
       public static final String KAFAK_PRODUCER_BIG_DATA = "KAFAK_PRODUCER_BIG_DATA";
       public static final String TOPIC_STATUS_ENTER_STOCK_PAGE = "status_enter_stock_page";
   
       @Bean(name = KAFAK_PRODUCER_BIG_DATA)
       public KafkaProducer<String, String> bigDataKafkaPush(KafkaBigDataProducerProperties producerConfig) {
           Map<String, Object> props = new HashMap<>();
           props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, producerConfig.getBootstrapServers());
           props.put(ProducerConfig.RETRIES_CONFIG, producerConfig.getRetries());
           props.put(ProducerConfig.BATCH_SIZE_CONFIG, producerConfig.getBatchSize());
           props.put(ProducerConfig.LINGER_MS_CONFIG, producerConfig.getLinger());
           props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, producerConfig.getBufferMemory());
           props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, producerConfig.getKeySerializer());
           props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, producerConfig.getValueSerializer());
           log.info("bigDataKafkaPush:" + JSON.toJSONString(producerConfig));
           return new KafkaProducer<>(props);
       }
   }
   ```

   

5. 封装 send 方法

   ```java
   import lombok.extern.slf4j.Slf4j;
   import org.apache.kafka.clients.producer.KafkaProducer;
   import org.apache.kafka.clients.producer.ProducerRecord;
   import org.apache.kafka.clients.producer.RecordMetadata;
   import org.springframework.scheduling.annotation.Async;
   import org.springframework.stereotype.Service;
   
   import javax.annotation.PreDestroy;
   import javax.annotation.Resource;
   import java.util.concurrent.Future;
   
   /**
    * kafka生产者
    */
   @Service
   @Slf4j
   public class KafkaBigDataProductor {
       @Resource(name = KafkaAutoConfiguration.KAFAK_PRODUCER_BIG_DATA)
       private KafkaProducer<String, String> bigDataKafkaPush;
   
       @Async
       public Future<RecordMetadata> send(String topic, String key, String value) {
           log.info("kafka_big_data send start, topic:{}, key:{}, value:{}", topic, key, value);
           //发送kafka
           Future<RecordMetadata> metadataFuture = bigDataKafkaPush.send(new ProducerRecord<>(topic, key, value));
           log.info("kafka_big_data send end, topic:{}, key:{}, value:{}, result:{}", topic, key, value, metadataFuture);
           return metadataFuture;
       }
   
       @PreDestroy
       public void close() {
           bigDataKafkaPush.close();
       }
   }
   ```

6. 业务使用

   ```java
      public void publish(IndexStatus status) {
           if (status == null || CollectionUtils.isEmpty(status.getSymbols())) {
               return;
           }
   
           kafkaBigDataProductor.send(KafkaAutoConfiguration.TOPIC_STATUS_ENTER_STOCK_PAGE,
                   String.valueOf(System.currentTimeMillis()),
                   JSON.toJSONString(ImmutableMap.of("statusId", status.getStatusId(),
                           "symbols", String.join(",", new HashSet<>(status.getSymbols())),
                           "userId", status.getUserId())));
       }
   ```

   

# 消费者

Kafka 抽象类

```java
import com.codahale.metrics.Gauge;
import com.google.common.collect.Lists;
import com.xueqiu.blizzard.cubeTop.service.CubeSearchTopService;
import com.xueqiu.blizzard.message.kafka.constant.KafkaConstant;
import com.xueqiu.blizzard.message.kafka.domain.KafkaPayload;
import com.xueqiu.infra.xcommon.XueqiuMetrics;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import javax.annotation.Resource;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * kafka消费抽象
 * @author zhengning
 * @since 2021-02-18
 */
@Slf4j
public abstract class AbstractKafkaConsumer implements IKafkaConsumer {

    protected KafkaConsumer<String,String> consumer;

    private final List<ThreadPoolExecutor> threadPoolExecutorList = Lists.newArrayList();

    @Override
    public void run() {
        init();
        initThreadPool();
        consume();
    }

    /**
     * kafka初始化
     */
    protected void init() {
        String bootstraps = "IP1:9092,IP2:9092,IP3:9092,IP4:9092";
        Properties props = new Properties();
        props.setProperty(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstraps);
        props.setProperty(ConsumerConfig.GROUP_ID_CONFIG, getGroup());
        props.setProperty(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        props.setProperty(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        props.setProperty(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true"); // or false
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, KafkaConstant.MAX_POLL_RECORDS); //每次拉取的条数
        props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, KafkaConstant.SESSION_TIMEOUT_MS); //超时时间
        props.put(ConsumerConfig.HEARTBEAT_INTERVAL_MS_CONFIG, KafkaConstant.HEARTBEAT_INTERVAL_MS); //心跳间隔
        consumer = new KafkaConsumer<>(props);
        consumer.subscribe(Collections.singletonList(getTopic()));
    }

    protected void initThreadPool(){
        for(int i = 0; i < getThreadPoolNum(); i++){
            ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(1, 1, 60, TimeUnit.SECONDS,
                    new LinkedBlockingQueue<>(50000), new ThreadPoolExecutor.DiscardOldestPolicy());
            threadPoolExecutorList.add(threadPoolExecutor);
            XueqiuMetrics.getInstance().register(getThreadPoolMetricsName() + "_" + i, (Gauge<Integer>) () -> threadPoolExecutor.getQueue().size());
        }
    }

    /**
     * kafka消费
     */
    protected void consume() {
        for (;;) {
            try {
                ConsumerRecords<String, String> records = consumer.poll(1000);
                for (ConsumerRecord<String, String> record : records.records(getTopic())) {
                    long start = System.currentTimeMillis();
                    try {
//                        log.info("kafka_consume, topic={}|{}|{}", getTopic(), record.key(), record.value());
                        KafkaPayload kafkaPayload = KafkaPayload.builder()
                                .topic(getTopic())
                                .key(record.key())
                                .message(record.value())
                                .partition(record.partition())
                                .timestamp(record.timestamp())
                                .build();
                        log.info("kafka_consume, kafkaPayload={}", kafkaPayload);
                        getThreadPool(getThreadPoolHash(kafkaPayload)).execute(() -> handler(kafkaPayload));
                    }catch (Exception e){
                        log.error("kafka_consume parse body error, topic={}|{}|{}|{}", getTopic(), getGroup(), record.key(), record.value(), e);
                    }finally {
                        XueqiuMetrics.getInstance().timer("kafka_consume_" + getTopic() + "_" + getGroup()).update(Instant.now().toEpochMilli() - start, TimeUnit.MILLISECONDS);
                    }
                }
            }catch (Exception e){
                log.error("kafka_consumer_error, topic={}|{}", getTopic(), getGroup());
            }
        }
    }

    public ThreadPoolExecutor getThreadPool(String hash){
        if(!StringUtils.isBlank(hash)){
            return threadPoolExecutorList.get(Math.abs(hash.hashCode()) % getThreadPoolNum());
        }
        return threadPoolExecutorList.get((int)(System.currentTimeMillis() % getThreadPoolNum()));
    }

    protected abstract String getTopic();
    protected abstract String getGroup();
    protected abstract int getThreadPoolNum();
    protected abstract String getThreadPoolMetricsName();
    protected abstract String getThreadPoolHash(KafkaPayload kafkaPayload);
    protected abstract void handler(KafkaPayload kafkaPayload);
}
```

Kafka 实现类

```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xueqiu.blizzard.business.constant.MetricsConstant;
import com.xueqiu.blizzard.business.thirdParty.cube.service.CubeRpcClientService;
import com.xueqiu.blizzard.message.kafka.domain.KafkaCubeRebalancingEvent;
import com.xueqiu.blizzard.message.kafka.domain.KafkaPayload;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * 组合调仓变动消费kafka
 * @author zhengning
 * @since 2021-02-22
 */
@Slf4j
@Component("kafkaCubeRebalancingConsumer")
public class KafkaCubeRebalancingConsumer extends AbstractKafkaConsumer {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Resource
    private CubeRpcClientService cubeRpcClientService;

    @Override
    protected String getTopic() {
        return KafkaCubeRebalancingEvent.getTopic();
    }

    @Override
    protected String getGroup() {
        return KafkaCubeRebalancingEvent.getGroup();
    }

    @Override
    protected void handler(KafkaPayload kafkaPayload) {
        if(null == kafkaPayload || StringUtils.isBlank(kafkaPayload.getMessage())){
            return;
        }
        try {
            JsonNode root = objectMapper.readTree(kafkaPayload.getMessage());
            long cubeId = root.path("body").path("cube_id").asLong();
            if(cubeId <= 0){
                cubeId = root.path("cube_id").asLong();
            }
            if(cubeId <= 0){
                log.error("kafkaCubeScoreConsumer handler error, missing cube_id, key={}, value={}", kafkaPayload.getKey(), kafkaPayload.getMessage());
                return;
            }
            cubeSearchTopService.handlerOnRebalancing(cubeId);
        }catch (Exception e){
            log.error("kafkaCubeScoreConsumer handler error, kafkaPayload={}", kafkaPayload, e);
        }
    }

    @Override
    protected int getThreadPoolNum() {
        return 3;
    }

    @Override
    protected String getThreadPoolMetricsName() {
        return MetricsConstant.METRICS_NAME_KAFKACUBEREBALANCINGCONSUMER_THREADPOOLSIZE;
    }

    @Override
    protected String getThreadPoolHash(KafkaPayload kafkaPayload) {
        return null;
    }
}
```

