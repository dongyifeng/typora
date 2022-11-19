[TOC]

# 简介

DelayQueue==是一个无界的阻塞队列==，并且是一个==延迟队列==，还是一个==优先级队列==。

该队列中每个元素都有一个过期时间，只有在过期时间到期的时候，才可以从中获取元素；也就是说往队列中插入数据时(生产者)是不会被阻塞的，而只有在获取数据的时候(消费者)才会被阻塞。



队列的头部是过期时间到期后保存时间最长的 Delayed 元素。如果没有过期时间到期的元素，则队列没有头部，并且poll将返回null。而当一个元素的 `getDelay(TimeUnit.NANOSECONDS)` 方法返回一个小于或等于零的值时，则说明过期时间到了，poll就可以移除这个元素了，还有此队列不允许使用 null 元素。

# 源码

```java
public class DelayQueue<E extends Delayed> extends AbstractQueue<E>
    implements BlockingQueue<E> {
```

- DelayQueue实现了BlockingQueue接口，表明该队列是个阻塞队列

```java
public interface Delayed extends Comparable<Delayed> {
    // 返回0或者负数，表示元素已经过期
    long getDelay(TimeUnit unit);
}
```

- Delayed接口是用来标记那些应该在给定延迟时间之后执行的对象。该对象只有一个方法getDelay，返回该任务剩余的过期时间（需要给定时间单位）。
- 由于该对象扩展自Comparable，所以放入该队列的元素要实现对应的compareTo方法，DelayQueue会通过这个对队列里的元素来进行排序（优先级队列）。

## 属性

```java
private final transient ReentrantLock lock = new ReentrantLock();
private final PriorityQueue<E> q = new PriorityQueue<E>();
private Thread leader = null;
private final Condition available = lock.newCondition();
```

- 可重入锁 ReentrantLock 用于多线程下的加锁操作。
- 优先级队列 PriorityQueue，将会根据 Delay 对象中的时间排序。
- Condition对象，用于线程阻塞和通知的关键对象；当队首有新元素可用或者有新线程成为 leader 时会触发Condition条件。
- 线程leader（也就是 Leader-Follower 模型中的 leader），用于优化阻塞通知的线程对象；leader 线程用于减少线程间获取数据竞争用的，如果 leader 不为空，说明已经有线程在获取数据了，然后当前线程进入等待状态即可。

流程：

> DelayQueue 内部维护了一个 PriorityQueue，也就是优先级队列；在每次往优先级队列中添加元素时会以元素的过期时间作为排序条件，最先过期的元素放在优先级最高的位置，也就是队头的位置。所以也可以这么说，DelayQueue是一个使用优先队列实现的无界的阻塞队列，优先级队列的比较基准是时间。

## 方法

### add/put/offer方法

```java
public boolean add(E e) {
    return offer(e);
}
public void put(E e) {
    offer(e);
}
public boolean offer(E e, long timeout, TimeUnit unit) {
    return offer(e);
}

public boolean offer(E e) {
    // 获取可重入锁
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        // 往优先级队列中添加元素
        q.offer(e);
        // 如果队列的头部元素(优先级最高的元素)等于添加的元素
        if (q.peek() == e) {
            // 将线程leader设置为null
            leader = null;
            // 唤醒一个等待的线程
            available.signal();
        }
        // 无界队列都返回true
        return true;
    } finally {
        lock.unlock();
    }
}
```

### poll 方法 

poll 方法表示返回并删除队列的头部元素(出队)

```java
public E poll() {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        // 获取队头元素
        E first = q.peek();
        // 判断队头元素是否为空，或者不为空的情况下队头元素是否到期
        if (first == null || first.getDelay(NANOSECONDS) > 0)
            return null;
        else
            return q.poll();
    } finally {
        lock.unlock();
    }
}
```

- 首先获取对象锁；
- 其次判断队列是否为空(如果队列为空，peek方法会返回null)，队列为空，返回null；
- 如果队列不为空，则判断队头元素是否过期，如果对头元素没有过期，返回null；
- 其他情况的话，返回并删除队列的头部元素；



```java
public E poll(long timeout, TimeUnit unit) throws InterruptedException {
    // 首先，将超时等待时间转换为纳秒单位
    long nanos = unit.toNanos(timeout);
    final ReentrantLock lock = this.lock;
    // 获取锁，如果没有获取到，线程进入等待状态，但该线程能够响应中断，即中断线程的等待状态
    lock.lockInterruptibly();
    try {
        // 无限循环操作
        for (;;) {
            E first = q.peek();
            // 队列是否为空
            if (first == null) {
                // 如果队列是空的，并且超时时间不大于0，直接返回
                if (nanos <= 0)
                    return null;
                else
                    // 如果队列为空，并且超时时间大于0，进入等待状态
                    nanos = available.awaitNanos(nanos);
            } else {
                // 如果队列不为空，获取队头元素剩余的过期时间
                long delay = first.getDelay(NANOSECONDS);
                // 队头元素过期了，出队
                if (delay <= 0)
                    return q.poll();
                // 队头元素没有过期，但超时时间不大于0，返回null
                if (nanos <= 0)
                    return null;
                first = null; // don't retain ref while waiting
                // 如果超时等待时间 < 元素过期时间 或者有其他的线程在获取数据
                if (nanos < delay || leader != null)
                    // 进入等待
                    nanos = available.awaitNanos(nanos);
                else {
                    // 这时候 超时等待时间 >= 元素过期时间，并且没有其他线程获取数据
                    // 那么把当前线程作为leader，表示该leader线程最早开始等待获取元素
                    Thread thisThread = Thread.currentThread();
                    leader = thisThread;
                    try {
                        // 等待元素过期，这时候会释放锁；等过期后再重新获取锁
                        long timeLeft = available.awaitNanos(delay);
                        // 重新计算最新的超时时间
                        nanos -= delay - timeLeft;
                    } finally {
                        // 如果当前线程仍然是leader线程，操作完成，清除掉leader
                        if (leader == thisThread)
                            leader = null;
                    }
                }
            }
        }
    } finally {
        // 唤醒对应的线程
        if (leader == null && q.peek() != null)
            available.signal();
        lock.unlock();
    }
}
```

