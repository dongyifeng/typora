---
typora-root-url: ../../../typora
---

[TOC]

# Java 基础题

1. 如此定义，short s=1;是否有误，定义 long v=99999999；是否有误；

   答：short s =1 没问问题；long 类型定义 数值后面必须加 L；

2. math.round(-5.5)的结果是什么？

   答：5

   Math.round：四舍五入。算法为Math.floor(x+0.5),即将原来的<font color=red>数字加上0.5后再向下取整。</font>Math.round(-11.5) = Math.floor(-11.5+0.5) = -11

   math.ceil：向上取整。Math.ceil（11.3）= 12，Math.ceil（-11.3）= -11

   Math.floor：向下取整。

   

3. abstract method 是否可以同时static？为什么？

   答：不可以。因为 abstract 申明的方法是要求子类去实现的，而 static 方法是不会被覆盖的。

4. 一个需要对 key 排序的 Map，您一般选择哪个？HashMap，LinkedHashMap 为什么？

   答：LinkedHashMap。因为 

5. 如何定义一个线程安全的List？

   1. 使用 synchronized 关键字。
   2. 使用 Collections.synchronizedList()。

6. Override，Overload区别，Overload 的方法是否可以使用不同的返回值类型？

   区别：

   1. Override：覆盖的方法和被覆盖的方法的标志完全匹配、返回值必须一致、抛出的异常必须一致，才能达到覆盖的效果。
   2. Overload：在使用重载时只能通过不同的参数样式

   不可以。

7. 单例类如何控制线程安全?

   1. 饿汉模式（线程安全）

      ```java
      public class Single2 {
          private static Single2 instance = new Single2();
          
          private Single2(){
              System.out.println("Single2: " + System.nanoTime());
          }
          
          public static Single2 getInstance(){
              return instance;
          }
      }
      ```

      

   2. 懒汉模式 （如果方法没有synchronized，则线程不安全）

      ```java
      public class Single3 {
          private static Single3 instance = null;
          
          private Single3(){
              System.out.println("Single3: " + System.nanoTime());
          }
          
          public static synchronized Single3 getInstance(){
              if(instance == null){
                  instance = new Single3();
              }
              return instance;
          }
      }
      ```

      

   3. 懒汉模式改良版（线程安全，使用了double-check，即check-加锁-check，目的是为了减少同步的开销）

      ```java
      public class Single4 {
          private volatile static Single4 instance = null;
          
          private Single4(){
              System.out.println("Single4: " + System.nanoTime());
          }
          
          public static Single4 getInstance(){
              if(instance == null){
                  synchronized (Single4.class) {
                      if(instance == null){
                          instance = new Single4();
                      }
                  }
              }
              return instance;
          }
      }
      ```

      

   4. 利用私有的内部工厂类（线程安全，内部类也可以换成内部接口，不过工厂类变量的作用域要改为public了。）

      ```java
      public class Singleton {
          private Singleton(){
              System.out.println("Singleton: " + System.nanoTime());
          }
          
          public static Singleton getInstance(){
              return SingletonFactory.singletonInstance;
          }
          
          private static class SingletonFactory{
              private static Singleton singletonInstance = new Singleton();
          }
      }
      ```

      

8. 泛型中<Object>和<?>有什么区别？

   1. List<?> 不需要做强制类型转换，编译时更安全。
   2. \<Object> 在使用时需要一个强转

9. yield 和 join 的用法？

   1. yield()方法：暂停当前正在执行的线程对象，并执行其他线程。
   2. jion()方法：线程实例的join()方法可以使得一个线程在另一个线程结束后再执行

10. final 如何使用？

    1. 修饰类
    2. 修饰字段
    3. 修饰方法

11.  final、finally、finalize的区别？

    1. final可以修饰**类，变量，方法**，修饰的类不能被继承，修饰的变量不能重新赋值，修饰的方法不能被重写。
    2. finally**用于抛异常**，finally代码块内语句无论是否发生异常，都会在执行finally，常用于一些**流的关闭**。
    3. finalize方法**用于垃圾回收**。一般情况下不需要我们实现finalize，当对象被回收的时候需要释放一些资源，比如socket链接，在对象初始化时创建，整个生命周期内有效，那么需要实现finalize方法，关闭这个链接。但是当调用finalize方法后，并不意味着**GC**会立即回收该对象，所以有可能真正调用的时候，对象又不需要回收了，然后到了真正要回收的时候，因为之前调用过一次，这次又不会调用了，产生问题。所以**不推荐使用finalize方法**。

12. Java中 byte 占多少字节？

    答：1 个字节（8 位）

