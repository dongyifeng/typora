---
typora-root-url: ../../../typora
---

[TOC]

# CAS 机制

CAS 是 Java 中 Unsafe 类里面的一个方法。Compare And Swap（比较并交换的意思）

- 主要功能：在多线程的环境下，对共享变量修改保证<font color=red>原子性</font>

  下边的例子，在单线环境下没有问题，但是在多线程环境下，会存在原子性问题。这里是一个典型的 Read-Write 的一个操作。一般情况下，我们会这个加一个 synchronized 的同步锁，来解决这样一个原子性操作。加同步锁异一定会带来性能上的损耗。对于这一类的场景，可以使用 CAS 机制来优化，

  

  ```java
  public class Example{
    private int a = 0;
    public void doSomething(){
      if(a==0){
         a = 1;
      }
    }
  }
  ```

  优化后

  ```java
  public class Example{
    private volatile int a = 0;
    
    private static final Unsafe unsafe = Unsafe.getUnsafe();
    private static final long = stateOffset;
    
    static{
      try{
        stateOffset = unsafe.objectFieldOffset(Example.class.getDeclaredField("a"));
      }catch(Exception ex){
        throw new Error(ex);
      }
    }
    
    public void doSomething(){
      if(unsafe.compareAndSwapInt(this,stateOffset,0,1)){
         a = 1;
      }
    }
  }
  ```

  

- Unsafe 的 compareAndSwapInt 有四个参数：

  - 当前实例
  - 成员变了在内存的地址
  - 预期值
  - 期望更改之后的值

  CAS 机制会比较 <font color=red>内存地址对应的值与传入的预期值是否相等</font>。

  - 如果相等，就直接修改内存地址中值为传入的期望更新值。返回：true
  - 否则：返回 false，表示修改失败。

  这个过程是原子的，不会存在线程安全的问题。CAS 是一条 CPU 的原子指令（ cmpxchg 指令），不会造成数据不一致问题。但是如果 CPU 是多核的话，底层 CAS 会增加一个 lock 执行，来对缓存或者总线去加锁，从而保证 CAS 的原子性。

- CAS 会有 ABA 问题

  过程

  - 线程 A 读取一个成员变量的值 10
  - 线程 B 将这个成员变量的值改为 20
  - 线程 C 将这个成员变量的值改为 10
  - 线程 A 如果要修改成员变量的时候，发现变量的值没有变化还是 10。

  解决方法：

  - 使用乐观锁，使用版本号，每次修改版本号都 +1
  - 在 CAS 时，不但要比较数值是否相等，还要比较版本号是否相等。

  

- 使用场景：

  - JUC 里面 Atomic 的原子实现
  - 实现多线程对共享资源竞争的互斥特性
    - 比如 AQS

<img src="/images/tmp/682616-20200826143204816-919290724.jpg" style="zoom:80%;" />



# volatile 变量的特性

volatile 关键词有两个作用

- 保证在多线程环境下，<font color=red>共享变量的可见性</font>。
- 通过增加<font color=red>内存屏障</font>防止多个指令之间的重排序。



**可见性**

可见性：当一个线程对于共享变量的修改，其他线程立刻看到修改后的一个值。

造成可见性的原因：CPU 为了执行效率，设计了三级缓存，这就带来了缓存一致性问题。在多线程环境下，<font color=green>缓存一致性</font>的问题就会导致可见性的问题。

可见性的<font color=green>**底层原理**</font>：对于 volatile 修改是变量，JVM 自会自动增加一个 <font color=green>lock 汇编指令</font>，这个指令会根据不同 CPU 型号，去自动添加总线锁或者缓存锁。

总线锁：锁定的是 CPU 的前段总线。从而导致同一时空只能有一个线程和内存通信，这样就避免了多线程并发造成的可见性问题。

缓存锁：缓存锁是对总线锁的优化，因为总线锁导致 CPU  的使用效率大幅下降。缓存锁只真多 CPU 三级缓存中的目标数据去加锁。缓存锁是使用 mesi 缓存一致性协议来实现的。



**指令重排序**

