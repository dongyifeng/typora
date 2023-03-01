---
typora-root-url: ../../../../typora
---

[TOC]

# NoSQL

NoSQL（NoSQL  = <font color=red>Not Only SQL</font>>），不仅仅是 SQL：泛指非关系型的数据库。

- 键值存储数据库
- 列存储数据库
- 文档型数据库
- 图形（Graph）数据库



Memcache 特点

- 很<font color=red>早</font>出现的 NoSQL 数据库
- 数据都在内存中，一般<font color=red>不持久化</font>
- 支持简单的 key-value，<font color=red>value 类型单一</font>
- 一般作为<font color=red>缓存数据库</font>辅助持久化的数据库。
- 多线程 + 锁



Redis（<font color=red>Re</font>mote <font color=red>Di</font>ctionary <font color=red>Server</font>）：远程字典服务。

Redis 与 Memcache 的不同

- value 支持多数据类型：String、List、Set、ZSet、Hash等
- 支持持久化
- 单线程 + 多路 IO 复用



Redis 的高性能

1. Redis 中的数据都是存储在内存中
2. Redis 使用 C 语言开发的



# 操作



## key

- `keys *` 查看当前库所有的 key
- `exists key` 判断某个 key 是否存在
- `type key` 查看 key 是什么类型
- `del key` 删除指定 key 的数据
- `unlink key` 根据 value 选择非阻塞删除
- `expire key 10` 为给定的 key 设置过期的时间
- `ttl key` 查看还有多少过期。返回值：-1 表示永不过期，-2 表示已过期





## Bitmaps

 如果能合理使用位操作，能够<font color=red>提高内存使用率。</font>

- Bitmaps 本身不是一种数据类型，实际上它就是<font color=red>字符串（value 类型是字符串）</font>，但是它可以对字符串的位进行操作。
- Bitmaps 单独提供了一套命令，可以把 Bitmaps 想象成一个以位为单位的数组，数组的每个单元只能存储 0 和 1。

![](/images/redis/WX20230202-181425.png)

`setbit <key> <offset> <value>`：设置 Bitmaps 中某个偏移位置的值（0 和 1）

`getbit <key> <offset>`：获取 Bitmaps 中对应偏移量的值

`bitcount <key>  [start end]`：统计字符串从 start 字节到 end 字节比特值为 1 的数量。

- start、end 是指 bit 数组的下标，二者皆包含
- -1 表示最后位，-2 表示倒数第二位

`bitop and(or/not/xor) <destkey> [key...]`：复合操作，可以多个 Bitmaps 的 and（交集）、or（并集）、not（非）、xor(异或)操作并将结果保存在 destkey 中。





offset：偏移量从 0 开始

注意：在第一次初始化 Bitmaps 时，如果偏移量非常大，那么整个初始化过程执行会比较慢，可能会造成 Redis 的阻塞。



## HyperLogLog

  HyperLogLog 用于处理<font color=red>**基数问题**</font>。

基数：数据集 { 1,3,5,7,5,7,8 } 那么这个数据集的基数集为 { 1,3,5,7 ,8 }（没有重复元素），基数为 5。



  **HyperLogLog 使用场景**

- 统计网站的 UV

HyperLogLog 只需要花费 12 KB 内存，就可以计算近 $2^{64}$ 个不同元素的基数。



**指令**

- `pfadd <key> <element> [element...]`：添加指定元素到 HyperLogLog 中。如果添加成功返回 1，否则为 0。重复添加为 0

- `pfcount <key> [key...]`：<font color=red>计算 HLL 的近似基数</font>

- `pfmerge <destkey> <sourcekey>[sourcekye...]` 将一个或者多个 HLL 合并后的结果存储到另一个 HLL 中。例如每月的活跃用户可以使用每天的活跃用户来合并计算可得。



## Geospatial

Redis 3.2 中增加了对 GEO（Geographic 地理信息的缩写） 类型的支持。

`geoadd <key> <longitude> <latitude> <member> [longitude latitude member] ` ：添加地理位置（经度、维度、名称）

经度范围：-180 到 180

维度范围：-85.05112878 到 85.05112878

 ```shell
 geoadd china:city 121.47 31.23 shanghai
 ```

 `geopos <key> <member>`：根据名称获取经纬度信息

 `geodist <key> <member1> <member2> [m|km|ft|mi]`：获取两个位置之间的直线距离

