# 一、背景

搜索系统强依赖于es集群，若es集群出现问题，则会导致搜索90%以上的功能不可用。而随着业务不断增加和需求的不断调整，对生产环境es集群的操作会越来越频繁，并且不可避免，因此存在极大的风险。

# 二、目标

生产环境es集群因意外宕机时，可由rc环境es集群承接线上所有流量，搜索相关功能正常使用。

# 三、开发工作

1. search-index双写开发，通过apollo开关（es_client_switch_key）控制，共5个模式 
   1. 配置"1"，只写prod集群 
   2. 配置"2"，只写rc集群 
   3. 配置"3"，双写prod和rc集群 
   4. 配置"4"，双写prod和rc集群，prod集群基于apollo另一个配置(es_client_write_index_prod),控制prod写哪些索引 
   5. 配置"5"，双写prod和rc集群，rc集群基于apollo另一个配置(es_client_write_index_rc),控制rc写哪些索引 

1. search-sort读es切换开发，通过apollo开关（es_client_read_switch_key）控制 
   1. 配置"1"，只读prod集群 
   2. 配置"2"，只读rc集群 
   3. 配置"3"，根据apollo配置(`es_client_read_index_rc`)索引列表读取rc集群，若不配置，默认全部读prod集群。 

# 四、索引分类

1. 根据是否可以reindex区分： 
   1. 可以reindex的（后文用1.a代表所有此类索引）：cube_v3、funds_v2、privates、live_v1、live_v2、stock_v6、tag_v2、user_v6 
   2. 不可以reindex的（1.b）：interaction0、interaction1、interaction2、interaction3、status_exp、status_v7、status_v12、status_v8、status_long
      1. status rebuild index的需要mysql补全 
      2. interaction索引低峰期访问量小，兜底数据差异可忽略

1. 根据索引大小区分： 
   1. 大索引(2.a)：interaction0、interaction1、interaction2、interaction3、user_v6、status_v7、status_v8、status_v12、status_exp、status_long 
      1. 小索引(2.b)：cube_v3、funds、privates、live_v1、live_v2、stock_ v6、tag_v2 

# 五、操作步骤

### 1、rc同步prod数据

1. search-index上线，开关默认为"1"，和原来保持一样 

1. rc环境创建第三步中的"1.a"（可以reindex）的索引 

1. search-index的apollo配置es_client_write_index_rc添加"1.a"索引 

1. search-index开关切换为"5"，达成部分双写（prod全索引，rc指定索引） 

1. 通过snapshot依次备份prod集群的"1.a"索引 

1. 在rc集群遍历"1.a"索引，依次执行restore，然后reindex 

1. 验证"1.a"索引数据，"1.a"索引数据完成

1. 通过snapshot备份prod集群的"1.b"索引数据 

1. rc集群restore prod集群的快照 

1. search-index的apollo配置es_client_write_index_rc添加刚restore的索引 

1. 通过对应的数据还原方式修复数据 

1. 按照8、9、10、11依次执行"1.b"索引的数据 

1. 验证"1.b"索引数据，"1.b"索引数据完成

1. 自此rc集群数据同步prod集群数据完成

### 2、RC集群兜底验证步骤

1. 该验证可能会影响线上访问，所以验证时间暂定为周六晚22点

1. search-sort开关切换为"3"，默认全部读prod集群，和原来保持一致

1. apollo配置`es_client_read_index_rc`添加status_v7索引，使该索引的读取操作切换为读rc集群（该索引访问qps最高，）

1. 验证功能是否正常，rc集群日志有无报错

1. 逐步切换索引到rc集群，观察有无异常，直至生产流量全部打到rc集群

1. 若无异常，持续观察一段时间，切换开关为"1"，流量全部切换到prod集群

1. 看情况是否需要在流量高峰期再验证一遍

1. 自此验证完毕，可以根据验证结果决定下一步方案

# 三、相关命令

#### 1、备份命令（样例）

```SQL
POST /_snapshot/search_snapshot_new/status_v7_20220824
{
 "indices": "status_v7",
 "ignore_unavailable": true,
 "include_global_state": true
 }'
```

#### 2、还原命令（样例）

```SQL
POST _snapshot/search_snapshot_new/status_v7_20220824/_restore
 {
    "indices":"status_v7",
}
```

