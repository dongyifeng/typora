---
typora-root-url: ../../../typora
---

[TOC]

# 概述

<img src="/images/juc/WX20230221-150637@2x.png" style="zoom:50%;" />



AQS（AbstractQueuedSynchronizer）字面意思：抽象队列同步器



AQS 是用来实现锁或者其他同步器组件的公共基础部分的抽象实现。是重量级基础框架及整个 JUC 体系的基石，主要用于<font color=red>解决锁分配给 “谁” 的问题</font>



<font color=red>加锁会导致阻塞，</font>有阻塞就需要<font color=red>排队</font>，实现排队必然需要<font color=red>队列</font>。



AQS 由一个抽象 FIFO <font color=red>队列 + int 类变量</font>组成

- CLH 双端队列：完成资源获取线程的排队工作。<font color=green>头部出队，尾部入队。</font>
- int 类变量：表示持有锁的状态：0 表示资源空闲，1 表示资源被占用。



锁与同步器的关系：

- 锁是面向使用者的，定义了程序员与锁交互使用的API，隐藏了实现细节，调用即可。
- 同步器是面向锁的实现者的，DougLee 提出统一规范并简化了锁的实现，<font color=red>将其抽象出来</font>，屏蔽了同步状态管理、同步队列的管理和维护、阻塞线程排队和通知、唤醒机制等，是一切锁和同步组件实现的<font color=red>公共基础部分</font>。



如下图：

- head 和 tail 是队列的头指针和尾指针，双端队列。
- 队列中数据（线程）被封装在 Node 对象中。
- volatile 的 int 类型 state 字段表示同步状态：0 表示资源空闲，1 表示资源被占用。通过 CAS 完成对 state 值的修改。

<img src="/images/juc/WX20230221-113629@2x.png" style="zoom:50%;" />



如下图：

- Node 对象中有 prev 和 next 指针，表明是一个双向队列。
- Thread 字段中存储需要阻塞（排队）的线程。
- waitStatus 表示排队线程的等待状态：

<img src="/images/juc/WX20230221-114318@2x.png" style="zoom:50%;" />





```java
class Node {
    // 表示线程以共享的模式等待锁
    static final Node SHARED = new Node();
    // 表示线程以独占的模式等待锁
    static final Node EXCLUSIVE = null;

    // 表示线程获取锁的请求已经取消
    static final int CANCELLED = 1;

    // 表示线程已经准备好了，就等待资源释放
    static final int SIGNAL = -1;

    // 表示节点在等待队列中，节点线程等待唤醒。等待 condition 唤醒
    static final int CONDITION = -2;

    // 共享式同步状态获取将会无条件地传播下去，当前线程处在 SHARED 情况下，该字段才会使用。
    static final int PROPAGATE = -3;

    // 初始值为 0，状态是上面的几种
    volatile int waitStatus;

    // 前置节点
    volatile Node prev;

    // 后继节点
    volatile Node next;

    // 需要排队的线程
    volatile Thread thread;

  	// 指向下一个处于 CONDITIION 状态的节点。
    Node nextWaiter;

    final boolean isShared() {
        return nextWaiter == SHARED;
    }

		// 返回前驱节点，没有的话抛出 NPE
    final Node predecessor() throws NullPointerException {
        Node p = prev;
        if (p == null)
            throw new NullPointerException();
        else
            return p;
    }
}
```



与 AQS 有关的锁

- ReentrantLock
- CountDownLatch
- ReentrantReadWriteLock
- Semaphore
- ...

<img src="/images/juc/WX20230221-110818@2x.png" style="zoom:50%;" />



<img src="/images/juc/WX20230221-110909@2x.png" style="zoom:50%;" />



<img src="/images/juc/WX20230221-111017@2x.png" style="zoom:50%;" />





# 源码分析

## 公平锁与非公平锁

Lock 的使用

```java
    public static void main(String[] args) {
        Lock lock = new ReentrantLock();
        lock.lock();

        try {

        } finally {
            lock.unlock();
        }
    }
```

<img src="/images/juc/WX20230221-154815@2x.png" style="zoom:50%;" />