- 先判断队列是否为空，如果为空，再判断超时时间是否大于0，如果不大于0，直接返回null;如果超时时间大于0，进入等待状态；

- 如果队列不为空，判断元素是否过期，过期出队；如果元素没有过期，但超时时间不大于0，直接返回null；

- 如果队列不为空，但不满足上述条件，则判断 超时等待时间是否小于元素过期时间，如果小于或者有其他线程再获取数据，进入等待状态；

- 如果超时等待时间大于元素过期时间，并且没有其他线程获取数据，那么把当前线程设为leader线程，并等待元素过期；

- 最后操作完成之后，把leader线程设置为null，让其他线程接着进行操作；

  

  Condition在阻塞时会释放锁，在被唤醒时会再次获取锁，当释放锁后，其他线程就会参与竞争，这样某个线程就会成为leader线程了



### take 方法

take方法同样用于出队，不过该方法是阻塞方法。

```java
public E take() throws InterruptedException {
    final ReentrantLock lock = this.lock;
    lock.lockInterruptibly();
    try {
        for (;;) {
            E first = q.peek();
            // 队列是否为空，为空则进入等待，直到被唤醒
            if (first == null)
                available.await();
            else {
                long delay = first.getDelay(NANOSECONDS);
                // 队头元素是否过期
                if (delay <= 0)
                    return q.poll();
                first = null; // don't retain ref while waiting
                // 是否有其他元素在获取元素，如果有，进行等待；
                if (leader != null)
                    available.await();
                else {
                    // 如果没有，将当前线程设置为leader，并等待元素过期
                    Thread thisThread = Thread.currentThread();
                    leader = thisThread;
                    try {
                        available.awaitNanos(delay);
                    } finally {
                        if (leader == thisThread)
                            leader = null;
                    }
                }
            }
        }
    } finally {
        // 唤醒Conditon条件
        if (leader == null && q.peek() != null)
            available.signal();
        lock.unlock();
    }
}
```



# 应用场景

了解了DelayQueue的实现原理之后，我们可以很明白的分析出他的应用场景：

- 缓存实现，用DelayQueue保存元素在缓存中的有效期，然后用一个线程循环查询delayQueue，清除缓存中超时的数据；
- 定时任务处理，将定时任务及和执行时间保存到DelayQueue中，然后同样用一个线程循环查找，获取到任务就执行

# Demo

## 定义Delayed对象

```java
static class DelayObj implements Delayed {
   /** 延迟时间，毫秒保存 */
   private long delayTime;
   /** 要执行的任务 */
   private String data;

   public DelayObj(long delayTime, String data) {
       this.delayTime = delayTime + System.currentTimeMillis();
       this.data = data;
   }
   // get,set方法省略

   // 获取剩余过期时间
   @Override
   public long getDelay(TimeUnit unit) {
       return unit.convert(this.delayTime - System.currentTimeMillis(), TimeUnit.MILLISECONDS);
   }

   // 比较方法
   @Override
   public int compareTo(Delayed o) {
       return (int) (this.getDelay(TimeUnit.MILLISECONDS) - o.getDelay(TimeUnit.MILLISECONDS));
   }
```

## 定义生产及消费者

```java
public class BlockingQueueTest {
    /** 线程池 */
    private static ExecutorService executorService =  Executors.newFixedThreadPool(3);

    public static void main(String[] args) {
        DelayQueue<DelayObj> delayQueue = new DelayQueue<>();
        //生产者
        producer(delayQueue);
        //消费者
        consumer(delayQueue);
    }

    private static void producer(DelayQueue<DelayObj> delayQueue) {
        executorService.submit(() -> {
            for (int i = 1; i <= 10; i++){
                // 延迟时间分别是1秒到10秒
                DelayObj delayObj = new DelayObj(i * 1000,"test" + i);
                delayQueue.offer(delayObj);
            }
        });
    }
    private static void consumer(DelayQueue<DelayObj> delayQueue) {
        executorService.submit(() -> {
            while (true) {
                DelayObj delayObj = null;
                try {
                    delayObj = delayQueue.take();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                // 打印队列元素
                System.out.println("consumer --> " + delayObj);
            }
        });
    }
}
```

# 总结

- DelayQueue是一个无界的可延迟的阻塞队列，往队列中插入数据时不会阻塞，只有在获取数据到时候才会被阻塞；
- 该队列中每个元素都有一个过期时间，内部维护了一个优先级队列 PriorityQueue，然后通过元素的过期时间进行优先级的排序；
- 该队列中的元素要实现Delayed接口，并实现它的getDelay方法，并且由于该对象扩展自Comparable，所以放入该队列的元素还要实现对应的compareTo方法；
- DelayQueue没有实现序列化接口；

参考：https://www.jianshu.com/p/05e7a4f72d90

