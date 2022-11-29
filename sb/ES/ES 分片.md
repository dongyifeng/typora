ES 分片

## 背景：

interaction相关有4个索引，且数据量非常庞大，目前每个索引有1个分片，若数据量太大时，会影响索引的读写速度。考虑对interaction索引进行分片

## 目标：

将现有索引拆分为具有更多主分片的新索引

## 现状：

线上索引的 number_of_routing_shards 参数不允许修改，number_of_routing_shards 大小需要是新分片数的N倍，目前线上number_of_routing_shards数与number_of_shards一致，直接分片方案不可行。

## 步骤：

先决条件：

- 索引必须是只读的
- 集群运行状况必须是green

1、修改number_of_routing_shards

- 关闭索引

POST /index/_close

- 执行setting命令

PUT /cube_v4/_settings

{

  "settings":{

​    "index.number_of_routing_shards":30

  }

}

2、关闭索引的写操作

PUT /cube_v4/_settings

{

  "settings":{

​    "index.blocks.write":true

  }

}

3、执行分片操作

POST /cube_v4/_split/cube_v4_split

{

  "settings":

  {

​    "index.number_of_shards":15

  }

}