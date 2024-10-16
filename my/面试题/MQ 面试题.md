---
typora-root-url: ../../../typora
---

[TOC]

# MQ 的原理

应用场景：

1. 异步处理：生产者速度 > 消费者速度
2. 应用解耦：
3. 流量削峰：



生产者、消费者和消息队列

- Product：消息的生成者
- Consumer：消息的消费者 
- Broker：安装 RabbitMQ 的一个服务器。
- Connection：无论是生产者发送消息，还是消费者要消费消息，都需要与 Broker 建立连接。  
- Channel：消息推送使用的通道。是建立在真实的TCP连接内的虚拟连接，复用 TCP 连接的通道。
- RoutingKey（路由键）：用于把生成者的数据分配到交换器上；
- Exchange：消息队列交换机，按一定的规则将消息路由转发到某个队列，对消息进行过虑。
- BindingKey：用于把交换器的消息绑定到队列上
- Queue：消息队列，存储消息的队列，消息到达队列并转发给指定的消费方。



<img src="/images/tmp/WX20230307-165247@2x.png" style="zoom:30%;" />



交换机类型：

1. Direct 类型的交换器（默认方式）： BindingKey 和 RoutingKey 完全匹配的队列中
2. Topic 类型：在 Direct 类型 规则之上使用通配符。
3. Fanout 类型：消息广播的模式。消息广播到所有绑定到它的队列中，而不考虑 RoutingKey 的值（不管路键或是路由模式）。
4. Header 类型：不依赖于路由键的匹配规则来路由消息，而是根据发送的消息内容中的 headers 属性进行匹配。Headers 类型的交换器性能会很差，而且不实用，



# 消息不重复消费？

消息重复消费，一般不是有 MQ 去保证，都是由业务去保证。

MQ 能保证的是：消息至少能被消费一次。这些 MQ 的可用性的要求。对于 MQ 本身的可用性与消息重复发送来说，可用性是 MQ 的头等大事。

举个例子：生成者发送了 A 消息，消费者处理完毕后，需要向 MQ 发送一条 ACK 确认消息，告诉 MQ 我已经成功消息了。如果这个时候出现网络闪断、网络抖动、网络延迟等，ACK 消息发生了超时。那么 MQ 就会认为消费者没有成功消费，MQ 为了自己的可用性，就会进行二次投递。第二次消费很顺畅，ACK 消息也及时通知 MQ。那么这就出现了消费重复。



防止重复一般要求业务自己实现幂等。比如我们在消息中传递一个唯一ID，在数据库里用这个唯一ID，创建一个唯一索引，这样第二条重复消息在插入数据库时会失败。当然不同业务，有不同的处理方案，来保证业务处理的幂等性。



<img src="/images/tmp/WX20230307-182302@2x.png" style="zoom:25%;" />



# MQ 是如何保证消息顺序性？

生产者的有序性：

- 单一生产者：如果生产者分布在不同的服务器中，无法保证生产者之间产生的消息之间的有序性。
- 串行发送：生产者端支持多线程访问，如果生产者使用多线并行发送，不同线程间产生的消息无法保证有序性。



消费者的有序性：

- 按照投递顺序消息：消费者不要使用异步消费。
- 有限重试：消息投递在有限次内，可以重复发送，如果处理一直失败，超过最大重试次数后将不再重试，会跳过这条消息，不会阻塞后续消息的处理。（如果需要严格保证消费顺序的话，这里要设置合理的重试次数 ）。



消费建议：

- 串行消费，避免批量消费导致乱序。
- 保证消息顺序性，MQ 的吞吐量非常低，最好将不需要顺序性的 MQ，拆出去。



# 保证 MQ 消息高可用？

四个 9 的系统一般称为高可用系统。一年当中有 52.6 分钟不可用。 

1. 



# 保证线上消息100%不丢失 ？

- 生产者
  - 同步发送：发送消息，阻塞当前线程，等待MQ返回的结果。（推荐使用）
  - 异步发送：先构建消费发送的任务，将任务丢给线程池，通过回调函数处理发送结果。（在回调中处理失败情况：重试、记录）
  - Oneway 发送：只发送，不管是否发送成功与否。(性能最好)
- MQ
  - 消息存放在磁盘，默认是异步刷盘。异步刷盘有可能数据丢失。将异步刷盘改为同步刷盘。
  - 对MQ进行集群部署，使用主从节点，进行备份。
- 消费者
  -   使用 ACK 确认机制，只有消息处理完成后，才向 MQ返回确认。

<img src="/images/tmp/WX20230306-214318@2x.png" style="zoom:50%;" />



# 百万消息积压？

1. 事前处理机制
   1. 流量预估，压测，机器台数，代码优化。
2. 事中处理机制
   1. 优先恢复业务，对消费端扩容，消费完毕后，再恢复成原来的机器数。
3. 事后处理机制
   1. 提高消费消息的并行度：绝大部分 IO 密集型。
   2. 批量方式消费
   3. 跳过非重要消息：丢弃老消息，消费新消息（业务上允许），离线修复老消息。
   4. 重要消息与普通消息分离。
   5. 优化每条消息消费过程。