- m：米，默认值。
- km：千米
- mi：英里
- ft：英尺

`georadius <key> <longitude> <latitude> radius m|km|ft|mi`：以给定的经纬度为中心，找出某一半径内的元素。（附近的人）



## 订阅发布

1. 可以一次性订阅多个，`Subscribe c1 c2 c3`
2. 发布消息：`publish c2 hello-world` 
3. 使用通配符订阅多个频道：`PSubscribe new*`
4. 发布消息：`publish new1 hello-world`



## String



# 同舟共济--事务

Redis 事务是一个单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。事务在执行过程中，不会被其他客户端发送来的命令请求所打断。

Redis 事务的主要作用就是<font color=red>串联多个命令</font><font color=green>防止别的命令插队</font>。



在 Redis-cilent 输入 Mulit 命令开始，之后输入的命令都会依次进入命令队列中，不会执行，直到输入 Exec 命令后，Redis 会将之前的命令队列中命令依次执行。

在Mulit 命令之后，Exec 命令之前的组队过程中，可以通过 discard 来放弃组队。



<img src="/images/redis/WX20230202-200437@2x.png" style="zoom:50%;" />



在组队时有错误（语法错误），在执行时整个事务都不会被执行。

<img src="/images/redis/WX20230202-201540@2x.png" style="zoom:50%;" />

在组队阶段没有错误，在执行阶段某个命令出错，不会影响其他命令的执行。Redis 事务不保证原子性，事务中如果有一条命令执行失败，其后的命令任然会被执行，没有回滚。

<img src="/images/redis/WX20230202-201550@2x.png" style="zoom:50%;" />

## 加锁（watch）

事务出现冲突：

在执行 multi 之前，先执行 `watch key1 [key2]`，可以监视一个（或多个 key），如果在事务<font color=red>执行之前这个（这些）key被其他命令所改动，那么事务将被打断。</font>



`unwatch key [key1...]`：取消对 key 监视。



# 持久化

Redis 的数据全部在内存里，如果突然宕机，数据就会全部丢失，因此必须有一种机制来保证 Redis 的数据不会因为故障而丢失，这种机制就是 Redis 的持久化机制。



Redis 提供两种持久化方式

- RDB（Redis DataBase）：快照是一次全量备份。快照是内存数据的二进制序列化形式，在存储上非常紧凑。
- AOF（Append Only File）：日志是连续的增量备份。AOF 日志记录的是内存数据修改的指令记录文本。默认不开启

<img src="/images/redis/WX20230203-165247@2x.png" style="zoom:50%;" />

## RDB

在指定的<font color=red>时间间隔</font>将内存中的数据集<font color=red>快照</font>写入磁盘，它恢复时是将快照文件直接读到内存。



Redis 会单独创建（fork）一个子进程来进行持久化，会先将数据写入到一个<font color=red>临时文件</font>中，待持久化过程都结束了，再用这个<font color=red>临时文件替换上一次持久化好的文件</font>（<font color=orange>写时复制技术</font>）。整个过程中，主进程是不进行任何 IO 操作的，这就确保了极高的性能。如果需要进行大规模数据的恢复，且对于数据恢复的完整性不很非常敏感，那 RDB 方式要比 AOF 方式更加高效。<font color=red>**RDB 的缺点是最后一次持久化后的数据可能会丢失。**</font>



在 redis.conf 中配置文件名，默认为 dump.rdb

 

**RDB 优势**

- 适合大规模的数据恢复
- 对数据完整性和一致性要求不高
- 节省磁盘空间
- 恢复速度快



RDB 劣势

- Fork 的时候，内存中的数据被克隆了一份，大致 2 倍的膨胀空间
- <font color=green>虽然 Redis 在 fork 时使用了<font color=red>**写时拷贝技术**</font>，但是如果数据庞大是还是比较耗性能</font>
- <font color=green>定期进行备份，如果 Redis 意外 down 掉的话，就会丢失最后一次快照后的所有修改。</font>



## AOF