指令重排序：程序编写的顺序和执行顺序是不一致的。从而在多线程环境下导致可见性的问题。指令重排是一种性能优化的手段。CPU 层面：针对 mesi 协议的更进一步的优化，去提升 CPU 的利用率。CPU 提供了内存屏障指令，让应用程序在合适的地方插入内存屏障，去避免 CPU 指令重排序的一个问题。



JDK 5 开始，JVM 就使用了一种 Happens-before 的模型去描述，多线程之间的可见性的一关系。也就是如果两个操作具备 happens-before 的关系，那么这两个操作具备可见性的关系，不需要额外考虑增加 volatile 关键词。



## 保证可见性，不保证原子性

1. 当写一个 volatile 变量时，JMM 会把该线程本地内存中的变量强制刷新到主内存中去；
2. 这个写会操作会导致其他线程中的 volatile 变量缓存无效。



## 禁止指令重排

重排序是指编译器和处理器为了优化程序性能而对指令序列进行排序的一种手段。重排序需要遵守一定规则：

1. 重排序操作不会对存在数据依赖关系的操作进行重排序。

   比如：a=1;b=a; 这个指令序列，由于第二个操作依赖于第一个操作，所以在编译时和处理器运行时这两个操作不会被重排序。

2. 重排序是为了优化性能，但是不管怎么重排序，单线程下程序的执行结果不能被改变





# Sychronized 和 ReentrantLock 的区别？

| Sychronized                      | ReentrantLock                       |
| -------------------------------- | ----------------------------------- |
| Java 中的关键字                  | JDK 提供的一个类                    |
| 自动加锁与释放锁                 | 需要手动加锁和释放锁                |
| JVM层面的锁                      | API 层面的锁                        |
| 非公平锁                         | 公平锁或非公平锁                    |
| 锁的是对象，锁信息保存在对象头中 | int 类型的 state 标识来标识锁的状态 |
| 底层有锁升级过程                 | 没有锁升级过程                      |



# ReentrantLock 的公平锁和非公平锁，底层如何实现的？

首先不管是公平锁和非公平锁，它们底层实现都会使用<font color=red> AQS </font>来进行排队，它们的区别在于线程在使用 lock() 方法加锁时：

1. 如果是<font color=red>公平锁</font>，会先检查 AQS 队列中是否存在线程在排序，如果有线程在排队，则当前线程也进行<font color=red>排队</font>。
2. 如果是<font color=red>非公平锁</font>，则不会去检查是否有线程在排队，而是<font color=red>直接竞争锁</font>。



# Sychronized 的锁升级过程是怎样的？

偏向锁 --> 轻量级锁（自旋锁） -> 重量级锁  



1. 偏向锁：在锁对象的对象头中记录一下，当前获取到该锁的线程 ID，改线程下次如果又来获取该锁就可以直接获取到了，也就是支持<font color=red>锁重入</font>
2. 轻量级锁：由偏向锁升级而来，当一个线程获取到锁后，此时这把锁就是偏向锁，此时如果有第二线程来<font color=red>竞争</font>锁，偏向锁就会<font color=red>升级</font>为轻量级锁，轻量级锁是相对于重量级锁而言的，轻量级锁底层通过<font color=red>自旋</font>来实现的，并<font color=red>不会阻塞线程</font>。
3. 如果<font color=red>自旋次数过多</font>，任然没有获取到锁，则会升级到<font color=red>重量级锁</font>，重量级锁<font color=red>会导致线程阻塞</font>。
4. 自旋锁：自旋锁就是线程在获取锁的过程中，不会去阻塞线程，也就无所谓唤醒线程，<font color=red>阻塞和唤醒这两个步骤都是需要操作系统去进行的</font>，比较消耗时间，自旋锁是线程通过 CAS 获取预期的一个标记，如果没有获取到，则继续循环获取，如果获取到了则表示获取到了锁，这个过程线程一直在运行中，相对而言没有使用太多的操作系统资源，比较轻量。



<font color=red>**锁消除**</font>