<img src="/images/juc/WX20230221-162814@2x.png" style="zoom:50%;" />



**公平锁的 lock**

新来的线程去获取锁。

<img src="/images/juc/WX20230221-155957@2x.png" style="zoom:50%;" />



**非公平锁的 lock**

非公平锁多了 compareAndSetState ，新来的线程去尝试设置 AbstractQueuedSynchronizer 中的 state 字段，一旦设置设置成功，新来的线程就成功获取到锁了。这也是<font color=green>不公平地方。</font>因为此时可能 CLH 队列中有可能有等待的线程，也就是说新来的线程插队了。就像在银行窗口排队，新进来一个人看见窗口空闲，立马去抢占办理窗口，而没有取号。对于那些拿到号在排队的人来说，是不公平的。

如果新来线程抢到锁：setExclusiveOwnerThread(Thread.currentThread()); 将当前线程设置

![](/images/juc/WX20230221-155826@2x.png)



公平锁和非公平锁的 tryAcquire 方法实现也不一样。公平多一个 !hasQueuedPredecessors() 判断队列是否有前置节点（除了当前线程外，判断队列是否为空）。<font color=red>公平锁判断如果队列中有等待的线程，当前线程就不能去尝试抢锁。</font>

| 公平                                                         | 非公平                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| <img src="/images/juc/WX20230221-164348@2x.png" style="zoom:50%;" /> | <img src="/images/juc/WX20230221-164530@2x.png" style="zoom:70%;" /> |



判断除了当前线程外，CLA 队列中是否还有其他等待的线程。

```java
    public final boolean hasQueuedPredecessors() {
        Node t = tail; // Read fields in reverse initialization order
        Node h = head;
        Node s;
        return h != t &&
            ((s = h.next) == null || s.thread != Thread.currentThread());
    }
```



- 公平锁：讲究<font color=red>先来先得</font>，线程在获取锁时，如果 CLA 队列中已经有其他线程在等待，那么当前线程就会进入等待对列中。
- 非公平锁：不管是否有等待队列，如果可以获取锁，则立即占有锁对象。也就是队列的头节点线程苏醒后，不一定能获得锁，它还是需要参加竞争锁（存在线程竞争的情况下），后来的线程可能<font color=red>不讲武德</font>插队夺锁。



公平锁和非公平锁都会调用 acquire。

三个主要方法：

1. tryAcquire：尝试抢锁
2. addWaiter：将当前当前线程插入等待队列。
3. acquireQueued：当前线程入队后，尝试在抢一把锁。

```java
    public final void acquire(int arg) {
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
```



## Lock 过程

> 场景：A、B、C 三个顾客，去银行办理业务，A 先到，此时窗口空无一人，他优先获得办理窗口的机会，办理业务。



```java
    public static void main(String[] args) {
        Lock lock = new ReentrantLock();
        lock.lock();

        // A 耗时严重，估计长时间占有窗口。
        new Thread(() -> {
            lock.lock();
            try {
                System.out.println("come in A");
                // 暂停 20 分钟
                TimeUnit.MINUTES.sleep(20);
            } catch (Exception e) {
            } finally {
                lock.unlock();
            }
        }, "A").start();

        // B 是第 2 顾客，受理窗口被 A 占用，只能去等候区等待，进入 AQS 队列，等待 A 办理完成，尝试去抢占受理窗口
        new Thread(() -> {
            lock.lock();
            try {
                System.out.println("come in B");
            } catch (Exception e) {
            } finally {
                lock.unlock();
            }
        }, "B").start();

        // C 是第 3 顾客，受理窗口被 A 占用，只能去等候区等待，进入 AQS 队列，前边是 B
        new Thread(() -> {
            lock.lock();
            try {
                System.out.println("come in C");
            } catch (Exception e) {
            } finally {
                lock.unlock();
            }
        }, "C").start();
    }
```



<img src="/images/juc/WX20230221-150637@2x.png" style="zoom:50%;" />



初始化

<img src="/images/juc/WX20230221-180520@2x.png" style="zoom:50%;" />



