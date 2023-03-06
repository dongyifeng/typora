---
typora-root-url: ../../../typora
---

[TOC]

# Spring 如何解决循环依赖？

  循环依赖是指一个或者多个 Bean 实例之间存在直接或者间接的一个依赖关系，构成一个循环调用。



下图是三种循序依赖。

<img src="/images/spring/WX20230304-205023@2x.png" style="zoom:50%;" />



Spring 通过<font color=red>三级缓存</font>来解决部分的循环依赖。

- 一级缓存存放完全初始化好的 Bean。这个 Bean 可以直接被使用。
- 二级缓存存放的是原始的 Bean 的对象，这个 Bean 中的属性还没有被进行赋值或者没有被依赖注入。
- 三级缓存存放的是 Bean 的工厂对象，用来生成原始的 Bean 对象，并且放入到二级缓存。



例子：假设 BeanA 和 BeanB 之间存在一个循环依赖。

如下图：BeanA 和 BeanB 的初始化过程。<font color=red>**核心思想：把 Bean 的实例化和向Bean 中属性的依赖注入，这两个过程分离开。**</font>



<img src="/images/spring/WX20230304-211607@2x.png" style="zoom:50%;" />



<font color=red>注意：Spring 只能解决单实例存在的循环引用问题。</font>

以下四种循环依赖需要人为干预。

- 多实例的 Setter 注入导致的循环依赖，需要把 Bean 改为单例。
- 构造器注入的循环依赖，可以通过 @Lazy 注入。
- DependsOn 导致的循环依赖，找到注解循环依赖的地方，迫使它不循环依赖。
- 单例的对象 Setter 注入的循环依赖
  - 可以使用 @Lazy 注入
  - 或者使用 @DependsOn 注解指定加载先后关系。

在实际的开发中出现循环依赖的根本原因是代码设计上，如果模块的耦合度较高的话，依赖关系的复杂程度一定会增加。从系统的角度，去考虑模块之间的依赖关系，去避免循环依赖。



# Spring 中 Bean 的作用域有哪些？

Spring 框架里的 IOC 容器是管理应用里面的 Bean 对象的生命周期的。



- singleton（单例）：意味着在整个 Spring 容器中只会存在一个 Bean 实例。
- prototype（原型）：意味着每次从 IOC 容器去获取指定 Bean 的时候，都会返回一个新的实例对象。



在基于 Spring 框架下的 Web 应用里面，增加一个会话维度来控制 Bean 的生命周期。

1. request：针对每一次 http 请求都会创建一个新的 Bean
2. session：以 session 会话为维度，同一个 session 共享一个 Bean 实例，不同的 session 产生不同的 Bean 实例
3. globalSession：针对全局 session 维度共享同一个 Bean 实例。



# Spring 中有个 id 相同的 Bean 会报错吗？



# Spring 里面的事务和分布式事务的使用如何区分？



# Spring 中 BeanFactory 和 FactoryBean的区别？



# Spring 框架都使用哪些设计模式？

1. 工厂模式：BeanFactory 就是简单工厂模式的体现，用来创建对象的实例。
2. 单例模式：Bean 默认为单例模式
3. 代理模式：Spring 的 AOP 功能用到了 JDK 的动态代理和 CGLIB 字节码生成技术。
4. 模版模式：用来解决代码重复的问题，比如：RestTemplate，JmsTemplate，JpaTemplate
5. 观察模式：定义对象键一对多的依赖关系，当一个对象状态发生改变时，所有依赖于它的对象都会得到通知被动更新，如 Spring 中 listener 的实现 ApplicationListener。 







# 单例 Bean 是单例模式吗？

答：Spring 中的单例 Bean 也是一种单例模式，只不过范围比较小，范围是 beanName，一个 beanName 对应同一个 Bean 对象，不同的 beanName 可以对应不同的 Bean 对象。