<font color=red>锁消除</font>：<font color=red>即时编译器</font>（ JIT ）基于<font color=red>逃逸分析</font>，对那些不可能出现共享数据竞争的锁进行消除。

比如：一个对象不会逃逸处方法，就没必要加锁。

Java 程序很多同步措施不是程序员手动添加的。java 程序中出现的同步频繁程度，超出你的想象



如代码：每个 <font color=red>StringBuffer.append()</font> 方法中都有一个<font color=red>同步块</font>，锁就是 sb 对象。虚拟机观察 sb 对象不会逃逸出方法，这里的所有 append 会忽略同步措施直接执行。

```java
// 原始代码
public String concatString(String s1,String s2,String s3){
  return s1 + s2 + s3;
}

// 编译器优化后的代码
public String concatString(String s1,String s2,String s3){
  StringBuffer sb = new StringBuffer();
  sb.append(s1);
  sb.append(s2);
  sb.append(s3);
  return sb.toString();
}
```



<font color=red>**锁粗化**</font>

一般情况下，我们系统同步块越小越好，这样等待锁的线程也尽可能快地拿到锁。

但是如果对<font color=red>同一个对象反复加锁和解锁</font>，或者 StringBuffer 在循环体中 append()，即时没有线程竞争，频繁地加锁和释放锁也会导致<font color=red>不必要的性能损耗</font>。

因此可以<font color=red>将锁的范围扩大（粗化）化</font>，在第一个  append 加锁一次就可以了，最后一次 append 执行完毕后，再释放锁。



# ThreadLocal 有哪些应用场景？底层如何实现的？

1. ThreadLocal 是 Java 中所提供的线程本地存储机制，可以利用该机制将数据<font color=red>缓存在某个线程内存</font>，该线程可以在任意时刻、任意方法中获取缓存的数据。
2. ThreadLocal 底层是通过 ThreadLocalMap 来实现的，每个 Thread 对象中都存一个 ThreadLocalMap，Map 的 key 为 ThreadLocal 对象，Map 的 value 为需要缓存的值。



# JMM

[TOC]

## 背景

JMM 用于屏蔽掉各种硬件和操作系统的内存访问差异，以实现让 Java 程序在各种平台下都能达到一致的并发效果，JMM 规范了 Java 虚拟机与计算机内存是如何协同工作的：规定了一个线程如何和何时可以看到由其他线程修改过后的共享变量的值，以及在必须时如何同步的访问共享变量。

JMM（Java Memory Model）本身是一种<font color=red>抽象的</font>概念，<font color=red>并不是真实存在</font>它<font color=green>仅仅描述的是一组约定和规范。</font>通过这组规范定义了程序中（尤其是多线程）各个变量的读写访问方式并决定一个线程对共享变量的写入何时以及如何变成另一个线程可见，<font color=green>关键技术点都是围绕多线程的</font><font color=red>**原子性、可见性和有序性**</font>展开。



1. 通过 JMM 来实现<font color=red>线程和主内存之间的抽象关系</font>
2. <font color=red>屏蔽各个硬件平台和操作系统的内存访问差异</font>以实现让 Java 程序在各种平台下都能达到一致的内存访问效果。



CPU 的运行并<font color=red>不是直接操作内存而是先把内存里边的数据读到缓存</font>，而内存的读和写操作的时候会操作数据不一致的问题。



## 多线程对变量的读写过程

Java 内存模型：调用栈和本地变量存放在线程上，对象存放在堆上。

- <font color=red>原始类型的本地变量</font>，总是 “呆在” 线程<font color=red>栈</font>上。
- <font color=red>引用类型的本地变量</font>，引用（本地变量）存放在线程栈上，但是<font color=red>对象本身放在堆</font>上。
- 一个包含方法的对象，方法中包含本地变量，这些本地变量存在放线程栈上，即使这些方法所属的对象存放在堆上。
- 对象的<font color=red>成员变量</font>随着对象自身存放在<font color=red>堆</font>上。不管成员变量是原始类型还是引用类型。
- <font color=red>静态成员</font>变量存放在<font color=red>堆</font>上。
- 存放在堆上的对象可以被所有持有对这个对象引用的线程访问。如果两个线程同时调用同一个对象上的同一个方法，每一个线程都拥有这个成员变量的私有拷贝。