**当 A 顾客到来，银行受理窗口空闲，A 直接去办理业务。**

compareAndSetState 期望 state 是 0，设置为 1。此时设置成功。setExclusiveOwnerThread(Thread.currentThread());  就是 A 顾客去窗口办理业务。

```java
        final void lock() {
            if (compareAndSetState(0, 1))
                setExclusiveOwnerThread(Thread.currentThread());
            else
                acquire(1);
        }
```



<img src="/images/juc/WX20230221-181113@2x.png" style="zoom:50%;" />



**B 是第 2 顾客，受理窗口被 A 占用，只能去等候区等待，进入 AQS 队列，等待 A 办理完成，尝试去抢占受理窗口**

顾客 B 调用 compareAndSetState(0,1) 失败。只能走 acquire(1) 

```java
        final void lock() {
            if (compareAndSetState(0, 1))
                setExclusiveOwnerThread(Thread.currentThread());
            else
                acquire(1);
        }
```



在 acquire(1) 中，调用 tryAcquire(arg) 尝试抢占锁，一路走到 nonfairTryAcquire(int acquires)，返回 false。
在 acquire(1) 中，由于 tryAcquire(arg) 返回 false，!tryAcquire(arg) 为 true，因此调用 addWaiter(Node.EXCLUSIVE)，将线程 B 入队。

```java
    public final void acquire(int arg) {
        if (!tryAcquire(arg) &&
            // Node.EXCLUSIVE 添加独占模式
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }

        protected final boolean tryAcquire(int acquires) {
            return nonfairTryAcquire(acquires);
        }

        final boolean nonfairTryAcquire(int acquires) {
           // 当前线程为 B
            final Thread current = Thread.currentThread();
          	// 此时 A 在占用窗口，所以 state = 1
            int c = getState();
            if (c == 0) {
              	// 如果 c == 0，表示窗口空闲，赶紧再抢一把锁。
                if (compareAndSetState(0, acquires)) {
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }
          	// getExclusiveOwnerThread() 获取的线程为 A
            else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0) // overflow
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
           // 此次线程 B 调用返回 false。
            return false;
        }

    private Node addWaiter(Node mode) {
      	// 为线程 B 生成 Node 对象。
        Node node = new Node(Thread.currentThread(), mode);
        
      	// 此时 tail 和 pred 为 null
        Node pred = tail;
        if (pred != null) {
            node.prev = pred;
            if (compareAndSetTail(pred, node)) {
                pred.next = node;
                return node;
            }
        }
      	// 入队
        enq(node);
        return node;
    }

    private Node enq(final Node node) {
       // 死循环
        for (;;) {
          	// 循环第一轮：此时 tail 和 t 为 null
            // 循环第二轮：此时 tail 和 t 为 哨兵节点
            Node t = tail;
          	// 为链表初始用
            if (t == null) { 
              	// 新增一个哨兵节点
                if (compareAndSetHead(new Node()))
                    tail = head;
            } else {
              	// 循环第二轮：将 node 节点插入链表尾部，返回结果，跳出死循环。
                node.prev = t;
                if (compareAndSetTail(t, node)) {
                    t.next = node;
                    return t;
                }
            }
        }
    }

```



至此节点B已经添加到得 CLH 队列中了，但是线程还没有阻塞。

