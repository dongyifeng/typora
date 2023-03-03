---
typora-root-url: ../../../typora
---

[TOC]

# ConcurrentHashMap 结构

## ConcurrentHashMap 在 JDK1.7

<img src="/images/java/WX20230302-211518@2x.png" style="zoom:33%;" />



 对 Segment 加锁（重入锁），保证多线程同时访问 ConcurrentHashMap 时同一时间只能有一个线程操作。保证了 ConcurrentHashMap 的线程安全。这个锁被称为 分段锁或者分片锁。



## ConcurrentHashMap 在 JDK1.8

ConcurrentHashMap 在 JDK1.8 中的结构：数组 + 单项链表 + 红黑树。是并发安全的 HashMap。

初始化 ConcurrentHashMap 默认会初始化一个长度为 16 的数组。 

- 当链表长度大于 8 时，将单链表变为红黑树。
- 当链表长度小于等与 6 时，将红黑树会退化为单链表。



<img src="/images/java/WX20230302-203958@2x.png" style="zoom:33%;" />

ConcurrentHashMap 并发实现是通过<font color=red>节点加锁</font>实现的。

更新元素是，对指定的 Node 加锁：

<img src="/images/java/WX20230302-205843@2x.png" style="zoom:33%;" />

ConcurrentHashMap 在性能方面做了优化：

JDK 1.7 ConcurrentHashMap 的 size() 方法在保持原子性的前提下，去实现元素个数的累加。这个性能比较低。



JDK 1.8 核心思想是引入数组来实现对并发更新的一个负载

<img src="/images/java/WX20230302-211546@2x.png" style="zoom:50%;" />



# ArrayList 与 LinkedList 有什么区别？

1. 底层的数据结构不同
   1. ArrayList 底层是基于<font color=red>数组</font>实现的。
   2. LinkedList 底层是基于<font color=red>链表</font>实现的。
2. 由于底层数据结构不同，他们使用的场景也不同
   1. ArrayList 适合随机查找 
   2. LinkedList 链表适合添加和删除（双端），可以从头部添加数据，从尾部添加数据。（双向链表）
      1.  而数组大小固定，插入和删除都需要移动元素，链表可以动态扩充，插入删除不需要移动元素，只需要更改元素中的指针。所以链表的插入删除比数组效率高。
3. ArrayList 和 LinkedList 都实现了 List 接口，LinkedList 额外实现了 Deque 接口，所以 LinkedList 可以当做队列来使用。



## 为什么说数组的查找比链表的查找效率高？

因为 **CPU 缓存会读入一段连续的内存**，顺序存储符合连续的内存，所以顺序存储可以被缓存处理，而链接存储并不是连续的，分散在堆中，所以只能内存去处理。 所以数组查询比链表要快。





# HashMap1.7 与 1.8 的区别数据的插入过程

 HashMap1.7 与 1.8 的底层结构不同

- HashMap 1.7 是：数组 + 链表（单链表）
- HashMap 1.8 是：数组 + 链表（单链表） + 红黑树



<font color=red>**JDK7采用的是头插法，JDK8采用的是尾插法**</font>

## HashMap1.7 插入过程

1. 先去判断数组是否为空，如果为空就要进行初始化（数组长度为 16）
2. 再去看key是否为null，如果key为null，那么调用 putForNullKey() 方法，获取数组下标为0的链表进行遍历，遍历过程中如果存在key为null的entry，那么就会覆盖value并返回之前的value值，如果没有这样的key那么就会创建一个key为null，值为value的键值对然后返回null。
3. 如果key不为null，那么计算出对应 key 的 hash 值和其对应的索引位置
4. 判断数组对应位置是否为空：(是否有hash 冲突)
   1. 如果为空：直接插入。return
   2. 如果不为空，遍历链表，判断待插入的 key 是否存在
      1. 如果已经存在，用新的 value 替换旧 value，并且返回旧的 value。
      2. 如果不存在，判断数组是否需要扩容，如果需要扩容，就扩容，最后将数据<font color=red>插入链表头部</font>

注意：<font color=red>很多人误以为达到阈值就扩容，还有一个条件很容易让人忽略，就是待插入的位置必须不为空，如果待插入的位置是空的，哪怕已经到了阈值，也是直接插入不扩容。</font>



