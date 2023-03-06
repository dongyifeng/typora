```sql
Create Table
CREATE TABLE `t_search_sugg` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增长主键',
`type` int(2) NOT NULL DEFAULT '0' COMMENT '类型：1-股票',
`symbol` varchar(32) NOT NULL COMMENT '股票',
`query` varchar(256) NOT NULL DEFAULT '' COMMENT '搜索关键字',
`weight` int(11) NOT NULL DEFAULT '0' COMMENT '权重：粉丝数',
`nicknames` text NOT NULL COMMENT '字符串数组',
`state` int(2) NOT NULL DEFAULT '0' COMMENT '1:删除',
`ext` varchar(2048) NOT NULL DEFAULT '' COMMENT '扩展字段',
`stock_status` int(11) NOT NULL DEFAULT '-1' COMMENT '股票状态',
`created_at` bigint(20) NOT NULL DEFAULT '0' COMMENT '创建时间',
`updated_at` bigint(20) NOT NULL DEFAULT '0' COMMENT '编辑时间',
`spell` varchar(2048) DEFAULT NULL COMMENT '拼音缩写',
`parent` varchar(100) DEFAULT '' COMMENT '父symbol',
`sw` varchar(100) DEFAULT '' COMMENT '搜索词',
`fund_ext` varchar(1024) NOT NULL DEFAULT '' COMMENT '蛋卷信息扩展字段',
`auto_nicknames` text COMMENT '自动生成的昵称',
`stock_names` varchar(2048) DEFAULT '' COMMENT '股票名称',
PRIMARY KEY (`id`),
UNIQUE KEY `symbol` (`symbol`),
KEY `idx_symbol` (`symbol`)
) ENGINE = InnoDB AUTO_INCREMENT = 8603560 DEFAULT CHARSET = utf8 COMMENT = '搜索sugg表'
```



```sql
CREATE TABLE `search_status_index` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID',
`user_id` bigint(20) DEFAULT '0' COMMENT '用户id',
`status_id` bigint(20) DEFAULT '0' COMMENT '帖子id',
`state` tinyint(4) DEFAULT '0' COMMENT '索引重建状态，0：未创建索引，1：创建索引',
`data` varchar(8192) DEFAULT '' COMMENT '帖子除content外的其它内容',
`msg` varchar(2048) DEFAULT '' COMMENT '消息实体',
`created_at` bigint(20) DEFAULT '0' COMMENT '创建时间戳',
`status_created_at` bigint(20) DEFAULT '0' COMMENT '帖子创建时间戳',
`op_type` tinyint(4) DEFAULT '0' COMMENT '操作类型，1：更新索引，2：删除索引',
`sharding_id` int(11) DEFAULT '0' COMMENT '分片_id：0,1,2,3,4,5,6,7,8,9',
PRIMARY KEY (`id`),
KEY `index_status_id_created_at` (`status_id`, `status_created_at`, `sharding_id`),
KEY `index_user_id` (`user_id`),
KEY `index_created_at_state` (`created_at`, `state`)
) ENGINE = InnoDB AUTO_INCREMENT = 704154402 DEFAULT CHARSET = utf8 COMMENT = '用户帖子总数统计表'
```



```sql
CREATE TABLE `sug_log` (
`id` int(12) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增长主键',
`item` varchar(100) NOT NULL COMMENT 'sug 数据项',
`type` int(4) DEFAULT NULL COMMENT 'sug 数据类型',
`insert_nick_names` varchar(5120) NOT NULL DEFAULT '' COMMENT '新增nickName',
`delete_nick_names` varchar(5120) NOT NULL DEFAULT '' COMMENT '删除nickName',
`create_time` int(12) NOT NULL COMMENT '时间戳',
`update_time` int(12) NOT NULL COMMENT '时间戳',
`trace_id` varchar(200) DEFAULT NULL COMMENT 'trace_id',
PRIMARY KEY (`id`),
KEY `idx_log_created_at` (`create_time`)
) ENGINE = InnoDB AUTO_INCREMENT = 1113756 DEFAULT CHARSET = utf8 COMMENT = 'sug 更新日志表'
```



```sql
CREATE TABLE `mirror_compare` (
`id` bigint(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`uri` varchar(255) DEFAULT NULL COMMENT '请求地址',
`params` text COMMENT '请求参数',
`is_same` int(3) DEFAULT NULL COMMENT '是否一致',
`source_result` text COMMENT '原始返回',
`mirror_result` text COMMENT '镜像返回',
`env` varchar(50) DEFAULT NULL COMMENT '所处环境',
`create_time` datetime DEFAULT NULL COMMENT '创建时间',
`same_rate` varchar(50) DEFAULT NULL COMMENT '一致率',
PRIMARY KEY (`id`),
KEY `idx_uri` (`uri`) USING BTREE,
KEY `idx_create_time` (`create_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4301264 DEFAULT CHARSET = utf8 COMMENT = '镜像对比结果'
```

