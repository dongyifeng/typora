---
typora-root-url: ../../../typora
---

[TOC]

> 官网推荐给Elasticsearch[分配的内存不能超过32GB](https://www.elastic.co/guide/en/elasticsearch/guide/current/heap-sizing.html)(小于32GB时会启用compressed oops，节省很多内存)
>
> 并且还必须是小于物理内存的50%，以便为Lucene利用Cached Memory提供更多的剩余内存。



给 es 分配内存时要注意，至少要分配一半儿内存留给 Lucene。
分配给 es 的内存最好不要超过 32G ，因为如果<font color=red>堆大小小于 32 GB，JVM 可以利用指针压缩</font>，这可以大大降低内存的使用：每个指针 4 字节而不是 8 字节。如果大于32G 每个指针占用 8字节，并且会占用更多的内存带宽，降低了cpu性能。



Elasticsearch内部是如何使用这些内存的呢？下面这张图说明了Elasticsearch和Lucene对内存的使用情况。

Elasticsearch 限制的内存大小是 JAVA 堆空间的大小，不包括 Lucene 缓存倒排索引数据空间。

<img src="/images/es/es-cache.png" style="zoom:60%;" />





# Lucene对内存的使用

Elasticsearch是基于Lucene实现。Lucene的segments（包括用于全文检索的inverted index以及用于聚合的doc values）都存储在单个文件中，这些文件都是不可变的，被经常访问的 segments 会常驻在OS的内存中，从而提升Lucene的性能。

> Lucene使用off heap，官方建议至少预留50%的物理内存给Luncene。
>
> Lucene 被设计为可以利用<font color=red>操作系统底层机制来缓存</font>内存数据结构。 Lucene 的段是分别存储到单个文件中的。因为<font color=red>段是不可变的</font>，这些文件也都不会变化，这是对<font color=red>缓存友好</font>的，同时操作系统也会把这些段文件缓存起来，以便更快的访问。



# Node Query Cache 

Node Query Cache ：每个节点都有一个Node Query Cache，被所有 shards 共享。它负责缓存使用了 filter 的 query 结果，因为filter query的结果要么是 yes 要么是 no，不涉及到scores的计算，非常使用于 Cache 的场景。

> 集群中的每个data节点必须配置
> 默认10%，也可以设置为绝对值，比如512mb

```shell
# Node Query Cache的默认大小：
indices.queries.cache.size:10% 
index.queries.cache.enabled:true
```



# Indexing Buffer

索引缓冲区，用于存储新索引的文档，当其被填满时，缓冲区中的文档被写入磁盘中的 segments 中。节点上所有 shard 共享。



```shell
# Indexing Buffer的默认大小：
indices.memory.index_buffer_size:10%
indices.memory.min_index_buffer_size:48mb
indices.memory.max_index_buffer_size:unbounded
```



# Shard Request Cache

只有reqeust size是 0 的才会被 cache，比如 aggregations、counts 和 suggestions。



> 不建议将它用于更新频繁的index，因为 shard 被更新时，该缓存会自动失效。

```shell
# Shard Request Cache的默认大小：
indices.requests.cache.size:1%
```



# Field Data Cache

在 analyzed 字符串上对 field 进行<font color=red>聚合计算</font>时，Elastisearch 会加载该 field 的所有值到内存中，这些值缓存在 Field Data Cache 里面。
所以 Fielddata 是<font color=red>懒加载</font>，并且是在 query 过程中生成的。

indices.fielddata.cache.size 控制了分配给 fielddata 的 heap 大小。它的<font color=red>默认值是 unbounded（无界）</font>，这么设计的原因是 fielddata不是临时性的 cache，它能够极大地提升性能，而且构建 fielddata 又比较耗时的操作，所以需要一直 cache。
如果没有足够的内存保存 fielddata 时，Elastisearch 会不断地从磁盘加载数据到内存，并剔除掉旧的内存数据。剔除操作会造成严重的磁盘 I/O，并且引发大量的 GC，会严重影响 Elastisearch 的性能。



```shell
# Field Data Cache的默认大小：
indices.fielddata.cache.size:unbounded
```

如果不在 analyzed string fields上使用聚合，就不会产生 Field Data Cache，也就不会使用大量的内存，所以可以考虑分配较小的 heap给 Elasticsearch。<font color=red>因为 heap 越小意味着 Elasticsearch 的 GC 会比较快</font>，并且预留给 Lucene 的内存也会比较大。



# 查看内存使用情况



## 查看 segments 使用的内存

通过查看 <font color=red> cat segments </font>查看index的segments使用内存的情况

```shell
GET /_cat/segments?v
```



## 查看 Node Query Cache、Indexing Buffer和Field Data Cache使用的内存

通过<font color=red>cat nodes</font>可以查看他们使用内存的情况

```shell
GET /_cat/nodes?v&h=id,ip,port,v,master,name,heap.current,heap.percent,heap.max,
ram.current,ram.percent,ram.max,
fielddata.memory_size,fielddata.evictions,query_cache.memory_size,query_cache.evictions, 
request_cache.memory_size,request_cache.evictions,request_cache.hit_count,request_cache.miss_count
```



## <font color=red>谨慎对待 unbounded 的内存</font>

unbounded内存是不可控的，会占用大量的heap(Field Data Cache)或者off heap(segments)，从而会导致Elasticsearch OOM
或者因segments占用大量内存导致swap。
segments和Field Data Cache都属于这类unbounded。



## segments

segments 会长期占用内存，其初衷就是利用 OS 的 cache 提升性能。只有在 Merge 之后，才会释放掉标记为 Delete 的 segments，释放部分内存。



## Field Data Cache

默认情况下Fielddata会不断占用内存，直到它触发了 fielddata circuit breaker。
**fielddata circuit breaker**会根据查询条件评估这次查询会使用多少内存，从而计算加载这部分内存之后，Field Data Cache所占用的内存是否会超过indices.breaker.fielddata.limit。如果超过这个值，就会触发fielddata circuit breaker，abort这次查询并且抛出异常，防止OOM。



```shell
indices.breaker.fielddata.limit:60% (默认heap的60%)
```

如果设置了indices.fielddata.cache.size，当达到 size 时，cache 会剔除旧的 fielddata。

> indices.breaker.fielddata.limit **必须大于** indices.fielddata.cache.size，否则只会触发 fielddata circuit breaker，而不会剔除旧的fielddata。



###  Swapping 是性能的坟墓

内存交换 到磁盘对服务器性能来说是 *致命* 的。

要关闭 swap 内存交换空间，禁用 swapping。频繁的swapping 对服务器来说是致命的。



```shell
# 暂时禁用
sudo swapoff -a
```

如果需要永久禁用，你可能需要修改 `/etc/fstab` 文件，这要参考你的操作系统相关文档。

如果你并不打算完全禁用 swap，也可以选择降低 `swappiness` 的值。 这个值决定操作系统交换内存的频率。 这可以预防正常情况下发生交换，但仍允许操作系统在紧急情况下发生交换。

对于大部分Linux操作系统，可以在 `sysctl` 中这样配置：

```shell
vm.swappiness = 1
```



最后，如果上面的方法都不合适，你需要打开配置文件中的 `mlockall` 开关。 它的作用就是允许 JVM 锁住内存，禁止操作系统交换出去。在你的 `elasticsearch.yml` 文件中，设置如下：

```shell
bootstrap.mlockall: true
```





参考文档：

https://www.elastic.co/guide/cn/elasticsearch/guide/current/heap-sizing.html