```java
  // node 是 B，  arg = 1
	final boolean acquireQueued(final Node node, int arg) {
    		// 异常退出，需要取消排队
        boolean failed = true;
        try {
            boolean interrupted = false;
            for (;;) {
               // 循环第一轮：p 节点为哨兵节点（即 head）
                final Node p = node.predecessor();
              	// 如果 p 是head，那么 p 节点抢锁优先级最高，这里尝试一下抢锁。本次抢锁失败
                if (p == head && tryAcquire(arg)) {
                    setHead(node);
                    p.next = null; // help GC
                    failed = false;
                    return interrupted;
                }
              	// 当获取(资源)失败后，检查并且更新结点状态
              	// 循环第一轮：shouldParkAfterFailedAcquire(p, node) 返回 false
              	// 循环第二轮：shouldParkAfterFailedAcquire(p, node) 返回 ture，进入 parkAndCheckInterrupt()
                if (shouldParkAfterFailedAcquire(p, node) &&
                    parkAndCheckInterrupt())
                    interrupted = true;
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }

		// 当获取(资源)失败后，检查并且更新结点状态
    private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
      	// 第一次调用：pred 为 head 节点，node 是 B 节点，此时 ws = 0（默认值）
      	// 第二次调用：pred 为 head 节点，node 是 B 节点，此时 ws = -1（第一次修改）
        int ws = pred.waitStatus;
      	
        if (ws == Node.SIGNAL)
          	// 第二次调用：直接返回
            return true;
        if (ws > 0) {
            do {
                node.prev = pred = pred.prev;
            } while (pred.waitStatus > 0);
            pred.next = node;
        } else {
          	// 第一次调用：ws = 0,走这个分支，将 pred 的 waitStatus 设置为 -1
            compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
        }
        return false;
    }

    private final boolean parkAndCheckInterrupt() {
      	//阻塞线程
        LockSupport.park(this);
        return Thread.interrupted();
    }


    // 表示线程获取锁的请求已经取消
    static final int CANCELLED = 1;
    // 表示线程已经准备好了，就等待资源释放
    static final int SIGNAL = -1;
    // 表示节点在等待队列中，节点线程等待唤醒。等待 condition 唤醒
    static final int CONDITION = -2;
    // 共享式同步状态获取将会无条件地传播下去，当前线程处在 SHARED 情况下，该字段才会使用。
    static final int PROPAGATE = -3;
```



<img src="/images/juc/WX20230222-153613@2x.png" style="zoom:50%;" />

**C 是第 3 顾客，受理窗口被 A 占用，只能去等候区等待，进入 AQS 队列，前边是 B**

顾客 C 与顾客 B 过程类似，只是不需要创建链表的哨兵节点，直接将节点 C ，插入队尾。

<img src="/images/juc/WX20230222-153744@2x.png" style="zoom:50%;" />





## unLock 过程

如下图：线程 A 已经释放资源的过程。

```java
    public void unlock() {
        sync.release(1);
    }

    public final boolean release(int arg) {
      	// 线程 A 尝试释放资源
        if (tryRelease(arg)) {
          	// 线程 A 释放资源完毕后。等待列表头部节点（哨兵节点除外）最应该抢占资源
            Node h = head;
            if (h != null && h.waitStatus != 0)
                unparkSuccessor(h);
            return true;
        }
        return false;
    }

        protected final boolean tryRelease(int releases) {
          	// getState() 获取的值为 1，releases = 1 则 c = 1 - 1 = 0
            int c = getState() - releases;
          	// 正确性校验
            if (Thread.currentThread() != getExclusiveOwnerThread())
                throw new IllegalMonitorStateException();
            boolean free = false;
            if (c == 0) {
              	// 释放资源
                free = true;
                setExclusiveOwnerThread(null);
            }
          	// 将 state 设置为 0
            setState(c);
          	// 返回 true
            return free;
        }

		// 唤醒
    private void unparkSuccessor(Node node) {
      	// node 为哨兵节点：waitStatus = -1
        int ws = node.waitStatus;
        if (ws < 0)
          	// 将哨兵节点的 waitStatus 赋值为 0
            compareAndSetWaitStatus(node, ws, 0);
      
      	// s 为节点 B，waitStatus = -1
        Node s = node.next;
        if (s == null || s.waitStatus > 0) {   // 此路不通
            s = null;
            for (Node t = tail; t != null && t != node; t = t.prev)
                if (t.waitStatus <= 0)
                    s = t;
        }
        if (s != null)
          	// 唤醒节点 B 的线程
            LockSupport.unpark(s.thread);
    }


    private final boolean parkAndCheckInterrupt() {
        LockSupport.park(this); // 线程 B 被唤醒
      	// 由于线程 B 被唤醒，Thread.interrupted() 为 false
        return Thread.interrupted();
    }

    final boolean acquireQueued(final Node node, int arg) {
        boolean failed = true;
        try {
            boolean interrupted = false;
            for (;;) {
               // 2. 节点 B 的前置节点为 head (哨兵节点)
                final Node p = node.predecessor();
              	// p == head，节点 B 去抢夺资源成功。在非公平锁是，节点 B 有可能抢夺失败
                if (p == head && tryAcquire(arg)) {
                  	// 下边代码是从等待队列中移除节点 B。策略：将节点 B 作为哨兵节点，移除 p（之前的哨兵节点）
                    // 设置新的 head 为node（node 成为新的哨兵节点）
                    setHead(node);
                  	// 旧的哨兵节点断开链接，后续被垃圾回收
                    p.next = null; // help GC
                    failed = false;
                  	// 返回 false
                    return interrupted;
                }
              	// 1.线程 B 的 parkAndCheckInterrupt() 为 false，进入下次循环。
                if (shouldParkAfterFailedAcquire(p, node) &&
                    parkAndCheckInterrupt())
                    interrupted = true;
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }

    public final void acquire(int arg) {
      	// 节点 B 的 acquireQueued(addWaiter(Node.EXCLUSIVE), arg) 返回 false。此方法执行完毕。
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
```



