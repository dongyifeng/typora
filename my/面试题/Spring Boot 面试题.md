---
typora-root-url: ../../../typora
---

[TOC]



## Spring Boot启动流程

- 首先从 main 找到 run() 方法，在执行 run() 方法之前 new 一个 SpringApplication 对象
- 进入run() 方法，创建应用监听器 SpringApplicationRunListeners 开始监听
- 然后加载 SpringBoot 配置环境 (ConfigurableEnvironment)，然后把配置环境 (Environment) 加入监听对象中
- 然后加载应用上下文(ConfigurableApplicationContext)，当做 run 方法的返回对象
- 最后创建 Spring 容器，refreshContext(context)，实现 starter 自动化配置和 bean 的实例化等工作。



## SpringBoot自动装配

通过`@EnableAutoConfiguration`注解在类路径的 META-INF/spring.factories 文件中找到所有的对应配置类，然后将这些自动配置类加载到 spring 容器中。



# 如何理解 Spring Boot中的 Starter？

Starter 组件的核心功能

- 