<img src="/images/java/WX20230306-102130@2x.png" style="zoom:40%;" />



<img src="/images/java/WX20230306-103214@2x.png" style="zoom:40%;" />



现代计算机硬件架构的简单图示：

<img src="/images/java/WX20230306-104854@2x.png" style="zoom:40%;" />



**Java 内存模型和硬件内存架构之间的桥接**

Java 内存模型与硬件内存架构之间存在差异。硬件内存架构没有区分线程栈和堆。对于硬件，所有的线程栈和堆都分布在主内存中。部分线程栈和堆可能有时候会出现在 CPU 缓存中和 CPU 内部的寄存器中。如下图所示：

<img src="/images/java/WX20230306-105552@2x.png" style="zoom:40%;" />



从抽象的角度来看，<font color=red>**JMM 定义了线程和主内存之间的抽象关系**</font>：

- 线程之间的<font color=red>共享变量</font>存储在主内存（Main Memory）中
- 每个线程都有一个<font color=red>私有的本地内存（Local Memory）</font>,本地内存是 JMM的一个抽象概念，并不真实存在。本地内存中存储了该线程以读/写共享变量的拷贝副本。
- Java 内存模型中的<font color=red>线程的工作内存（working memory）</font>是 <font color=green>CPU 寄存器和高速缓存</font>的抽象描述。而 JVM 的静态内存储模型（JVM内存模型）只是一种对内存的物理划分而已，它只局限在内存，而且只局限在 JVM 的内存。



<img src="/images/java/WX20230306-111550@2x.png" style="zoom:40%;" />





## JMM 模型下的线程间通信

<font color=red>**线程间通信必须要经过主内存。**</font>不同线程之间无法直 接访问对方工作内存中的变量。



# 如下图：如果线程 A 与线程 B 之间要通信的话，必须要经历下面 2 个步骤：

1. 线程 A 把本地内存 A 中更新过的共享变量刷新到主内存中去。
2. 线程 B 到主内存中去读取线程 A 之前已更新过的共享变量。



<img src="/images/java/WX20230306-112509@2x.png" style="zoom:40%;" />



关于主内存与工作内存之间的具体交互协议，即一个变量如何从主内存拷贝到工作内存、如何从工作内存同步到主内存之间的实现细节，

Java 内存模型定义了以下八种操作来完成：

- **lock（锁定）**：作用于<font color=orange>主内存</font>的变量，把一个变量标识为一条线程独占状态。
- **unlock（解锁）**：作用于<font color=orange>主内存</font>变量，把一个处于锁定状态的变量释放出来，释放后的变量才可以被其他线程锁定。
- **read（读取）**：作用于<font color=orange>主内存</font>变量，把一个变量值从主内存传输到线程的工作内存中，以便随后的 load 动作使用
- **load（载入）**：作用于<font color=blue>工作内存</font>的变量，它把 read 操作从主内存中得到的变量值放入工作内存的变量副本中。
- **use（使用）**：作用于<font color=blue>工作内存</font>的变量，把工作内存中的一个变量值传递给执行引擎，每当虚拟机遇到一个需要使用变量的值的字节码指令时将会执行这个操作。
- **assign（赋值）**：作用于<font color=blue>工作内存</font>的变量，它把一个从执行引擎接收到的值赋值给工作内存的变量，每当虚拟机遇到一个给变量赋值的字节码指令时执行这个操作。
- **store（存储）**：作用于<font color=blue>工作内存</font>的变量，把工作内存中的一个变量的值传送到主内存中，以便随后的 write 的操作。
- **write（写入）**：作用于<font color=orange>主内存</font>的变量，它把 store 操作从工作内存中一个变量的值传送到主内存的变量中。



Java内存模型还规定了在执行上述八种基本操作时，必须满足如下规则：

