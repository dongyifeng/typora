[TOC]

Guava 在 guava-libraries 中提供了 EventBus（事件总线）。它是事件发布订阅模式的实现。

- EventBus ( 同步事件 )

- AsyncEventBus ( 异步事件 )



在订阅方法上标注：==@Subscribe== 和保证==只有一个参数==

Guava 发布的事件默认不会处理线程安全，我们可以@AllConcurrentEvents 来保证线程安全。

通过 ==post 方法发布事件==。

注意：==订阅方法参数类型必须与post 类型一致，才能收到消息==。

所以：建议定义特定的事件类型是必要的。

```java
import com.google.common.eventbus.EventBus;
import com.google.common.eventbus.Subscribe;

public class EventBusDemo {
    public static void main(String[] args) {
        final EventBus eventBus = new EventBus();
        eventBus.register(new Object() {

            // 订阅
            @Subscribe
            public void lister(Integer integer) {
                System.out.printf("%s from int%n", integer);
            }

            @Subscribe
            public void lister(Number integer) {
                System.out.printf("%s from Number%n", integer);
            }

            @Subscribe
            public void lister(Long integer) {
                System.out.printf("%s from long%n", integer);
            }
        });

        // 发布
        eventBus.post(1);
        System.out.println("----------");
        eventBus.post(2L);
    }
}

// 运行结果
1 from int
1 from Number
----------
2 from long
2 from Number
```

# 订阅



# 发布

