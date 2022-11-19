#### 一、查看方式

explain select * from word_keywords_hit_detail where operate_id = 1 and create_time > 1666098030033

```json
{
  "id": 1,
  "select_type": "SIMPLE",
  "table": "word_keywords_hit_detail",
  "partitions": "(null)",
  "type": "range",
  "possible_keys": "idx_operate_id_create_time",
  "key": "idx_operate_id_create_time",
  "key_len": 12,
  "ref": "(null)",
  "rows": 1141,
  "filtered": 100,
  "Extra": "Using index condition"
}
```

#### 二、字段说明

##### 1、id：SELECT查询的系列号

可以为NULL。id相同，执行顺序相同，从上往下执行；id不同，id越大越先被执行。

- 单表、连接查询(内连、左连、右连)语句中，id相同

```sql
explain
select * from operation_status_log s
left join 
operation_comment_log m on s.content_uid = m.reply_status_id
```

- 有子查询的语句id可能相同也可能不同

```sql
explain
select * from operation_status_log s
where
  s.id in (select m.id from operation_comment_log m)
  or s.content_uid = 124
```

- **一般来说**，对于包含UNION子句的查询语句来说，每个SELECT关键字对应一个 id值。

```sql
explain 
select id,content_id,content_uid,operation_module from operation_status_log 
union 
select id,content_id,content_uid,operation_module from operation_comment_log ;
```

##### 2、select_type：查询类型

- SIMPLE ：简单SELECT查询，查询中不包含子查询或者 UNION
- PRIMARY ：对于包含 UNION、UNION ALL 或者子查询的复杂查询来说，它是由几个小查询 组成的，其中最左边的那个查询的 select_type 值就是 PRIMARY。
- UNION ：对于包含 UNION 或者 UNION ALL 的复杂查询来说，它是由几个小查询组成的， 其中除了最左边的那个小查询以外，其余的查询的 select_type 值就是 UNION。
- UNION RESULT：MySQL 选择使用临时表来完成 UNION 查询的去重工作，针对该临时表的查 询的 select_type 就是 UNION RESULT。
- SUBQUERY：不会被查询优化器优化的子查询中，不依赖于外部查询的结果集，第一个 SELECT 关键字代表的那个查询的 select_type 就是 SUBQUERY。
- DEPENDENT SUBQUERY：子查询中的第一个 select 查询，依赖于外部查询的结果集，select_type 的值 就是DEPENDENT SUBQUERY

##### 3、table：被查询的表名

除了真实表可能出现的3种表名如下：

- `<unionM,N>`：通过union查询产生的结果，M、N分别代表着执行计划id的值
- `<derivedN>`：N的值为派生表的id值。派生表可能是FROM语句中的子查询

```sql
explain
select * from  (select content_uid,operation_module from operation_comment_log  group by content_uid,operation_module) d
  where d.content_uid = 4232765571
```

- `<subqueryN>`：N为物化子查询的id值

##### 4、partitions：分区相关

基本都为null

##### 5、type：表示表连接类型或者数据访问类型

表之间通过什么方式建立连接的，或者通过什么方式访问到数据的。

结果值从最好到最坏依次是：

**system > const > eq_ref > ref > fulltext > ref_or_null > index_merge > unique_subquery > index_subquery > range > index > ALL**

- system：一般是MyISAM存储引擎，查询系统记录信息
- const：根据主键或者唯一索引列与常数进行等值匹配
- eq_ref：被驱动表是通过主键或者唯一二级索引列等值匹配的方式进行访问(小表驱动大表)
- ref：当通过普通的二级索引列与常量进行等值匹配时来查询某个表
- range ：使用索引获取某些范围区间的记录(>，<，in，between)
- index：当使用索引覆盖，但需要扫描全部的索引记录
- All：全表扫描

常见的：**system>const>eq_ref>ref>range>index>ALL** 

##### 6、possible_keys：可能用到的索引