## HashMap1.8 插入过程

1. 判断数组为空，直接`resize()`（初始化一个长度为 16 的数组）
2. 对  key 进行 hash 取模运算计算，得到 key-value 在数组中的存储位置 i（利用 key 的hashCode进行高 16 位**异或**低十六位运算）
3. 判断数组对应位置是否为空：(是否有hash 冲突)
   1. 如果为空：直接插入节点数据
   2. 如果不为空：
      1. 判断是否为红黑树
         1. 如果是红黑树，判断对应数据是否存在
            1. 如果存在更新数据
            2. 如果不存在直接插入红黑树，++size。超出 threshold 容量扩容。
         2. 如果是链表，判断 Node是否已经存在
            1. 如果存在更新数据
            2. 如果不存在直接<font color=red>插入链表尾部</font>，判断链表长度是否大于 8，如果大于链表转为红黑树存储。++size。超出 threshold 容量扩容。

## 查询过程头插法与尾插法头插和尾插分别会遇到什么问题？

HashMap 1.7 头插法在多线程并发扩容时会死循环。

下图为单线程状态下 HashMap 1.7  的扩容

<img src="/images/java/WX20230303-103700@2x.png" style="zoom:33%;" />



HashMap1.7 并发扩产生容死循环

<img src="/images/java/WX20230303-104553.png" style="zoom:80%;" />



避免HashMap 发生死循环的常用方案：

1. 使用线程安全的 ConcurrentHashMap 替代 HashMap（推荐）
2. 使用线程安全的 HashTable 替代 HashMap，性能低（不推荐）
3. 使用 synchronized 或者 Lock 加锁，会影响性能，不建议。



总结：

HashMap 死循环只会发生在 JDK1.7 中

主要原因：<font color=red>头插法+链表+多线程并发+扩容</font>，累加到一起就会形成死循环。

多线程下：建议使用 ConcurrentHashMap 替代。

JDK 1.8，HashMap 改为<font color=red>尾插法</font>，解决了链表死循环的问题。**如果使用尾插，在扩容时会保持链表元素原本的顺序，就不会出现链表成环的问题了。**

JDK 1.8 HashMap 虽然解决了并发扩容时环化的问题，但是HashMap 在多线程的情况下，还是会出现丢数据的问题。



## resize的时候会有问题， put和delete会有并发问题吗？

发生在index相同的情况下，大家拿到的链头可能不是最新的，后一个会直接覆盖了前一个 
而且当多条线程检测到容量超过负载因子时，会能发生多次 resize。 

remove 与put 都是一样的，由于大家拿到的不是最新链头，只要大家在 Entry 数组的 index 相同时(经过hash后的index)，就有可能出现后一个覆盖前一个的操作，即前一个的操作无效。 

1. put 进行的 data 有可能丢失了 
2. 一些通过remove(Object key)删除掉的元素(返回删除成功)又出来了。 
3. 多线程检测到 HashMap 容量超过负载因子时会进行多次的 resize，由于要 rehash，所以消耗的性能也是巨大的。 



## ConcurrentHashMap 分段锁 CAS 与 lock 1.7 实现1.8 实现1.8做了什么优化？

ConcurrentHashMap 在 JDK 1.7 底层：数组 + 链表。其中数组分为两大类，大数组和小数组。大数组 Segment。

JDK 1.7 对 Segment 加锁（重入锁），保证多线程同时访问 ConcurrentHashMap 时同一时间只能有一个线程操作。保证了 ConcurrentHashMap 的线程安全。这个锁被称为 分段锁或者分片锁。



ConcurrentHashMap 在 JDK 1.8 底层：数组 + 链表 + 红黑树。

JDK1.8 主要使用 CAS 或者 synchronized 的方式来实现的，保证线程安全。

<font color=red>ConcurrentHashMap 通过对头结点加锁来保证线程安全。</font>这是设计的好处就是：相比 Segment 来说锁的粒度更小了，发生Hash冲突和加锁的频率也更小了。在并发操作下性能也提升了。



添加元素时，首先会判断容器是否为空