<font color=red>**以日志的形式来记录每个写操作（增量保存），只许追加文件但不可以修改文件**</font>，redis 启动之初会去读该文件重新构建数据。AOF 日志在长期的运行过程中会变的无比庞大，数据库重启时需要加载 AOF 日志进行指令重放，这个时间就会无比漫长。所以需要定期进行 AOF 重写，给 AOF 日志进行瘦身。

 

AOF 默认不开启，默认为 appendonly.aof，AOF 文件的路径与 RDB 的路径一致。



**异常恢复**

如果遇到<font color=red> AOF 文件损坏</font>，通过 /usr/local/bin/<font color=red>redis-check-aof --fix appendonly.aof</font> 进行修复



**AOF 同步频率设置**

- appendfsync always：<font color=green>始终同步，每次 Redis 的写操作都会立即记入日志</font>；性能较差，但数据完整性比较好。
- appendfsync everysec：<font color=green>每秒同步，每秒记录日志一次，如果宕机，本秒的数据可能丢失</font>；
- appendfsync no：<font color=green>redis 不主动进行同步，</font><font color=red>把同步时间交给操作系统</font>



**Rewrite 压缩**

AOF 采用文件追加方式，<font color=green>文件会越来越大，为了避免出现这种情况</font>，新增了重写机制，当 <font color=green>AOF 文件的大小超过所这设定的阈值时</font>，Redis 就会启动 AOF 文件的内容压缩，只保留可以恢复数据的最小指令集，可以使用命令`bgwriteaof`



重写原理

AOF 文件持续增长而过大时，会 fork 出一条子进程来将文件重写（先写临时文件最后再 rename）。<font color=red>redis 4.0 版本以后得重写，是将 rdb 的快照，以二进制的形式附在新的 aof 头部，作为已有的历史数据，替换掉原来的流水账操作。</font>



<img src="/images/redis/WX20230203-174339@2x.png" style="zoom:50%;" />



**AOF 优势**

- 备份机制更稳健，丢失数据的概率更低
- 可读的日志文件，可以处理误操作。



**AOF 劣势**

- 比起 RDB 占用更多的磁盘空间
- 恢复备份速度慢
- 每次读写都同步的话，有一定的性能压力
- 存在个别 Bug，造成不能恢复。



## 混合持久化

Redis 4.0 带来了一个新的持久化选项——混合持久化。将 rdb 文件的内容和增量的 AOF 日志文件存在一起。这里的 AOF 日志不再是全量的日志，而是自持久化开始到持久化结束的这段时间发生的增量 AOF 日志，通常这部分 AOF 日志很小。



于是在 Redis 重启的时候，可以先加载 rdb 的内容，然后再重放增量 AOF 日志就可以完全替代之前的 AOF 全量文件重放，重启效率因此大幅得到提升。

![](/images/redis/WX20230203-171339.png)





# 有备无患--主从同步



## CAP 原理

CAP 原理就好比分布式领域的牛顿定律，它是分布式存储的理论基石。

- C - Consistent，一致性：`all nodes see the same data at the same time`，即所有节点在同一时间的数据完全一致。
- A - Availability，可用性：`Reads and writes always succeed`，即服务在正常响应时间内一直可用。
- P - Partition tolerance，分区容忍性：`the system continues to operate despite arbitrary message loss or failure of part of the system`。即分布式系统在遇到某节点或网络分区故障的时候，仍然能够对外提供满足一致性或可用性的服务。

一个分布式系统，不可能同时做到这三点。

![](/images/redis/v2-3b7731ca7da1d609b93f536563f8f05f_1440w.webp)





在网络分区发生时，两个分布式节点之间无法进行通信，我们对一个节点进行的修改操作将无法同步到另外一个节点，所以数据的「**一致性**」将无法满足，因为两个分布式节点的数据不再保持一致。除非我们牺牲「**可用性**」，也就是暂停分布式节点服务，在网络分区发生时，不再提供修改数据的功能，直到网络状况完全恢复正常再继续对外提供服务。

<img src="/images/redis/WX20230205-224917@2x.png" style="zoom:50%;" />

一句话概括 CAP 原理就是——<font color=red>**网络分区发生时，一致性和可用性两难全**</font>。



## 最终一致

Redis 的主从数据是异步同步的，所以分布式的 Redis 系统并不满足「<font color=green>**一致性**</font>」要求。当客户端在 Redis 的主节点修改了数据后，立即返回，即使在主从网络断开的情况下，主节点依旧可以正常对外提供修改服务，所以 Redis 满足「<font color=green>**可用性**</font>」。