单例模式是指在一个 JVM 中，一个类只能构造出来一个对象。有很多方法来实现单例模式，比如：懒汉模式。



代码如下：定义了一个单例 Bean，有俩个 beanName ：orderService1，orderService2

```java
@Component
public class OrderService{ }

@Bean
public OrderService orderService1{
  return new OrderService();
}

@Bean
public OrderService orderService2{
  return new OrderService();
}
```





单例模式的实现方式：

- 饿汉模式
- 懒汉模式
- 双重检查
- 静态内部类
- 枚举
- 多例模式
- 线程位置的单例





#  Spring 的 AOP 的底层实现原理？

Spring AOP 是面向切面编程。我们希望在调用一个方法时，在方法执行之前和执行之后，可以再去增加一些额外的逻辑。

应用场景：

1. 收集关键方法的：入参、执行时间、返回关键结果等关键信息，用作后期调优，及性能监控
2. 类似 Spring-Retry 模块，提供关键方法多次调用重试机制。
3. 提供关键方法自定义的快速熔断、服务降级等职责。
4. 关键方法的共性入参校验
5. 关键方法执行后的扩展行为，例如：记录日志，启动其他任务等。
6. 关键方法的幂等性前置校验。



Spring AOP是通过<font color=red>动态代理</font>实现的。



<img src="/images/spring/WX20230305-150730@2x.png" style="zoom:33%;" />



AOP 分为四个阶段：

1. 创建代理对象阶段
2. 拦截目标对象阶段
3. 调用代理对象阶段
4. 调用目标对象阶段



**创建代理对象阶段**

<font color=green>在 Spring 中创建创建 Bean 实例都是从 getBean() 方法开始的，在实例创建之后，Spring 容器将会根据 AOP 配置，去匹配目标类的类名，看目标类的类名是否满足切面规则。如果满足切面规则，就会调用 ProxyFactory 去创建 Bean（代理对象） 并且缓存到 IOC 容器。然后根据目标对象自动选择不同的代理策略。</font>如果目标类实现了接口，Spring 会默认使用 JDK Proxy ；如果目标类没有实现接口，Spring 会默认选择使用 Cglib Proxy，当然我们也可以通过配置去强制 Spring 使用 Cglib Proxy

**拦截目标对象阶段**

当用户调用目标对象的某个方法的时候，将会被一个叫做 AopProxy 的对象拦截，那么 Spring 将所有的调用策略，封装到了这个对象中，它默认实现了一个叫做 InvocationHandler 的接口，也就是调用代理对象的外层拦截器，在这个接口的 invoke() 方法中，会触发 MethodInvocation 的 procceed() 方法，在proceed () 方法中会按顺序执行符合所有 AOP 规则的拦截器链。

**调用代理对象阶段**

SpringAOP 拦截器链中每个元素都会被命名为  MethodInterceptor()，其实也就是切面中的 Advice 通知。这个通知是可以用来回调的  。执行织入代码。

**调用目标对象阶段**

执行 MethodInterceptor 接口的 invoke() 方法，invoke() 方法会触发对目标对象的调用。



代理对象：由 Spring 代理策略生成的对象

目标对象：我们自己写的业务代码。

织入代码：在我们写的业务代码增加的代码片段。

切面通知：封装织入代码片段的回调方法

MehtodInvocation：负责执行拦截器，在 proceed() 方法中执行

MethodInterceptor：负责执执行织入代码片段，在 invoke() 方法中执行。



能够实现AOP的技术

- AspectJ：编译期。在类编译成字节码文件时，将额外执行的逻辑代码，加入到对应的字节码文件。需要使用特殊的编译器。
- Spring AOP：动态代理
- aspectwerkz
- JBoss 4.0 



# Spring 中的事务是如何实现的？

