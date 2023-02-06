---
typora-root-url: ../../typora
---

[TOC]

# 背景

在数据库需要分库分表时，需要保持主键 ID 保持唯一性，因此需要分布式 ID 生产器。



分布式 ID 需要满足以下条件

- 全局唯一
- 高性能
- 高可用
- 易用
- 趋势递增



# 方案一：UUID

优点：本地生产，方便，易用。

缺点：

- 长度太长，存储空间大
- 类型为字符串，不便于建索引进行检索。
- 不递增



# 方案二：基于数据库自增 ID



如下图：利用Mysql 中自增列的特性生成自增 ID，将生成的 ID 分配给不同的分表。

![](/images/distributed/WX20230206-215037@2x.png)

如下图：比方案一，多一次 Mysql 请求。

![](/images/distributed/WX20230206-215857@2x.png)

优点：

1. 实现简单
2. 生成的 ID：单调递增
3. 生成的 ID：数值类型，便于创建索引，查询快。



缺点：

1. 生成 ID 使用了单表，存在单点问题，有宕机的危险。



# 方案三：基于数据库集群自增 ID

将方案二中的单点改为集群。

通过设置不同的初始值和步长，达到生成的 ID 不重复的目的。

![](/images/distributed/WX20230206-222110@2x.png)

![](/images/distributed/WX20230206-224515@2x.png)

缺点：不利于后续扩展，比如要新增一个库，如果没有预留字段，可能会出现重复 ID。



# 方案四：基于数据库的号段模式







# 方案五：基于 Redis 模式

使用 Redis `incr` 的原子操作实现分布式 ID。

<font color=red>注意：Redis 持久化有可能会丢数据</font>。如果丢失数据，有可能出现重复 ID 。



# 方案六：基于雪花算法模式

今天的主角雪花算法，它是Twitter开源的由64位整数组成分布式ID，性能较高，并且在单机上递增。



如下图：

1. **第一位** 占用1bit，其值始终是0，没有实际作用。 
2. **时间戳** 占用41bit，精确到毫秒，总共可以容纳约69年的时间。
3. **工作机器id** 占用10bit，其中高位5bit是数据中心ID，低位5bit是工作节点ID，做多可以容纳1024个节点。 
4. **序列号** 占用12bit，每个节点每毫秒0开始不断累加，最多可以累加到4095，一共可以产生4096个ID。

SnowFlake 算法在同一毫秒内最多可以生成多少个全局唯一ID呢：： **同一毫秒的ID数量 = 1024 X 4096 = 4194304**

![](/images/distributed/1572487293728.avif)

雪花算法的开源实现：

- SnowFlake Twitter https://github.com/twitter-archive/snowflake

- uidGenerator 百度 https://github.com/baidu/uid-generator/blob/master/README.zh_cn.md

- [美团]: https://tech.meituan.com/2017/04/21/mt-leaf.html	"美团"

  

优点：

1. 与 UUID 类似在本地生成 ID，少一次网络请求
2. 生成 ID 整体是递增的，但是不是连续的
3. 生成速度快

缺点：

1. ID 长度比较大（大概 18位）
2. ID 不连续，生成 ID 是无规则的
3. <font color=red>如果机器时钟回拨，就可能会导致 id 生成重复</font>
4. 不同机器的时钟不是完全一致的，导致全局的 ID 并不是统一向上自增。

