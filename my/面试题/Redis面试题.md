---
typora-root-url: ../../../typora
---

[TOC]

# 1. 什么是缓存穿透、缓存击穿、缓存雪崩？

**缓存雪崩**：当某一个时刻出现<font color=red>大规模的缓存失效</font>的情况，那么就会导致大量的请求直接打在数据库上面，导致数据库压力巨大

1、在原有的失效时间上加上一个随机值，比如1-5分钟随机。这样就避免了因为采用相同的过期时间导致的缓存雪崩。

如果真的发生了缓存雪崩，有没有什么兜底的措施？

2、使用熔断机制。当流量到达一定的阈值时，就直接返回“系统拥挤”之类的提示，防止过多的请求打在数据库上。至少能保证一部分用户是可以正常使用，其他用户多刷新几次也能得到结果。

3、提高数据库的容灾能力，可以使用分库分表，读写分离的策略。

4、为了防止Redis宕机导致缓存雪崩的问题，可以搭建Redis集群，提高Redis的容灾性。



**缓存击穿**：一个<font color=red>热点的Key</font>，有大并发集中对其进行访问，突然间这个Key失效了，导致大并发全部打在数据库上，导致数据库压力剧增。这种现象就叫做缓存击穿。



1、上面说过了，如果业务允许的话，对于热点的key可以设置永不过期的key。

2、使用互斥锁。如果缓存失效的情况，只有拿到锁才可以查询数据库，降低了在同一时刻打在数据库上的请求，防止数据库打死。当然这样会导致系统的性能变差。



**缓存穿透**：Redis 和数据中都没有数据。

1、**把无效的Key存进Redis中**。如果Redis查不到数据，数据库也查不到，我们把这个Key值保存进Redis，设置value="null"，当下次再通过这个Key查询时就不需要再查询数据库。这种处理方式肯定是有问题的，假如传进来的这个不存在的Key值每次都是随机的，那存进Redis也没有意义。

2、**使用布隆过滤器**。布隆过滤器的作用是某个 key 不存在，那么就一定不存在，它说某个 key 存在，那么很大可能是存在(存在一定的误判率)。于是我们可以在缓存之前再加一层布隆过滤器，在查询的时候先去布隆过滤器查询 key 是否存在，如果不存在就直接返回。



# 2. ZSet 的底层实现？怎么保证有序的？

一个字典，一个跳跃表。

# 3. Redis 的回收策略（淘汰策略）

当 Redis 使用达到一个 <font color=red>maxmemory</font> 参数配置阈值的时候，那么 Redis 就会根据配置的内存淘汰策略，把访问不高的 key 淘汰掉。maxmemory 默认值是服务器的最大内存。



Redis 提供八中缓存策略，这 8 中淘汰策略可以归类为以下五种：

1. 采用 LRU 策略：将不经常使用的 key 直接淘汰掉
2. 采用 LFU 策略：将最近最少访问的 key 直接淘汰掉，避免淘汰热点数据。
3. 随机策略：Redis 随机删除一些 key
4. ttl 策略：从设置过期时间的 key 里面，挑选出过期时间最近的一些key，进行淘汰。
5. 直接报错：这是一个默认策略。

以上的策略可以 redis.conf 文件里进行配置。

最后我们在使用缓存时，建议设置过期时间。因为我们根据业务大概知道这些缓存大概得一个生命周期。



# 3.5 Redis 内存淘汰算法和原理是什么？

https://www.bilibili.com/video/BV1oG4y1o7cg?p=5&vd_source=33cf6df70b8d525d3f3f293e32d3815d



# 4. Redis 过期时间的机制



# 5. 存在线程安全问题吗？

 答案：不存在。

Redis-Server 本身是一个线程安全的 Key-value 数据库。虽然在 Redis 6.0 里增加了多线程模型，多线程模型只是去处理网络 IO 事件。对于指令的执行过程仍然是采用主线来处理。所以并不会存在多个线程同时操作指令的情况。



多个 Redis-Client 同时执行多个操作指令，就无法保证原子性了。Redis-Client 线程安全的问题解决方法

1. 尽可能使用 Redis 里面的原子指令。
2. 或者对多个客户端操作去加锁。
3. 我们可以通过 Lua 脚本，来实现多个执行的执行操作。