如下图：线程 A 释放资源后的状态

<img src="/images/juc/WX20230222-154210@2x.png" style="zoom:50%;" />



如下图：线程 B 抢占资源后

![](/images/juc/WX20230222-162436@2x.png)

## 线程取消排队过程



```java
    final boolean acquireQueued(final Node node, int arg) {
        boolean failed = true;
        try {
            boolean interrupted = false;
            for (;;) {
                final Node p = node.predecessor();
                if (p == head && tryAcquire(arg)) {
                    setHead(node);
                    p.next = null; // help GC
                    failed = false;
                    return interrupted;
                }
                if (shouldParkAfterFailedAcquire(p, node) &&
                    parkAndCheckInterrupt())
                    interrupted = true;
            }
        } finally {
          	// 由于异常，线程走到此处
            if (failed)
              	// 此方法目的：将 node 节点从等待队列中移除。
                cancelAcquire(node);
        }
    }

    // 表示线程获取锁的请求已经取消
    static final int CANCELLED = 1;
    // 表示线程已经准备好了，就等待资源释放
    static final int SIGNAL = -1;
    // 表示节点在等待队列中，节点线程等待唤醒。等待 condition 唤醒
    static final int CONDITION = -2;
    // 共享式同步状态获取将会无条件地传播下去，当前线程处在 SHARED 情况下，该字段才会使用。
    static final int PROPAGATE = -3;

    private void cancelAcquire(Node node) {
        if (node == null)
            return;

    		// 将线程置空
        node.thread = null;
      
        Node pred = node.prev;
      	// pred.waitStatus > 0 表示节点状态为：已取消。node 之前节点也可能是已取消状态，需要找到最前边的不取消的节点给 pred
        while (pred.waitStatus > 0)
            node.prev = pred = pred.prev;
        Node predNext = pred.next;
			
        node.waitStatus = Node.CANCELLED;

        // 如果 node 是 tail，需要特殊处理，直接将 pred 节点设置为 tail
        if (node == tail && compareAndSetTail(node, pred)) {
          	// pred.next = null
            compareAndSetNext(pred, predNext, null);
        } else {
            int ws;
            if (pred != head &&
                ((ws = pred.waitStatus) == Node.SIGNAL ||
                 (ws <= 0 && compareAndSetWaitStatus(pred, ws, Node.SIGNAL))) &&
                pred.thread != null) {
                Node next = node.next;
              	// next.waitStatus <= 0：next 节点是非取消状态
                if (next != null && next.waitStatus <= 0)
                  	// pred.next = next
                    compareAndSetNext(pred, predNext, next);
            } else {
              	// 唤醒 node
                unparkSuccessor(node);
            }

            node.next = node; // help GC
        }
    }
```

线程取消排队的两种情况:

1. 尾节点取消排队
2. 中间节点取消排队

注意：可能存在已经连续取消的节点，一并处理了。

![](/images/juc/WX20230222-165926@2x.png)



# 总结