- 如果要把一个变量从主内存中复制到工作内存，就需要按<font color=green>顺序执行 read 和 load 操作</font>， 如果把变量从工作内存中同步回主内存中，就要按<font color=green>顺序地执行 store 和 write 操作</font>。但 Java 内存模型只要求上述操作必须按顺序执行，而没有保证必须是连续执行。
- 不允许 read 和 load、store 和 write 操作之一单独出现。
- 不允许一个线程丢弃它的最近 assign 的操作，即<font color=green>变量在工作内存中改变了之后必须同步到主内存中。</font>
- 不允许一个线程无原因地（没有发生过任何 assign 操作）把数据从工作内存同步回主内存中。
- 一个<font color=green>新的变量只能在主内存中诞生</font>，不允许在工作内存中直接使用一个未被初始化（ load 或 assign）的变量。即就是对一个变量实施 use 和 store 操作之前，必须先执行过了 assign 和 load 操作。
- 一个变量在同一时刻只允许一条线程对其进行 lock 操作，但 lock 操作可以被同一条线程重复执行多次，多次执行 lock 后，只有执行相同次数的 unlock 操作，变量才会被解锁。lock 和 unlock 必须成对出现
- 如果对一个变量<font color=green>执行 lock 操作，将会清空工作内存中此变量的值</font>，在执行引擎使用这个变量前需要重新执行 load 或 assign 操作初始化变量的值
- 如果一个变量事先没有被 lock 操作锁定，则不允许对它执行 unlock 操作；也不允许去 unlock 一个被其他线程锁定的变量。
- 对一个变量执行 unlock 操作之前，必须先把此变量同步到主内存中（执行 store 和 write 操作）。



## JMM 三大特性

三大特性

1. 可见性
2. 原子性
3. 有序性



### 可见性

可见性：<font color=red>当一个线程修改了某一个共享变量，其他线程能够立即知道该变更</font>，JMM 规定了所有的变量都存储在<font color=red>**主内存**</font>中。 

- <font color=green>线程不能直接修改主内存中的数据，只能先将数据加载到本地内存后修改，再将修改后的数据，写回主内存。</font>

<img src="/images/java/WX20230306-111550@2x.png" style="zoom:50%;" />

在这种模型下，如果没有可见性，会出现<font color=red>线程脏读</font>。

例如：主内存中有变量 x ，初始值为 0.

- 线程 A 要将 x + 1，先将 x = 0 拷贝到自己的私有内存，然后更新 x 的值。
- 线程 A 将更新后的 x 值刷回到主内存的时间不固定（还有其他程序要执行或者线程 A 被 CPU 挂起）
- 刚好在线程 A 没有回刷到 x 到主内存时，线程 B 同样从主内存中读取 x，此时 x 为 0，和线程 A 一样的操作，最后期望的是 x = 2 就会变成 x = 1。
- 线程 A 或者线程 B，写丢了一次。



### 原子性

原子性：指一个操作是不可打断的，即多线程环境下，操作不能被其他线程干扰。



### 有序性

一个线程的执行代码，我们习惯性地认为代码的执行总是从上到下，有序执行。但为了提升性能，编译器和处理器通常会<font color=red>对指令序列进行重新排序</font>。Java 规范规定 JVM 线程内部维持顺序话语义，即只要程序的最终结果与它顺序化执行的结果相等，那么指令的执行顺序可以与代码顺序不一致。此过程加：<font color=red>指令的重排序</font>。



**优缺点**

JVM 能根据处理<font color=red>性能</font>（CPU 多级缓存系统、多核处理器等）适当地对机器指令进行重排序，使机器指令更符合 CPU 的执行特性，<font color=green>最大限度的发挥机器性能。</font>

指令重排<font color=red>可以保证串行语义一致</font>，但是没有义务保证<font color=red>多线程间的语义也一致</font>（可能产生“脏读“）。

从源码到最终执行示例图：

<img src="/images/java/WX20230306-130717@2x.png" style="zoom:50%;" />

 处理器在进行重排序时<font color=red>必须要考虑</font> 指令之间的<font color=red>**数据依赖性**</font>





## 多线程先行发生原则之 happens-before

