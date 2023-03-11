---
typora-root-url: ../../../typora

---

[TOC]

CAS（compare and swap）<font color=red>比较并交换</font>，实现并发算法时常用的一种技术。



**CAS 包含三个操作数：**

- 内存位置
- 预期原值
- 更新值



执行 CAS 操作的时候，将内存位置的值与预期原值比较：

- 如果相<font color=red>匹配</font>，那么处理器会自动将该位置值更新为新值。
- 如果<font color=red>不匹配</font>，处理器不做任何操作。

多线程同时执行 CAS 操作<font color=red>只有一个会成功</font>



当线程 CAS 失败后，可以什么都不做也可以重来。<font color=red>当其重来重试的行为成为--自旋。</font>

如下图：

- 内存中的数据是 7，有三个线程要同时 i ++；每个线程都拿到了内存中 i 的数据 （<font color=red>i 的数据保持线程私有栈中</font>），线程 2 优先完成了 i ++，并修改了内存结果。
- 线程 1 为了完成 i++，只能重试（自旋），重新获取 i 的值再 ++。



**CAS** 

<img src="/images/juc/WX20230302-223239@2x.png" style="zoom:30%;" />





CAS 是 JDK 提供的非阻塞原子性操作，它通过<font color=red>硬件保证了比较-更新的原子性</font>

CAS 是一条 CPU 的原子指令（ cmpxchg 指令），不会造成数据不一致问题。

注意：执行 cmpxchg 指令的时候，会判断当前系统是否为多核系统

- 如果是就给总线加锁，只有一个线程会对总线加锁成功，加锁之后执行 CAS 操作。也就是说<font color=red> CAS 的原子性实际是 CPU 实现独占。</font>

```java
   AtomicInteger atomicInteger = new AtomicInteger(5);
        atomicInteger.compareAndSet(1, 2);    

// this 对象中内存地址为 valueOffset 的值是否等于 expect
// 如果等于：给内存地址为 valueOffset 赋值为 update
// 否则什么也不做
public final boolean compareAndSet(int expect, int update) {
        return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
    }

// var1:要操作的对象
// var2:操作对象中属性地址的偏移量
// var4:需要修改数据的期望的值
// var5:需要修改为的新值
public final native boolean compareAndSwapInt(Object var1, long var2, int var4, int var5);
```

 

原子 类：java.util.atomic 的类