13. OutOfmemoryErrror；permGen space.是指的 Jvm 内存的那块不足？设置 -xmx 是否可以有效解决问题，如果不行，您觉得应该怎么设置？

    1. 永久代内存不足。
    2. -xmx：用于表示堆区的最大内存，不能解决。通过设置 -XX:MaxPermSize 解决永久代内存溢出。

14. 举例您常用的 JVM 内存调优的工具，聊聊您对内存调优，GC等方面的想法和感悟。

    1. 

15. JVM 运行时分区结构？静态函数在什么区？

    1. 程序计数器(ProgramCounter Register)、Java栈(VMStack)、本地方法栈(Native Method Stack)、方法区(Method Area)、堆(Heap)。
    2. 静态函数存放在方法区。

16. 在 JAVA 中是否存在内存泄漏？为什么？

    1. 存在。
    2. 在Java中一般是指无用的对象却因为错误的引用关系，不能被 GC 回收清理。
       



# JAVA 框架问题

1. 简述spring中的 factorybean 和 beanfactory 的区别？ 
   1. BeanFactory 是一个最基础的 IOC[容器](https://cloud.tencent.com/product/tke?from=10680)，提供了依赖查找，依赖注入等基础的功能。
   2. FactoryBean 是创建 Bean的一种方式，帮助实现复杂 Bean 的创建
2. 简述 SpringIOC 的理解；
   1. 由IOC容器来创建对象，不需要我们去创建，我们只要告诉ioc容器我们需求什么样的对象就可以了。
3. spring 的单例和普通的有何区别？
4. 说说 mybatis 和 hibernate 的使用场合？
   1. Hibernate : 标准的ORM(对象关系映射) 框架。场景：变化固定中小型项目；ERP，ORM，OA
      1. 不要用写sql， sql 自动语句生成
      2. 使用Hibernate对sql 进行优化，修改比较困难
   2. mybatis：程序员自己编写sql， sql 修改，优化比较自由。场景：互联网项目。
5. 用过哪些网络框架？有何体会？
   1. HttpClient
   2. 高效稳定，但是维护成本高昂，
6. 用过哪些 xml 解析工具，了解他们的实现吗？
   1. Dom4j
7. 如何使用 hibernate 和 jdbc 在同一个事务中使用？
8. web service如何处理事务。



# WEB问题

1. https默认端口是？

   1. 默认端口号为443/tcp 443/udp

2. cookie和session的区别？在客户端禁用了cookie的情况下，如何维护 session ？

   1. cookie数据存放在客户的浏览器上，session数据放在服务器上。
   2. cookie不是很安全
   3. session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能

   禁用：

   1. 手动通过URL传值、隐藏表单传递 Session ID。
   2. 用文件、数据库等形式保存 Session ID，在跨页过程中手动调用。

3. 常见的http的状态码，及其含义。

   1. **1XX Informational(信息性状态码)**
   2. **2XX Success(成功状态码)**
   3. **3XX Redirection(重定向状态码)**
   4. **4XX Client Error(客户端错误状态码)**
   5. **5XX Server Error(服务器错误状态码)**

   





# 数据库知识

1. oracle 数据库如何清理重复数据？

2. oracle的事务隔离级别都有哪些，和Mysql有什么区别，分别如何实现序列化？

3. 如何对 tcp服务器压力测试？

   ```shell
   ps -ef | grep httpd | wc -l
   ```

   

4. 单元测试有哪些？有什么体会？

   1. Junit。体会就是自己新建一个测试类，可以测试部分写完的代码，不用启动服务器

      



1. 设计一个程序，完成 100000000 个随机数的排序？
2. 字符串 “12345678”表示为asc16进制如何表示？



# 逻辑题

>  一家珠宝店的珠宝被盗，经查可以肯定是甲、乙、丙、丁中的某一个人所为 审讯中，甲说：“我不是罪犯。”乙说：“丁是罪犯。”丙说：“乙是罪犯。”丁说：“我不是罪犯。”经调查证实四人中只有一个人说的是真话。  根据已知条件，下列哪个判断为真？

-  假设甲说的是真的，那么甲不是罪犯。乙说的就是假的，他说丁是罪犯，则丁不是罪犯，而丁说的也应该是假的，丁说他不是罪犯，则他是罪犯，互相矛盾，假设不成立。
- 假设乙说的是真的，那么丁是罪犯，甲说的应该是假的，他说我不是罪犯，则甲是罪犯，矛盾，假设不成立。
- 假设丙说的是真的，则乙是罪犯，甲说的应该是假的，他说我不是罪犯，则甲是罪犯，矛盾，假设不成立。
- 假设丁说的是真的，则丁不是罪犯，其他三人说的都是假的，甲说不是罪犯，则甲是罪犯，符合，乙说丁是罪犯，丁不是罪犯，符合，丙说乙是罪犯，乙不是罪犯，符合。
  