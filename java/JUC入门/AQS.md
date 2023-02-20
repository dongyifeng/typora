---
typora-root-url: ../../../typora
---

[TOC]

# 概述

AQS（AbstractQueuedSynchronizer）字面意思：抽象队列同步器



AQS 是用来实现锁或者其他同步器组件的公共基础部分的抽象实现。是<font color=red>重量级基础框架及整个 JUC 体系的基石，主要用于解决锁分配给 “谁” 的问题</font>