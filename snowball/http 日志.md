http_access.log 打印配置

在snowball-common.jar 中已实现了一个Fillter：AccessLogFilter。

初始化AccessLogFilter 有两种方式：

```java
		@Bean
    public AccessLogFilter accessLogFilter(AppInfo app) {
        return new AccessLogFilter(app.getHttpServiceName());
    }
```

or 引入snowball-common 的 CommonConfig

```java
@Import({
        CommonConfig.class,// 通用配置（访问日志、权限过滤器）
})
public class SpringConfig {
```



 logback.xml

```xml
<appender name="ACCESS" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>${log.home}/http_access.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <fileNamePattern>${log.home}/archives/http_access.%d{yyyy-MM-dd}.log</fileNamePattern>
        <maxHistory>30</maxHistory>
    </rollingPolicy>
    <encoder>
        <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS}|%msg%n</pattern>
    </encoder>
</appender>

<logger name="access" level="INFO" additivity="false">
    <appender-ref ref="ACCESS"/>
</logger>
```