在 JMM 中，如果一个操作<font color=red>执行的结果</font>需要对另一个操作可见或者代码重排序，那么这两个操作之间必须存在 happens-before（先行发生）原则，逻辑上的先后关系。 



如果 Java 内存模型中所有的有序性仅靠 volatile 和 synchronized 来完成，那么有很多操作都将会变得非常啰嗦。但是我们在编写 Java 并发代码时，并没有觉察到。因为 <font color=red>Java 语言中 JMM原则下有一个”先行发生“（Happens-Before）的原则和规矩。</font>

<font color=red>这个原则非常重要</font>，它是判断数据是否存在竞争，线程是否安全的非常有用的手段。依赖这个原则，我们可以通过几条简单规则一揽子解决<font color=green>并发环境下两个操作之间是否可能存在冲突的所有问题</font>，而不是要陷入 Java 内存模型苦涩难懂额底层编译原理之中。



**happens-before 总原则：**

- 如果一个操作 happens-before 另一个操作，那么第一个操作的执行结果对第二个操作可见，并且第一个操作的执行顺序排在第二个操作之前。
- 两个操作之间存在 happens-before 关系，并不意味着一定要按照 happens-before 原则制定的顺序来执行。如果重排序之后的执行结果按照 happens-before 关系<font color=red>执行的结果一致</font>，那么这种重排序<font color=red>并不非法</font>。



### happens-before 之 8 条

1. **次序规则**

   1. <font color=red>一个线程内</font>，按照代码顺序，写在前面操作先行发生于写在后面的操作。
   2. 前一个操作的结果可以被后续的操作获取。

2. **锁定规则**

   1. 一定要先 lock 后，才能 unlock。一定上一个 unlock 后，下一个加锁才能 lock，顺序不能乱。

      ```java
      lock.lock();
      try{
      }finally{
        lock.unlock();
      }
      
      lock.lock();
      try{
      }finally{
        lock.unlock();
      }
      ```

3. **volatile 变量规则**：对于一个 volatile 变量的写操作先行发生于后面这个变量的读操作，<font color=red>前面的写对后面的读是可见的</font>，这里的”后面“同样是指时间上的先后。

4. **传递规则**：如果操作 A 先行发生于操作 B，而操作 B 先行发生于操作 C，则可以得出操作 A 先行发生于操作 C。

5. **线程启动规则（Thread Start Rule）**：

   Thread 对象的 start() 方法优先发生于此线程的每一个动作。

   如下代码：t1.start() 优先发生于 println 方法。如果 start() 不执行，线程就无法启动。

   ```java
   Thread t1 = new Thread(()->{
     System.out.println("hello thread");
   },"AA");
   
   t1.start();
   ```

6. **线程中断规则（Thread Interruption Rule）**

   1. 对线程 interrupt() 方法的调用先行发生于被中断线程的代码检测到中断事件的发生。
   2. 也可以通过 Thread.interrupted() 检测到是否发生中断。
   3. 也就是说你要先调用 interrupt() 方法设置过中断标志位，我才能检测中断的发生。

7. **线程终止规则（Thread Termination Rule）：**线程中的所有操作都先行发生于对此线程的终止检查，我们可以通过 isAlive() 等手段检测线程是否已经终止执行。

   如下图：必须要等线程干完所有活，才能执行终止线程的操作。不能提前执行。

   ```java
   Thread t1 = new Thread(()->{
     System.out.println("hello thread");
     TimeUnit.SECONDS.sleep(30);
   },"AA");
   t1.start();
   ```

8. **对象终结规则（Finalizer Rule）：**

   1. 一个对象的初始化完成（构造函数执行结束）先行发生于它的 finalize() 方法的开始。
   2. 一个人必须先出生，才能死亡。



## 总结

在 Java 语言里面，Happens-Before 的语义本质上是一种<font color=red>可见性</font>。

A Happens-Before B 意味着：A 的发生的事情对 B 来说是可见的，无论 A事件和 B 事件是否发生在同一个线程里。

为了尽可能少的对编译器和处理器做约束从而提高性能。JMM 不影响程序执行结果的前提下，对 JVM 不做要求，即允许优化重排序。

 