# 异步任务

在线服务中有些操作比较耗时（发送邮件），不想阻塞当前进程，就用多线程异步的方式处理。

1. @EnableAsync  ：开启异步注解功能

```java
@EnableAsync  // 开启异步注解功能
@SpringBootApplication
public class SpringTaskApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringTaskApplication.class, args);
    }
}
```

2. @Async 

   告诉 Spring 这个一个异步方法

```java

@Service
public class AsyncService {
    // 告诉 Spring 这个一个异步方法
    @Async
    public void hello() throws InterruptedException {
        // 同步等待
        Thread.sleep(3000);
        System.out.println("处理数据中....");
    }
}
```

```java
@RestController
public class AsyncController {

    @Autowired
    AsyncService asyncService;

    @GetMapping("/hello")
    public String hello() throws InterruptedException {
        asyncService.hello();
        return "success";
    }
}
```



# 定时任务

1. @EnableScheduling  // 开启定时任务

   ```java
   @EnableScheduling
   @SpringBootApplication
   public class MainStarter {
       public static void main(String[] args) {
           SpringApplication.run(MainStarter.class, args);
       }
   }
   ```

   

2. @Scheduled( cron = "0-4 * * * * 0-7" )

   ```java
   @Service
   public class SearchSuggFileHanlder {
   
       @Scheduled(cron = "0-4 * * * * 0-7")
       public void process() {
           System.out.println("Hello world!.......");
       }
   }
   ```

cron 表达式：秒 分 时 日 月 周几

| 字段 | 允许值                      | 允许的特殊字符 |
| ---- | --------------------------- | -------------- |
| 秒   | 0-59                        | ,-*/           |
| 分   | 0-59                        | ,-*/           |
| 小时 | 0-23                        | ,-*/           |
| 日期 | 1-31                        | ,-*?/ L W C    |
| 月份 | 1-31                        | ,-*/           |
| 星期 | 0-7 或 SUM-SAT，0,7 到时SUN | ,-* ? / L C #  |

| 特殊字符 | 含义                         |
| -------- | ---------------------------- |
| ,        | 枚举：0,2,4 * * * * MON-SAT  |
| -        | 区间：0-4 * * * * MON-SAT    |
| *        | 任意                         |
| /        | 步长：0/4 * * * * MON-SAT    |
| ?        | 日/星期冲突匹配              |
| L        | 最后                         |
| W        | 工作日                       |
| C        | 和 calendar 联系后计算过的值 |
| #        | 星期，4#2，第2个星期四       |

例子：

0 0/5 14,18 * * ?    每天14点整和18点整，每隔5分钟执行一次。

0 15 10 ？* 1-6     每月周一至周六10:15分执行一次。

0 0 2 ? * 6L   每月的最后一个周六凌晨2点执行一次

0 0 2 LW * ?    每月的最后一个工作日凌晨2点执行一次

0 0 2-4 ? * 1#1    每月的第一个周一凌晨2点到4点期间，每隔整点执行一次。

# 邮件任务

![邮件发送图](/Users/dongyifeng/doc/spring_boot/images/QQ20190623-112647@2x.jpg)

步骤：

1. zhangsan@qq.com 登录自己邮箱服务。
2. 发送邮件到对方邮箱服务器。
3. lisi 登录自己邮箱后，从163邮箱服务器获取他的邮件 。



依赖

```xml
xml<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

properties 文件配置

```properties
spring.mail.username=519100798@qq.com
spring.mail.password=vdzcvwhfpabgcaii
spring.mail.host=smtp.qq.com
spring.mail.properties.mail.smtp.ssl.enable=true
```

注意：sql 邮箱 password 不是登录邮箱的密码，是授权码：

[QQ 邮箱授权码](https://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256)

```java
@Autowired
JavaMailSenderImpl mailSender;

// 简单邮件
@Test
public void sendSimpleMail() {
    SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
    simpleMailMessage.setSubject("通知-今晚开会");
    simpleMailMessage.setText("今晚7:30开会");
    simpleMailMessage.setTo("dongyf@xueqiu.com");
    simpleMailMessage.setFrom("519100798@qq.com");
    mailSender.send(simpleMailMessage);
}

// 复杂邮件
@Test
public void sendMail() throws MessagingException {
    MimeMessage mimeMessage = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
    helper.setSubject("通知-今晚开会");
  	// ture：启用 html
    helper.setText("<b style='color:red'>今晚7:30开会</b>", true);
    helper.setTo("dongyf@xueqiu.com");
    helper.setFrom("519100798@qq.com");

    // 上传文件
    helper.addAttachment("1.jpg", new File("/Users/dongyifeng/doc/spring_boot/images/WX20190621-230859.png"));
    helper.addAttachment("2.jpg", new File("/Users/dongyifeng/doc/spring_boot/images/QQ20190623-112647@2x.jpg"));

    mailSender.send(mimeMessage);
}
```













