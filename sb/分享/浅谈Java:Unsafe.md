Unsafe 是位于 sun.misc 包下的一个类，主要提供一些用于执行低级别、不安全操作的方法，如直接访问系统内存资源、自主管理内存资源等，这些方法在提升 Java 运行效率、增强 Java 语言底层资源操作能力方面起到了很大的作用。但由于 Unsafe 类使 Java 语言拥有了类似 C 语言指针一样操作内存空间的能力，这无疑也增加了程序发生相关指针问题的风险。在程序中过度、不正确使用 Unsafe 类会使得程序出错的概率变大，使得 Java 这种安全的语言变得不再“安全”，因此对 Unsafe 的使用一定要慎重。

# 一 如何调用

- 加载

  - 当且仅当调用 getUnsafe 方法的类为引导类加载器所加载时才 合法，否则抛出 SecurityException异常

  ![](/Users/dongyifeng/dongyf/git/typora/images/sb/1280X1280 (5).png)



- 调用

  - 通过反射获取单例对象 Unsafe

  ![](/Users/dongyifeng/dongyf/git/typora/images/sb/1280X1280 (6).png)



# 二 功能介绍

1. ##  内存操作 

![](/Users/dongyifeng/dongyf/git/typora/images/sb/1280X1280 (7).png)



在 Java 中创建的对象都处于堆内内存（heap）中，堆内内存是由 JVM 所管控的 Java 进程内存，并且它们遵循 JVM 的内存管理机制，JVM 会采用 垃圾回收机制统一管理堆内存。与之相对的是堆外内存，存在于 JVM 管控之外的内 存区域，Java 中对堆外内存的操作，依赖于 Unsafe 提供的操作堆外内存的 native 方法。 

-  使用堆外内存的原因
  - 对外内存是操作系统管理的，减少GC影响 
  - 减少堆内外数据拷贝，提升IO性能 

 

- 典型应用：DirectByteBuffer 

通信过程中做缓冲池，在 Netty、MINA 等 NIO 框架中应用广泛，DirectByteBuffer 对于 堆外内存的创建、使用、销毁等逻辑均由 Unsafe 提供的堆外内存 API 来实现。

创 建 DirectByteBuffer 的 时 候， 通 过 Unsafe.allocateMemory 分配内存、Unsafe.setMemory 进行内存初始化，而后 构建 Cleaner 对象用于跟踪 DirectByteBuffer 对象的垃圾回收，以实现当 Direct- ByteBuffer 被垃圾回收时，分配的堆外内存一起被释放。

![](/Users/dongyifeng/dongyf/git/typora/images/sb/1280X1280 (8).png) 



-  如何实现堆外内存释放

垃圾回收追踪对象--Cleaner， 继承自 Java 四大引用类型之一的虚引用 PhantomReference（众 所周知，无法通过虚引用获取与之关联的对象实例，且当对象仅被虚引用引用时， 在任何发生 GC 的时候，其均可被回收），通常 PhantomReference 与引用队列 ReferenceQueue 结合使用，可以实现虚引用关联对象被垃圾回收时能够进行系 统通知、资源清理等功能。当某个被 Cleaner 引用的对象将被回收 时，JVM 垃圾收集器会将此对象的引用放入到对象引用中的 pending 链表中，等待 Reference-Handler 进行相关处理。其中，Reference-Handler 为一个拥有最高 优先级的守护线程，会循环不断的处理 pending 链表中的对象引用，执行 Cleaner 的 clean 方法进行相关清理工作 。

1. ## CAS相关 

![](/Users/dongyifeng/dongyf/git/typora/images/sb/1280X1280 (9).png)



CAS 操 作包含三个操作数——内存位置、预期原值及新值。执行 CAS 操作的时候，将内存位置值与预期原值比较，如果相匹配，那么处理器会自动将该位置值更新为 新值，否则，处理器不做任何操作。CAS 是一条 CPU 的原子指令 （cmpxchg 指令），不会造成数据不一致问题，Unsafe 提供的 CAS 方法（如 compareAndSwapXXX）底层实现即为 CPU 指令 cmpxchg。 

 

- 典型应用 