Redis 保证「<font color=green>**最终一致性**</font>」，从节点会努力追赶主节点，最终从节点的状态会和主节点的状态将保持一致。如果网络断开了，主从节点的数据将会出现大量不一致，一旦网络恢复，从节点会采用多种策略努力追赶上落后的数据，继续尽力保持和主节点一致。



## 主从同步

Redis 同步支持<font color=red>主从同步</font>和<font color=red>从从同步</font>，从从同步功能是 Redis 后续版本增加的功能，为了减轻主库的同步负担。后面为了描述上的方便，统一理解为主从同步。



![](/images/redis/WX20230205-225538@2x.png)

## 增量同步

Redis 同步的是指令流，主节点会将那些对自己的状态产生修改性影响的指令记录在本地的内存 buffer 中，然后异步将 buffer 中的指令同步到从节点，从节点一边执行同步的指令流来达到和主节点一样的状态，一边向主节点反馈自己同步到哪里了 (偏移量)。

因为内存的 buffer 是有限的，所以 Redis 主库不能将所有的指令都记录在内存 buffer 中。Redis 的复制内存 buffer 是一个定长的环形数组，如果数组内容满了，就会从头开始覆盖前面的内容。

如果因为网络状况不好，从节点在短时间内无法和主节点进行同步，那么当网络状况恢复时，Redis 的主节点中那些没有同步的指令在 buffer 中有可能已经被后续的指令覆盖掉了，从节点将无法直接通过指令流来进行同步，这个时候就需要用到更加复杂的同步机制 —— 快照同步。

<img src="/images/redis/WX20230205-230625@2x.png" style="zoom:50%;" />

## 快照同步

快照同步是一个非常耗费资源的操作，它首先需要在主库上进行一次 bgsave 将当前内存的数据全部快照到磁盘文件中，然后再将快照文件的内容全部传送到从节点。从节点将快照文件接受完毕后，立即执行一次全量加载，加载之前先要将当前内存的数据清空。加载完毕后通知主节点继续进行增量同步。

在整个快照同步进行的过程中，主节点的复制 buffer 还在不停的往前移动，如果快照同步的时间过长或者复制 buffer 太小，都会导致同步期间的增量指令在复制 buffer 中被覆盖，这样就会导致快照同步完成后无法进行增量复制，然后会再次发起快照同步，如此极有可能会陷入快照同步的死循环。

所以务必配置一个合适的复制 buffer 大小参数，避免快照复制的死循环。

![](/images/redis/WX20230205-231316@2x.png)

## 增加从节点

当从节点刚刚加入到集群时，它必须先要进行一次快照同步，同步完成后再继续进行增量同步。



## 无盘复制

主节点在进行快照同步时，会进行很重的文件 IO 操作，特别是对于非 SSD 磁盘存储时，快照会对系统的负载产生较大影响。特别是当系统正在进行 AOF 的 fsync 操作时如果发生快照，fsync 将会被推迟执行，这就会严重影响主节点的服务效率。

所以从 Redis 2.8.18 版开始支持无盘复制。所谓无盘复制是指主服务器直接通过套接字将快照内容发送到从节点，生成快照是一个遍历的过程，主节点会一边遍历内存，一边将序列化的内容发送到从节点，从节点还是跟之前一样，先将接收到的内容存储到磁盘文件中，再进行一次性加载。



## Wait 指令

Redis 的复制是异步进行的，wait 指令可以让异步复制变身同步复制，确保系统的强一致性 (不严格)。wait 指令是 Redis3.0 版本以后才出现的。

```shell
> set key value
OK
> wait 1 0
(integer) 1
```

wait 提供两个参数，第一个参数是从库的数量 N，第二个参数是时间 t，以毫秒为单位。它表示等待 wait 指令之前的所有写操作同步到 N 个从库 (也就是确保 N 个从库的同步没有滞后)，最多等待时间 t。如果时间 t=0，表示无限等待直到 N 个从库同步完成达成一致。

假设此时出现了网络分区，wait 指令第二个参数时间 t=0，主从同步无法继续进行，wait 指令会永远阻塞，Redis 服务器将丧失可用性。