@Slftj 日志打印

指定 log 文件

1. 

```java
@Slf4j
public class MainStarter implements CommandLineRunner {
}
```

logback.xml 配置包名指定一类日志文件  

```xml
<appender name="task" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>${log.home}/task.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <fileNamePattern>${log.home}/archives/task.%d{yyyy-MM-dd}.log.gz
        </fileNamePattern>
        <maxHistory>30</maxHistory>
    </rollingPolicy>
    <encoder>
        <pattern>%date{yyyy-MM-dd HH:mm:ss.SSS}|%level|%logger{1}|%X{traceId}|%msg%n
        </pattern>
    </encoder>
</appender>
<logger name="com.xueqiu.search.task" level="INFO" additivity="false">
    <appender-ref ref="task"/>
</logger>
```

2. 在标注上指定logback.xml 中的 logger.name

   ```java
   @Slf4j(topic = "taskLog")
   ```