##### 7、key：实际使用到的索引

当possible_keys出现多个索引时，查询优化器会计算使用哪一个或几个或者不使用索引的成本更低，最后选择的索引就会在key里面出现。 需要注意的一点是，possible keys列中的值并不是越多越好，可能使用的索引越多，查询优化器计算查询成本时就得花费更长时间，所以如果可以的话，尽量删除那些用不到的索引。

##### 8、key_len：索引记录的最大长度

占用字节(编码相关)+2(变长记录)+1(如果null)

MySQL 在执行计划中输出 key_len 列主要是为了让我们区分某个使用联合索引的查询具体用了几个索引列(联合索引有最左前缀的特性，如果联合索引能全部使用上，则是联合索引字段的索引长度之和，这也可以用来判定联合索引是否部分使用，还是全部使用)，而不是为了准确的说明针对某个具体存储引擎存储变长字段的实际长度占用的空间到底是占用 1 个字节还是 2 个字节。

##### 9、rows：扫描行数的预估值

##### 10、filtered：

满足查询条件的行数占预估满足条件的行数rows的百分比

##### 11、Extra：其他

Using index：当我们的查询列表以及搜索条件中只包含属于某个索引的列，也就是在可以使用索引覆盖的情况下，在 Extra 列将会提示该额外信息。

Using filesort：有一些情况下对结果集中的记录进行排序是可以使用到索引的，很多情况下排序操作无法使用到索引，只能在内存中（记录较少的时候）或者磁盘中（记录较多的时候）进行排序，MySQL把这种在内存中或者磁盘上进行排序的方式统称为文件排序(filesort)。如果某个查询需要使用文件排序的方式执行查询，就会在执行计划的Extra列中显示Using filesort。

Using temporary：在许多查询的执行过程中，MySQL 可能会借助临时表来完成一些功能，比如 去重、排序之类的，比如我们在执行许多包含 DISTINCT、GROUP BY、UNION 等子句的查询过程中，如果不能有效利用索引来完成查询，MySQL 很有可能寻求通 过建立内部的临时表来执行查询。如果查询中使用到了内部的临时表，在执行计划的Extra列将会显示Using temporary

Using where：当我们使用全表扫描来执行对某个表的查询，并且该语句的WHERE子句中有针对该表的搜索条件时，在 Extra 列中会显示Using where；当使用索引访问来执行对某个表的查询，并且该语句的 WHERE 子句中有除了该索引包含的列之外的其他搜索条件时，在 Extra 列中也会显示Using where。Using where只是表示 MySQL使用where子句中的条件对记录进行了过滤。

Using join buffer (Block Nested Loop)：在连接查询执行过程中，当被驱动表不能有效的利用索引加快访问速度，MySQL一般会为其分配一块名叫join buffer的内存块来加快查询速度，通过使用join buffer来减少对被驱动表的访问次数，从而提高性能。

Using index condition：如果在查询语句的执行过程中将要使用索引条件下推这个特性，在 Extra 列中将会显示 Using index condition。

[什么是索引下推_古柏树下的博客-CSDN博客_索引下推](https://gubai.blog.csdn.net/article/details/103470244?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2~default~BlogCommendFromBaidu~Rate-1-103470244-blog-124196014.pc_relevant_3mothn_strategy_and_data_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2~default~BlogCommendFromBaidu~Rate-1-103470244-blog-124196014.pc_relevant_3mothn_strategy_and_data_recovery)

Multi-Range Read：优化的目的是为了减少磁盘的随机访问，并且将随机访问转化为较为顺序的数据访问。

[MySQL Multi-Range Read（MRR 索引多范围查找） 原理与解析 - xibuhaohao - 博客园 (cnblogs.com)](https://www.cnblogs.com/xibuhaohao/p/10796113.html)

Zero limit：当LIMIT子句的参数为0时，表示并不打算从表中读出任何记录，将会提示该额外信息。