CAS 在 java.util.concurrent.atomic 相关类、Java AQS、CurrentHashMap 等实现上有非常广泛的应用。如下图所示，AtomicInteger 的实现中，静态字段 valueOffset 即为字段 value 的内存偏移地址，valueOffset 的值在 AtomicInteger 初 始 化 时， 在 静 态 代 码 块 中 通 过 Unsafe 的 objectFieldOffset 方 法 获 取。 在 AtomicInteger 中提供的线程安全方法中，通过字段 valueOffset 的值可以定位到 AtomicInteger 对象中 value 的内存地址，从而可以根据 CAS 实现对 value 字段的 原子操作。 

 AtomicInteger类中的getAndSet方法: 

![](/Users/dongyifeng/dongyf/git/typora/images/sb/1280X1280 (10).png)



 

1. var1 Atomiclnteger对象本身。 

1. var2该对象值得引用地址。 

1. var4需要变动的数量。 

1. var5是用过var1 var2找出的主内存中真实的值。 

1. 用该对象当前的值与var5比较: 

1. 如果相同，更新var5+var4并且返回true, 如果不同，继续取值然后再比较，直到更新完成。 

![](/Users/dongyifeng/dongyf/git/typora/images/sb/1280X1280 (11).png)



 

1. ## 线程调度 

包括线程挂起、恢复、锁机制等方法。 

![](/Users/dongyifeng/dongyf/git/typora/images/sb/1280X1280 (12).png)

![](/Users/dongyifeng/dongyf/git/typora/images/sb/1280X1280 (13).png)

 

方法 park、unpark 即可实现线程的挂起与恢复，将一个线程 进行挂起是通过 park 方法实现的，调用 park 方法后，线程将一直阻塞直到超时或者中断等条件出现；unpark 可以终止一个挂起的线程，使其恢复正常 

 

- 典型应用：AbstractQueuedSynchronizer 

Java 锁和同步器框架的核心类 AbstractQueuedSynchronizer，就是通过调 用 LockSupport.park() 和 LockSupport.unpark() 实现线程的阻塞和唤醒的，而 LockSupport 的 park、unpark 方法实际是调用 Unsafe 的 park、unpark 方式来 实现。 

![](/Users/dongyifeng/dongyf/git/typora/images/sb/226f18bf-ec40-468c-a657-71c901574ec6.png)



1. ## class相关 

提供 Class 和它的静态字段的操作相关方法，包含静态字段内存定 位、定义类、定义匿名类、检验 & 确保初始化等 

 

1. ## 对象操作 

主要包含对象成员属性相关操作及非常规的对象实例化方式等相关方法。

- 常规：new 一个对象，new 机制有个特点就是当类只提 供有参的构造函数且无显示声明无参构造函数时，则必须使用有参构造函数进行对象构造。

- 非常规：Unsafe 中提供 allocateInstance，仅通过 Class 对象就可以创建此类的实例对象，而且不需要调用其构造函数、初始化 代码、JVM 安全检查等。它抑制修饰符检测，也就是即使构造器private 修饰的也能通过此方法实例化，只需提类对象即可创建相应的对象。由于这种特性allocateInstance 在 java.lang.invoke、Objenesis（提供绕过类构造器 的对象生成方式）、Gson（反序列化时用到）中都有相应的应用。 

 

- 典型应用：unsafeallocator 

![](/Users/dongyifeng/dongyf/git/typora/images/sb/4da1d247-704c-4003-afd5-9332d8145d37.png)

![](/Users/dongyifeng/dongyf/git/typora/images/sb/ae9ea66e-df8a-4b52-9dd2-5dcfb195bad0.png)



Gson 反序列化时，如果类有默认构造函数，则通过反射调用默认构造函数创建实例，否则通过 UnsafeAllocator 来实现对象实例的构造， UnsafeAllocator 通过调用 Unsafe 的 allocateInstance 实现对象的实例化，保证 在目标类无默认构造函数时，反序列化不够影响。

1. ## 数组相关 

和数据操作相关的有两个方法 arrayBaseOffset(返回数组中第一个元素的偏移地址) 与 arrayIndexScale(返回数组中一个元素占用大小) ，两者配合起来使用，即可定位数组中每个元素在内存中的位置。

