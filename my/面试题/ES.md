# 分片数

- 一个分片不超过 32 G
- 节点数 <= 主分片数 * （副本数 + 1）



# 详细描述一下 Elasticsearch 索引文档的过程。

协调节点默认使用文档 ID 参与计算（也支持通过 routing），以便为路由提供合适的分片。
shard = hash(document_id) % (num_of_primary_shards)

1. 当分片所在的节点接收到来自协调节点的请求后，会将请求写入到 MemoryBuffer，然后定时（默认是每隔 1 秒）写入到 Filesystem Cache，这个从 MomeryBuffer 到 Filesystem Cache 的过程就叫做 refresh；
2. 当然在某些情况下，存在 Momery Buffer 和 Filesystem Cache 的数据可能会丢失，ES 是通过 translog 的机制来保证数据的可靠性的。其实现机制是接收到请求后，同时也会写入到 translog 中 ，当 Filesystem cache 中的数据写入到磁盘中时，才会清除掉，这个过程叫做 flush；
3. 在 flush 过程中，内存中的缓冲将被清除，内容被写入一个新段（段合并），段的 fsync将创建一个新的提交点，并将内容刷新到磁盘，旧的 translog 将被删除并开始一个新的 translog。
4. flush 触发的时机是定时触发（默认 30 分钟）或者 translog 变得太大（默认为 512M）时；

<img src="/Users/dadao1/dadao/git/typora/images/es/WX20230302-113652@2x.png" style="zoom:33%;" />



## 



# 写优化

针对搜索要求不高，但是对写入要求较高的场景（日志收集）

- 加大 Translog Flush，目的是降低 Iops、Writeblock
- 增加 Index Refresh 间隔，目的是减少 Segment Merge 的次数
- 调整 Bulk 线程池和队列
- 优化节点间的任务分布
- 优化 Lucene 层的索引建立，目的是降低 CPU 及 IO



ES 提供了 Bulk API 支持批量操作，大量写入任务时，使用 Bulk 来进行批量写入。Bulk 默认设置批量提交的数据量不能超过 100M。单次批量处理的数据大小应从 5MB ~ 15MB 逐渐增加，当性能没有提升时，把这个数据量作为本系统的最大值。



Lucene 在数据新增时，采用了延迟写入的策略，默认情况下，索引的 refresh_interval 为 1 秒。

Lucene 将待写入的数据写到内存中，超过 1 秒就会触发一次 Refresh，然后 Refresh 会把内存中的数据刷新到操作系统文件缓存系统中。

减少副本数量。



SSD 硬盘。





补充：关于 Lucene 的 Segement：

1. Lucene 索引是由多个段组成，段本身是一个功能齐全的倒排索引。
2. 段是不可变的，允许 Lucene 将新的文档增量地添加到索引中，而不用从头重建索引。
3. 对于每一个搜索请求而言，索引中的所有段都会被搜索，并且每个段会消耗CPU 的时钟周、文件句柄和内存。这意味着段的数量越多，搜索性能会越低。
4. 为了解决这个问题，Elasticsearch 会合并小段到一个较大的段，提交新的合并段到磁盘，并删除那些旧的小段。





# 删除

ES 是逻辑删除，将删除的数据存放在 .del 文件中。该文档依然能匹配查询，但是会在结果中被过滤掉。当段段合并时，.del 文件的数据不会被写入新段。

