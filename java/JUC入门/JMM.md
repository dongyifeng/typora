---
typora-root-url: ../../../typora
---

[TOC]

# 背景

JMM 用于屏蔽掉各种硬件和操作系统的内存访问差异，以实现让 Java 程序在各种平台下都能达到一致的并发效果，JMM 规范了 Java 虚拟机与计算机内存是如何协同工作的：规定了一个线程如何和何时可以看到由其他线程修改过后的共享变量的值，以及在必须时如何同步的访问共享变量。

JMM（Java Memory Model）本身是一种<font color=red>抽象的</font>概念，<font color=red>并不是真实存在</font>它<font color=green>仅仅描述的是一组约定和规范。</font>通过这组规范定义了程序中（尤其是多线程）各个变量的读写访问方式并决定一个线程对共享变量的写入何时以及如何变成另一个线程可见，<font color=green>关键技术点都是围绕多线程的</font><font color=red>**原子性、可见性和有序性**</font>展开。



1. 通过 JMM 来实现<font color=red>线程和主内存之间的抽象关系</font>
2. <font color=red>屏蔽各个硬件平台和操作系统的内存访问差异</font>以实现让 Java 程序在各种平台下都能达到一致的内存访问效果。



CPU 的运行并<font color=red>不是直接操作内存而是先把内存里边的数据读到缓存</font>，而内存的读和写操作的时候会操作数据不一致的问题。



# 多线程对变量的读写过程

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





# JMM 模型下的线程间通信

<font color=red>**线程间通信必须要经过主内存。**</font>不同线程之间无法直 接访问对方工作内存中的变量。



如下图：如果线程 A 与线程 B 之间要通信的话，必须要经历下面2个步骤：

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



# JMM 三大特性

三大特性

1. 可见性
2. 原子性
3. 有序性



## 可见性

可见性：<font color=red>当一个线程修改了某一个共享变量，其他线程能够立即知道该变更</font>，JMM 规定了所有的变量都存储在<font color=red>**主内存**</font>中。 

- <font color=green>线程不能直接修改主内存中的数据，只能先将数据加载到本地内存后修改，再将修改后的数据，写回主内存。</font>

<img src="/images/java/WX20230306-111550@2x.png" style="zoom:50%;" />

在这种模型下，如果没有可见性，会出现<font color=red>线程脏读</font>。

例如：主内存中有变量 x ，初始值为 0.

- 线程 A 要将 x + 1，先将 x = 0 拷贝到自己的私有内存，然后更新 x 的值。
- 线程 A 将更新后的 x 值刷回到主内存的时间不固定（还有其他程序要执行或者线程 A 被 CPU 挂起）
- 刚好在线程 A 没有回刷到 x 到主内存时，线程 B 同样从主内存中读取 x，此时 x 为 0，和线程 A 一样的操作，最后期望的是 x = 2 就会变成 x = 1。
- 线程 A 或者线程 B，写丢了一次。



## 原子性

原子性：指一个操作是不可打断的，即多线程环境下，操作不能被其他线程干扰。



## 有序性

一个线程的执行代码，我们习惯性地认为代码的执行总是从上到下，有序执行。但为了提升性能，编译器和处理器通常会<font color=red>对指令序列进行重新排序</font>。Java 规范规定 JVM 线程内部维持顺序话语义，即只要程序的最终结果与它顺序化执行的结果相等，那么指令的执行顺序可以与代码顺序不一致。此过程加：<font color=red>指令的重排序</font>。



**优缺点**

JVM 能根据处理<font color=red>性能</font>（CPU 多级缓存系统、多核处理器等）适当地对机器指令进行重排序，使机器指令更符合 CPU 的执行特性，<font color=green>最大限度的发挥机器性能。</font>

指令重排<font color=red>可以保证串行语义一致</font>，但是没有义务保证<font color=red>多线程间的语义也一致</font>（可能产生“脏读“）。

从源码到最终执行示例图：

<img src="/images/java/WX20230306-130717@2x.png" style="zoom:50%;" />

 处理器在进行重排序时<font color=red>必须要考虑</font> 指令之间的<font color=red>**数据依赖性**</font>





# 多线程先行发生原则之 happens-before

在 JMM 中，如果一个操作<font color=red>执行的结果</font>需要对另一个操作可见或者 代码重排序，那么这两个操作之间必须存在 happens-before（先行发生）原则，逻辑上的先后关系。 



如果 Java 内存模型中所有的有序性仅靠 volatile 和 synchronized 来完成，那么有很多操作都将会变得非常啰嗦。但是我们在编写 Java 并发代码时，并没有觉察到。因为 <font color=red>Java 语言中 JMM原则下有一个”先行发生“（Happens-Before）的原则和规矩。</font>

<font color=red>这个原则非常重要</font>

它是判断数据是否存在竞争，线程是否安全的非常有用的手段。依赖这个原则，我们可以通过几条简单规则一揽子解决<font color=green>并发环境下两个操作之间是否可能存在冲突的所有问题</font>，而不是要陷入 Java 内存模型苦涩难懂额底层编译原理之中。



**happens-before 总原则：**

- 如果一个操作 happens-before 另一个操作，那么第一个操作的执行结果对第二个操作可见，并且第一个操作的执行顺序排在第二个操作之前。
- 两个操作之间存在 happens-before 关系，并不意味着一定要按照 happens-before 原则制定的顺序来执行。如果重排序之后的执行结果按照 happens-before 关系<font color=red>执行的结果一致</font>，那么这种重排序<font color=red>并不非法</font>。



## happens-before 之 8 条

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

 