![](/Users/dongyifeng/dongyf/git/typora/images/sb/22cc3cac-f9df-44ad-9c5c-2ec83a822305.png) 



- 典型应用：AtomicIntegerArray

通过 Unsafe 的 arrayBaseOffset、 arrayIndexScale 分别获取数组首元素的偏移地址 base 及单个元素大小因子 scale。 后续相关原子性操作，均依赖于这两个值进行数组中元素的定位，如下图所示的 getAndAdd 方法即通过 checkedByteOffset 方法获取某数组元素的偏移地址，而后通过 CAS 实现原子性操作。 

![](/Users/dongyifeng/dongyf/git/typora/images/sb/e224b09e-7fb3-44e7-9c45-ce450cd854ae.png)

![](/Users/dongyifeng/dongyf/git/typora/images/sb/1c77c9dd-2598-4694-9bee-6623b2a83dfe.png)



1. ## 内存屏障  

loadFence：禁止 load 操作重排序 

storeFence：禁止 store 操作重排序 

fullFence：禁止 load、store 操作重排序  

![](/Users/dongyifeng/dongyf/git/typora/images/sb/01f7efc1-7cea-411b-b722-040c016f8195.png)



内存栅栏是同步屏障指令，此点之前的操作执行完成后才能执行此点之后的操作 避免代码重排序

- 典型应用： StampedLock
  - 读写锁
  - 乐观读锁，不会阻塞写锁，缓解线程饥饿，比常规读写锁更快
  - 会存在数据不一致问题

- 如何确保数据一致性

![](/Users/dongyifeng/dongyf/git/typora/images/sb/84f8dd5b-00fa-4b36-9741-2fd244b0f0d2.png)

![](/Users/dongyifeng/dongyf/git/typora/images/sb/cfd708a4-28c9-4c89-943b-7be2149615f7.png)



以上是官方给出的一个样例：

- ​        上图用例所示计算坐标点 Point 对象，包含点移动方法 move 及计算此点到原点的距离的方法 distanceFromOrigin。

- - 首先，通过 tryOptimisticRead 方法获取乐观读标记;
  - 然后从主内存中加载点的坐标值 (x,y); 
  - 而后通过 StampedLock 的 validate 方法校验锁状态，判断坐标点 (x,y) 从主内存加 载到线程工作内存过程中，主内存的值是否已被其他线程通过 move 方法修改，如果 validate 返回值为 true，证明 (x, y) 的值未被修改，可参与后续计算;
  - 否则，需加悲 观读锁，再次从主内存加载 (x,y) 的最新值，然后再进行距离计算。

其中，校验锁状态这步操作至关重要，需要判断锁状态是否发生改变，从而判断之前 copy 到线程工 作内存中的值是否与主内存的值存在不一致。

下图为 StampedLock.validate 方法的源码实现，通过锁标记与相关常量进行位运算、比较来校验锁状态，在校验逻辑之前，会通过 Unsafe 的 loadFence 方法加 入一个 load 内存屏障，目的是避免上图用例中步骤2和 StampedLock.validate 中锁状态校验运算发生重排序导致锁状态校验不准确的问题。

![](/Users/dongyifeng/dongyf/git/typora/images/sb/27973257-9eee-4d3c-ab3a-86be8031261e.png)



1. ## 系统相关 

public native int addressSize()：返回系统指针的大小。返回值为 4（32 位系统）或 8（64 位系统）。 

public native int pageSize()：内存页的大小，此值为 2 的幂次方。  

![](/Users/dongyifeng/dongyf/git/typora/images/sb/6ae6a403-3c9b-4a62-9a58-21d520c96136.png)



 

java.nio 下的工具类 Bits 中计算待申请内存所需内存页数量的静态方法，其依赖于 Unsafe 中pageSize 方法获取系统内存页大小实现后续计算逻辑。 

![](/Users/dongyifeng/dongyf/git/typora/images/sb/4a7e15c7-5d3d-4def-a882-6202c693c0e3.png)



参考资料：

《2019-2021美团技术年货-后端篇》

《深入理解 Java 虚拟机(第 2 版)》 

《[JAVA中神奇的双刃剑--Unsafe](https://www.cnblogs.com/throwable/p/9139947.html)》