1. Spring 事务底层是基于数据库事务 和 AOP机制的。
2. 首先对于使用 @Transaction 注解的 Bean，Spring 会创建一个代理对象作为 Bean
3. 当调用代理对象的方法时，会先判断该方法上是否加了 @Transaction 注解。
4. 如果加了，那么则利用事务管理器创建一个数据库连接
5. 并且修改数据库连接的 autocommit 属性为 false，禁止自动提交，这是实现 Spring 事务非常重要的一步。
6. 然后执行当前方法，方法中会执行 SQL
7. 执行完当前方法后，如果没有出现异常就直接提交事务。
8. 如果出现异常，并且这个异常时需要回滚的，就会回滚事务，否则依然提交。



注意：

1. Spring 事务的隔离级别对应的就是数据库的隔离级别。
2. Spring 事务的传播机制是 Spring 事务自己实现的，也是 Spring 事务中最复杂的。
3. Spring 事务的传播机制是基于数据库连接来做的，一个数据库连接一个事务，如果传播机制配置为需要新开一个事务，那么实际上就是先新建立一个数据库连接，在此新连接上执行 SQL。



```java
@Transactional
public void test(){
}

// 事务管理器
@Bean
public PlatformTransactionManager transactionManager(){
  DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
  transactionManager.setDataSource(dataSource());
  return transactionManager;
}
```

   

# Spring 中的事务失效的原因有哪些？

1. @Transaction 事务标注添加在<font color=red>不是 public </font>修饰的方法上。
2. 方法用<font color=red> final 修饰或者 static 修饰</font>，final 方法无法被 Spring 动态代理，方法不能重写。
3. 类<font color=red>没有被 Spring 托管</font>，导致 Spring 无法实现代理 
4. 事务方法，被同一个类中其他方法调用（这种调用是 this.xxx() 调用的，不是通过 aop 生产的代理对象调用的），导致 @Transaction  失效。
5. 多线程调用时事务会失效，Spring 事务是通过数据库连接来实现的，数据连接是通过 ThreadLocal 去保持的，线程间的数据是隔离的。多线程调用的话，会生成多份 ThreadLocal 。数据库连接都不一样了，事务也不一样了。 
6. 抛出异常被 <font color=red>catch</font> 处理了，导致 @Transaction 无法回滚而是失败。
7. 数据库配置了不支持事务的引擎，或者数据库本身就不支持事务。
8. propagation 事务传播行为配置错误：比如设置为 Propagation.NEVER。这种传播特性是不支持事务的。
9. 手动抛了了别的异常：spring 事务，默认情况只会回滚 RuntimeException（运行时异常）和 Error（错误），对于普通的 Exception（非运行时异常），它不会回滚。



# Spring 中事务的传播行为有哪些？

事务传播机制：在调用一个开启 Spring 事务的方法，那么在接下来的调用方法中，再次遇到一个需要开启 Spring 事务方法。那么此时到底公用一个事务呢？还是新开一个事务呢？可以根据不同的业务场景进行配置。

<font color=red>事务嵌套</font>



- Required（Spring 默认）：如果当前存在事务，则加入事务。如果不存在事务，则新创一个事务。
- Require_New：不管是否存在事务，都会新开一个事务。新老事务相互独立。外部事物抛出异常，不会影响内部事务的正常提交。
- Nested：如果当前存在事务，则嵌套在当前事务中，如果当前不存在事务，则新建一个事务。
- Supports：如果当前不存在事务，则以非事务的方式去执行。
- Not_supported：以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。
- Mandatory：强制事务执行。如果当前不存在事务，则抛出异常。
- Never：以非事务的方式执行。如果当前存在事务，则抛出异常。



propagation（传播）



下边两个方法执行，是在同一个事务中？还是新开一个事务呢？

```java
@Transactional
public void test(){
  // 执行 sql
  a();
}

@Transactional
public void a(){
  // 执行 sql
}
```



# Spring 中 Bean 的实例化和 Bean 的初始化有什么区别？

JVM 中类的加载过程

- 加载
- 链接
  - 验证
  - 准备
  - 解析
- 初始化