# 6. Redis 为什么设计成单线程？

1. Redis Server 本身的可能出现的<font color=red>性能瓶颈点</font>无非是：<font color=red>网络IO、CPU、内存</font>。但是 <font color=red>CPU 不是Redis 的瓶颈</font>。所以没有必要使用多线程。
2. 如果使用多线程，意味着 <font color=red>redis 的所有指令操作</font>，都必须要考虑线<font color=red>程安全问题</font>，也就是说需要通过<font color=red>加锁</font>来解决，这种方式带了<font color=red>性能影响</font>反而更<font color=red>大</font>了。



# 7.**Redis** 集群架构模式有哪几种？

- 单节点
- 一主多从
- 带哨兵的集群部署方式。



# 8. Redis 中 AOF 重写的过程

Redis 会将每个数据更新的操作指令追加到 AOF 文件里，所以很容易导致 AOF文件过大，造成 IO 性能的问题。Redis 为了解决这个问题，设计出了 AOF重写的机制。Redis 会将 AOF 文件里面的相同的指令进行压缩，只保留最新的一个数据指令。比如说：AOF 文件中有对同一个 key 的多次操作，我们只需要保留最后一次即可。历史数据就没有必要留在文件中了。

AOF 文件的重写分为几个步骤：

1. 首先，根据当前 Redis 内存里面的数据，重新构建一个新的 AOF 文件。
2. 然后，读取当前 Reids 里面的数据，写入到新的 AOF 文件里面。
3. 最后，重现完成以后，用新的AOF文件，覆盖现有的 AOF文件。



另外AOF 文件在重写的过程中，需要读取当前内存中的所有的数据，再去生成对应的一个新的指令。 而这个过程很明显会比较耗时，对应业务会产生影响。 于是 Redis 将重写这个过程放在后台的子进程里去完成。子进程在重写时，主进程依然可以去处理客户端的请求。最后为了避免子进程在重写过程中，主进程中的数据发生变化，导致AOF文件里的数据和 Redis 内存中数据不一致的问题。Redis 做了一层优化：子进程在重写的过程中，主进程的数据变更会追加到 AOF 的重写缓冲区中。等到 AOF 重写完成以后，再把 AOF 重写缓冲区里面的数据，追加到新的 AOF 文件里。这样也就保证新的 AOF 文件里面的数据和当前的 Redis 内存中的数据是一致的。



# 9 Redis 和 Mysql 如何保证数据一致性





# 分布式锁

## 分布式锁具备的条件

1. 在分布式环境下，在一个方法在同一时间只能被一台机器的一个线程执行。
2. 获取锁与释放锁要：高可用，高性能
3. 具备可重入特性
4. 具备锁失效机制，防止死锁。
5. 具备非阻塞特性，即没有获取到锁直接返回获取锁失败。



## 基于 Redis 的分布式锁

1. 加锁：执行setnx，若成功再执行expire添加过期时间

2. 解锁：执行delete命令

优点：实现简单，相比数据库和分布式系统的实现，该方案最轻，性能最好。



缺点：

1.setnx 和 expire 分2步执行，非原子操作；若 setnx 执行成功，但 expire 执行失败，就可能出现死锁
2. delete 命令存在误删除非当前线程持有的锁的可能
3.不支持阻塞等待、不可重入



Redisson ：

满足：

- 可重入性
- 支持续约：看门狗



缺点:

- 实现复杂
- 存在分布式问题：

<img src="/images/tmp/WX20230309-165239@2x.png" style="zoom:50%;" />



<img src="/images/tmp/WX20230309-165330@2x.png" style="zoom:40%;" />



<img src="/images/tmp/WX20230309-165635@2x.png" style="zoom:30%;" />



解锁时通过 Lua 脚本先检查锁。



## 基于数据库

基于mysql 表唯一索引。

原理：

1.表增加唯一索引
2.加锁：执行insert语句，若报错，则表明加锁失败
3.解锁：执行delete语句



优点：完全利用DB现有能力，实现简单

缺点：

1.锁无超时自动失效机制，有死锁风险
2.不支持锁重入，不支持阻塞等待
3.操作数据库开销大，性能不高



## 基于 ZooKeeper

基于ZooKeeper

原理：