- 如果为空，就会使用 CAS 加 volatile 来初始化。
- 如果不为空，就会根据存储的元素计算该位置，该位置是否为空
  - 如果为空，就是使用 CAS 添加数据
  - 如果不为空，就会使用 synchronized 加锁来实现，去遍历桶中的数据，并且替换或者新增节点到桶中。 最后判断是否需要转成红黑树。

这样就保证了并发执行时的线程安全。



# 线程池

合理的线程池带来的好处：

1. 降低资源的消耗：通过重用已创建的线程，来降低线程的创建和销毁的消耗。
2. 提高响应速度：任务不需要等待线程的创建，可以立即执行。
3. 提高线程的可管理性：线程池可以统一管理，分配，调优和监控。

<img src="/java/images/QQ20190808-104417@2x.png" style="zoom: 40%;" />



创建线程池的核心参数：

- `corePoolSize` 为线程池的基本大小。
- `maximumPoolSize` 为线程池最大线程大小。
- `keepAliveTime` 和 `unit` 则是线程空闲后的存活时间。
- `workQueue` 用于存放任务的阻塞队列。
- `handler` 当队列和最大线程池都满了之后的饱和策略。



## 线程池的初始化过程 java 自带的四种线程池， 以及分别会出现什么问题？

- newCachedThreadPool 创建一个可缓存线程池，如果线程池长度超过处理需要，可灵活回收空闲线程，若无可回收，则新建线程。

特点：0 个核心线程。线程不够用时，就创建。线程空闲时间超过 keepAliveTime 时，就释放。

问题：CachedThreadPool 和  ScheduledThreadPool 使用的<font color=red>允许创建的线程数是 Integer.MAX_VALUE，可能会创建大量的线程，从而导致 OOM</font>

```java
    public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, // 核心线程数
                                      Integer.MAX_VALUE,// 最大线程数
                                      60L, TimeUnit.SECONDS, // 最大空闲时间
                                      new SynchronousQueue<Runnable>());
    }
```



- newScheduledThreadPool 创建一个定长线程池，支持定时及周期性任务执行。

