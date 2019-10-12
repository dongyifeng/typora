MDC ( Mapped Diagnostic Contexts )，它是一个线程安全的存放诊断日志的容器。



Logback设计的一个目标之一是对==分布式应用系统的审计和调试==。

在现在的分布式系统中，需要同时处理很多的请求。如何来很好的区分日志到底是那个请求输出的呢？我们可以为每一个请求生一个logger，但是这样子最产生大量的资源浪费，并且随着请求的增多这种方式会将服务器资源消耗殆尽，所以这种方式并不推荐。

一种更加轻量级的实现是使用 MDC 机制，在处理请求前将请求的唯一标示放到MDC容器中如 sessionId，这个唯一标示会随着日志一起输出，以此来区分该条日志是属于那个请求的。并在请求处理完成之后清除MDC容器。

```java
public class MDC {
  // 将一个K-V的键值对放到容器，其实是放到当前线程的ThreadLocalMap中
  public static void put(String key, String val);

  // 根据key在当前线程的MDC容器中获取对应的值
  public static String get(String key);

  // 根据key移除容器中的值
  public static void remove(String key);

  // 清空当前线程的MDC容器
  public static void clear();
}
```

一个Demo

```java
    public static void main(String[] args) throws Exception {

        // You can put values in the MDC at any time. Before anything else
        // we put the first name
        MDC.put("first", "Dorothy");

        Logger logger = LoggerFactory.getLogger(SimpleMDC.class);
        // We now put the last name
        MDC.put("last", "Parker");

        // The most beautiful two words in the English language according
        // to Dorothy Parker:
        logger.info("Check enclosed.");
        logger.debug("The most beautiful two words in English.");

        MDC.put("first", "Richard");
        MDC.put("last", "Nixon");
        logger.info("I am not a crook.");
        logger.info("Attributed to the former US president. 17 Nov 1973.");
    }
```

Logback配置:

```xml
<appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender"> 
  <layout>
    <Pattern>%X{first} %X{last} - %m%n</Pattern>
  </layout> 
</appender>
```

日志输出

```verilog
Dorothy Parker - Check enclosed.
Dorothy Parker - The most beautiful two words in English.
Richard Nixon - I am not a crook.
Richard Nixon - Attributed to the former US president. 17 Nov 1973.
```

总结：

1. 在日志模板logback.xml 中，使用 ==%X{ }==来占位，替换到对应的 MDC 中 key 的值。同样，logback.xml配置文件支持了多种格式的日志输出，比如%highlight、%d等等，这些标志，在PatternLayout.java中维护。
2. MDC的容器中的 key 可以多次赋值，最后一次的赋值会==覆盖上一次的值==。



日志链路追踪：https://www.jianshu.com/p/3dca4aeb6edd