1.加锁：在/lock目录下创建临时有序节点，判断创建的节点序号是否最小。若是，则表示获取到锁；否，则则watch /lock目录下序号比自身小的前一个节点
2.解锁：删除节点

优点：

1.由zk保障系统高可用
2.Curator框架已原生支持系列分布式锁命令，使用简单

缺点：需单独维护一套zk集群，维保成本高



# FIFO , OPT , LRU , NRU , SCR , LFU , PB



## Bitmaps

 Bitmaps：

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



<img src="/images/redis/WX20230205-225538@2x.png" style="zoom:50%;" />

## 增量同步

<font color=red>Redis 同步的是指令流</font>，主节点会将那些对自己的状态产生修改性影响的指令记录在本地的内存 buffer 中，然后异步将 buffer 中的指令同步到从节点，从节点一边执行同步的指令流来达到和主节点一样的状态，一边向主节点反馈自己同步到哪里了 (偏移量)。

因为内存的 buffer 是有限的，所以 Redis 主库不能将所有的指令都记录在内存 buffer 中。Redis 的复制内存 buffer 是一个<font color=red>定长的环形数组</font>，如果数组内容满了，就会从头开始覆盖前面的内容。

如果因为网络状况不好，从节点在短时间内无法和主节点进行同步，那么当网络状况恢复时，Redis 的主节点中那些没有同步的指令在 buffer 中有可能已经被后续的指令覆盖掉了，从节点将无法直接通过指令流来进行同步，这个时候就需要用到更加复杂的同步机制 —— <font color=red>快照同步</font>。

<img src="/images/redis/WX20230205-230625@2x.png" style="zoom:50%;" />

## 快照同步

快照同步是一个非常耗费资源的操作，它首先需要在主库上进行一次 bgsave 将<font color=green>当前内存的数据全部快照到磁盘文件中</font>，然后再将快照文件的内容全部<font color=green>传送到从节点</font>。从节点将快照文件接受完毕后，立即<font color=green>执行一次全量加载</font>，加载之前先要将当前内存的数据清空。加载完毕后通知主节点继续进行增量同步。

在整个快照同步进行的过程中，主节点的复制 buffer 还在不停的往前移动，如果快照同步的时间过长或者复制 buffer 太小，都会导致同步期间的增量指令在复制 buffer 中被覆盖，这样就会导致快照同步完成后<font color=red>无法进行增量复制</font>，然后会<font color=red>再次发起快照同步</font>，如此极有可能会陷入快照同步的<font color=red>死循环</font>。

所以务必配置一个合适的复制 buffer 大小参数，避免快照复制的死循环。

<img src="/images/redis/WX20230205-231316@2x.png" style="zoom:50%;" />

## 增加从节点

当从节点刚刚加入到集群时，它必须先要进行一次快照同步，同步完成后再继续进行增量同步。



## 无盘复制

主节点在进行快照同步时，会进行很重的文件 IO 操作，特别是对于非 SSD 磁盘存储时，快照会对系统的负载产生较大影响。特别是当系统正在进行 AOF 的 fsync 操作时如果发生快照，fsync 将会被推迟执行，这就会严重影响主节点的服务效率。

所以从 Redis 2.8.18 版开始支持无盘复制。所谓无盘复制是指主服务器直接通过套接字将快照内容发送到从节点，生成快照是一个遍历的过程，主节点会一边遍历内存，一边将序列化的内容发送到从节点，从节点还是跟之前一样，先将接收到的内容存储到磁盘文件中，再进行一次性加载。



## Wait 指令

Redis 的复制是异步进行的，<font color=red>wait 指令可以让异步复制变身同步复制</font>，确保系统的强一致性 (不严格)。wait 指令是 Redis3.0 版本以后才出现的。

```shell
> set key value
OK
> wait 1 0
(integer) 1
```

wait 提供两个参数，第一个参数是从库的数量 N，第二个参数是时间 t，以毫秒为单位。它表示等待 wait 指令之前的所有写操作同步到 N 个从库 (也就是确保 N 个从库的同步没有滞后)，最多等待时间 t。如果时间 t=0，表示无限等待直到 N 个从库同步完成达成一致。

假设此时出现了网络分区，wait 指令第二个参数时间 t=0，主从同步无法继续进行，wait 指令会永远阻塞，Redis 服务器将丧失可用性。