延时启动 、定时启动 、可以自定义最大[线程池](https://so.csdn.net/so/search?q=线程池&spm=1001.2101.3001.7020)数量

问题：CachedThreadPool 和  ScheduledThreadPool 使用的<font color=red>允许创建的线程数是 Integer.MAX_VALUE，可能会创建大量的线程，从而导致 OOM</font>

```java
    public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
        return new ScheduledThreadPoolExecutor(corePoolSize);
    }

    public ScheduledThreadPoolExecutor(int corePoolSize) {
        super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
              new DelayedWorkQueue());
    }


		// 定时执行
    public ScheduledFuture<?> scheduleAtFixedRate(Runnable command,
                                                  long initialDelay,
                                                  long period,
                                                  TimeUnit unit);
		// 延迟执行
    public ScheduledFuture<?> scheduleWithFixedDelay(Runnable command,
                                                     long initialDelay,
                                                     long delay,
                                                     TimeUnit unit);
```



- newFixedThreadPool 创建一个定长线程池，可控制线程最大并发数，超出的线程会在队列中等待。

  固定线程个数。使用阻塞队列。

  <font color=red>问题：FixedThreadPool 和 SingleThreadExecutor 使用的无界队列，可能会堆积大量的请求，从而导致 OOM</font>

```java
 public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
    }
```



- newSingleThreadExecutor 创建一个单线程化的线程池，它只会用唯一的工作线程来执行任务，保证所有任务按照指定顺序(FIFO, LIFO, 优先级)执行。

只有一个线程。使用阻塞队列。

<font color=red>问题：FixedThreadPool 和 SingleThreadExecutor 使用的无界队列，可能会堆积大量的请求，从而导致 OOM</font>

```java
    public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }
```



自定义线程池：

```java
ThreadPoolExecutor(int corePoolSize,//线程池的核心线程数量
                              int maximumPoolSize,//线程池的最大线程数
                              long keepAliveTime,//当线程数大于核心线程数时，多余的空闲线程存活的最长时间
                              TimeUnit unit,//时间单位
                              BlockingQueue<Runnable> workQueue,//任务队列，用来储存等待执行任务的队列
                              ThreadFactory threadFactory,//线程工厂，用来创建线程，一般默认即可
                              RejectedExecutionHandler handler//拒绝策略，当提交的任务过多而不能及时处理时，我们可以定制策略来处理任务
                               ) {
```

拒绝策略：

- **`ThreadPoolExecutor.AbortPolicy`**：抛出 `RejectedExecutionException`来拒绝新任务的处理。
- **`ThreadPoolExecutor.DiscardPolicy`：** 不处理新任务，直接丢弃掉。
- **`ThreadPoolExecutor.DiscardOldestPolicy`：** 此策略将丢弃最早的未处理的任务请求。
- **`ThreadPoolExecutor.CallerRunsPolicy`**：如果线程池的线程数量达到上限，该策略会把任务队列中的任务放在调用者线程当中运行；



## 参数怎么设置， corePoolSize 与 maxiumPoolSize 应该怎么设置CPU密集型/IO密集型的区别？

IO 密集型，CPU 比较空闲，可以适当多设置线程数。

CPU 密集型：线程数尽量和CPU 核数相当。



IO 密集型：corePoolSize =  2n + 1 。（n 为 CPU 核数）

CPU 密集型：corePoolSize = n + 1。

最佳线程数目 = （（线程等待时间+线程CPU时间）/线程CPU时间 ）* CPU数目 

转化为：**最佳线程数目 = （线程等待时间与线程CPU时间之比 + 1）* CPU**

**线程等待时间所占比例越高，需要越多线程。线程CPU时间所占比例越高，需要越少线程。**

 **maxiumPoolSize**

- 当线程数>=corePoolSize，且任务队列已满时。线程池会创建新线程来处理任务。

- 当线程数=maxPoolSize，且任务队列已满时，线程池会拒绝处理任务而抛出异常。



# 设计一个生产者和消费者模型同步操作， 使用数组或者链表的考量synchronized 同步方法， 容量的设计 capacity 使用原子类

https://zhuanlan.zhihu.com/p/73442055







# MySQL



## MySQL 索引二叉树，B-树， B+树的区别?



常规数据库引擎都是采用 B- 树或者 B+树 来实现的。因为 B-树是一种多路平衡树。用这种结构来存储大量数据的时候，<font color=red>整棵树的高度相比二叉树来说会矮很多。</font>对于数据库来说所有的数据都是存在磁盘上的，而磁盘的 IO 效率是比较低的。特别是随机磁盘IO 的情况下，效率就更低了。 所以树的高度能就能够决定磁盘IO 的次数。磁盘IO 的次数越小，那么对于性能提升就越大。这也是为什么采用B-树采用索引存储结构。



在 Mysql InnoDB 的存储引擎中，它用到了一种增强的 B-树结构，也就是 B+树，来作为索引和数据的存储结构。相比于 B-树的结构来说，B+ 树做了几个方面的优势。

- B+ 树的所有数据都存储在叶子节点，非叶子节点只存储索引。
- 叶子节点的数据，使用双向链表的方式进行关联。



使用 B+ 树作为索引的原因

1. B+树的非叶子节点不存储数据，所以每一层能够存储的索引数据量会增加，意味着B+树在层高相同的情况下，存储的数量比B树更多。使得磁盘 IO 次数更少。
2. 在Mysql 中范围查询时一个比较常用的操作，而B+树的所有存储在叶子节点上的数据，使用了双向链表的方式来关联，所以在查询时只需要查询两个节点，进行遍历就可以了。而 B-树需要获取所有节点。B+树在范围上查询效率更高。
3. 在数据的检索方面，由于所有的数据都存在叶子节点，所以 B+树的IO次数会更加稳定。
4. 因为叶子节点存储了所有数据，所以B+树的全局扫描能力更加强。因为它只需要扫描叶子节点即可，而B-树需要遍历整棵树。





另外基于B+树这样的数据结构，如果采用自增的整型数据作为主键，还能更好的避免数据增加的时候，带来的叶子节点的分裂，导致大量运算的问题。







## 聚簇索引、二级索引的主键 id 能不能由数据地址来替代，为什么？



# Kafka数据丢失问题分别从 producer, broker, consumer 来回答



**producer 端需**要确保消息能够到达 Broker，并且实现消息的存储。

有可能会出现网络问题，导致消息发送失败。真对 producer 端通过两种方式来避免消息丢失

1. producer 默认是异步发送消息，将异步发送改为同步发送。这样 producer 就能实时知道消息发送的结果。
2. 添加异步回调的函数来监听消息发送的结果，如果发送失败，可以在回调中重试。
3. producer 本身提供了一个重试参数：retries，如果因为网络问题或者 Broker 故障导致发送失败，producer 会自动重试。



**broker 端**：需要确保 producer 发送过来的消息不会丢失。将消失持久化到磁盘。kafka 为了提供性能采用了异步批量刷盘的机制，按照一定的消息量和时间间隔去刷盘。刷盘的动作是有系统调度实现的，所以如果刷盘前系统崩溃了，就会导致数据丢失。kafka 并没有提供同步刷盘的机制，需要通过 Partition 的副本机制和 acks 机制来解决。



consumer 必须要能消费这个小：

只要 producer 和 broker 能得到保障，consumer 端是不太可能出现消息丢失的。除非consumer 没有消费完这个消息，就已经提交了 offset，但是即便是出现这样的情况，我们也是可以通过重新调整 offset 的值，进行消息的重放。





# 自己项目中遇到了丢消息的场景， 如何来解决的。kafka 如何保证高可用， 高吞吐kafka 如何保证消息的有序性





# redis dubbo  事务 并发扣库存 各种锁实现



- 说一下自己参与度最深的项目
- HashMap的实现原理，扩容机制？链表、红黑树？6、8 树转化为什么这么设计？put、resize的过程
- ConcurrentHashMap是怎么实现的？
- HTTP与RPC协议的优缺点，为什么选择Http？
- SpringCloud有哪些组件？说下Nacos和服务客户端数据过程？限流、熔断、降级这俩有什么区别？
- Sentinel 限流算法是什么？ 限流算法有哪些？
- 项目的redis集群部署模式？，日增量、写入redis的总数据量多大？cluster集群针对某个节点扩容会发生什么变化？相关如何实现，算法了解吗？一致性hash算法了解吗？



- 分布式锁基于redis怎么实现？redisson解决什么问题？
- 介绍下clickhouse。为何要计算存储分离？

- 1、讲讲 IOC、AOP 、AOP 在项目中体现在哪些方面。
- 2、相比于 Spring，SpringBoot 有哪些变化或者优势。
- 3、Mybatis 在项目中的应用，相比于 JDBC 有哪些优势。
- 4、namespace 作用是什么。
- 5、SpringBoot 有哪些设计模式。
- 6、Redis 为什么这么快。



mysql 为什么用b+树，不用b树

select count(*), select count(1), select(索引) 什么区别

行锁

AQS为什么是双向队列，双向队列的头节点放的是什么，ConutDownLatch调用AQS原理

ThreadLocal内存泄漏

g1 有young gc吗

zgc有新生代吗

spring容器启动流程

redis分布式锁



- synchronized reentranlock区别，机制
- Java多线程项目中有没有用过，怎么用的
- Java的线程池，线程池参数
- Spring如何实现的多环境配置
- spring实现aop的机制
- spring aop的几个关键注解
- resisson watchdog机制
- Mysql事务隔离级别
- A，b，c联合索引
- 慢查询优化，怎么优化
- Redis的数据结构
- 单例模式怎么实现



- 一轮技术基础面试
- io、泛型、多线程、集合、并发等Java基础内容和实现原理
- 二轮技术领导面试
- Spring、SpringBoot、Mybaitis等框架，对RRC理解
- 三轮HR
- 过往 业绩，感受



-  讲一下大数据的组件
-  说一下你最熟悉的，然后讲一下原理
-  说一下索引 ，B+树 mysql的最左匹配
-  除了一个题问有没有遇到最左匹配，解释一下 事务特性 
-  事务隔离级别 
-  说一下HashMap原理 jdk1.7和jdk1.8 HashMap有什么改变
-  jvm内存模型 线程池了解吗，核心线程、队列、最大线程池定义 
-  一个http请求的过程 
-  算法题：合并两个有序链表 剑指offer 25