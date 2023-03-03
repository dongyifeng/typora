---
typora-root-url: ../../../typora
---

[TOC]

[volatile](https://so.csdn.net/so/search?q=volatile&spm=1001.2101.3001.7020)是Java提供的一种轻量级的同步机制。



# [并发编程](https://so.csdn.net/so/search?q=并发编程&spm=1001.2101.3001.7020)的3个基本概念

- 原子性：即一个操作或者多个操作 要么全部执行并且执行的过程不会被任何因素打断，要么就都不执行。
- 可见性：指当多个线程访问同一个变量时，一个线程修改了这个变量的值，其他线程能够立即看得到修改的值。
- 有序性：即程序执行的顺序按照代码的先后顺序执行。



# 锁的互斥和可见性

锁提供了两种主要特性：互斥（mutual exclusion） 和可见性（visibility）。

互斥性：互斥即一次只允许一个线程持有某个特定的锁，一次就只有一个线程能够使用该共享数据。

可见性：它必须确保释放锁之前对共享数据做出的更改对于随后获得该锁的另一个线程是可见的。



# volatile变量的特性

## 保证可见性，不保证原子性

1. 当写一个volatile变量时，JMM会把该线程本地内存中的变量强制刷新到主内存中去；
2. 这个写会操作会导致其他线程中的volatile变量缓存无效。



## 禁止指令重排

重排序是指编译器和处理器为了优化程序性能而对指令序列进行排序的一种手段。重排序需要遵守一定规则：

1. 重排序操作不会对存在数据依赖关系的操作进行重排序。

    比如：a=1;b=a; 这个指令序列，由于第二个操作依赖于第一个操作，所以在编译时和处理器运行时这两个操作不会被重排序。

2. 重排序是为了优化性能，但是不管怎么重排序，单线程下程序的执行结果不能被改变



# volatile不适用的场景

## 1.volatile不适合复合操作

例如，inc++不是一个原子性操作，可以由读取、加、赋值3步组成，所以结果并不能达到30000。.



# 单例模式的双重锁为什么要加volatile

```java
public class TestInstance{
  private volatile static TestInstance instance;
  public static TestInstance getInstance(){        //1if(instance == null){                        //2synchronized(TestInstance.class){        //3if(instance == null){                //4instance = new TestInstance();   //5}}}return instance;                             //6}}
```



原因：在并发情况下，如果没有volatile关键字，在第 5 行会出现问题。instance = new TestInstance();可以分解为3行伪代码