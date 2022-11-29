# 审核规则引擎数据库表

-- 特征 select * from rules_feature ;

```SQL
CREATE TABLE `rules_feature` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`name` varchar(50) NOT NULL COMMENT '特征名称',
`dimension` tinyint(255) NOT NULL COMMENT '维度，标记特征用于用户、帖子，上游输入',
`cls` varchar(100) NOT NULL COMMENT '特征实现类',
`category` tinyint(1) DEFAULT '1' COMMENT '类别 1 bean 2 upstream',
`version` bigint(20) NOT NULL COMMENT '版本',
`state` tinyint(1) NOT NULL COMMENT '2 启用 1 待启用 0 停用 只有当特征集中都不存在时方可停用',
`created_at` bigint(20) NOT NULL COMMENT '创建时间',
`feature_path` varchar(255) NOT NULL COMMENT '输出变量名',
`remark` varchar(255) DEFAULT NULL COMMENT '备注',
PRIMARY KEY (`id`),
KEY `idx_cls_version` (`cls`, `version`),
KEY `idx_scenes_code` (`scenes_code`)
) ENGINE = InnoDB AUTO_INCREMENT = 128 DEFAULT CHARSET = utf8 COMMENT = '特征配置'
```

![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=MTg5M2EzNWQxNjBiODc3ZWY1YTE2ODg2NWUyZTRhOTdfQWcxMGpsZ2VUdTM0ejBpQzZVeEtrbUhSWU5KSVhKSTZfVG9rZW46Ym94Y24xZHV4VmNsTlpPWm5TaTZiRjh4cDFxXzE2NjkxNjg3ODA6MTY2OTE3MjM4MF9WNA)

-- 特征变量 select * from rules_feature_variable ;

```SQL
CREATE TABLE `rules_feature_variable` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`feature_id` bigint(20) DEFAULT NULL COMMENT '特征id',
`name` varchar(100) DEFAULT NULL COMMENT '变量名称',
`code` varchar(100) DEFAULT NULL COMMENT '变量代码',
`type` varchar(255) DEFAULT NULL COMMENT '变量类型，包括数组(备注字段会标记原始数据类型)，不支持范型，',
`remark` varchar(255) DEFAULT NULL COMMENT '备注',
`created_time` bigint(20) DEFAULT NULL COMMENT '创建时间',
PRIMARY KEY (`id`),
UNIQUE KEY `uniq_feature_id_code` (`feature_id`, `code`)
) ENGINE = InnoDB AUTO_INCREMENT = 589 DEFAULT CHARSET = utf8mb4 COMMENT = '特征输出变量'
```

![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=OTg5YTlmZGVkMmQ3ZjNlOGRjMjRhMDcxMDhiOWRhYWNfUWRMQkw2dWlWSlpYZW53Nk1QdnNpSzZKU2dZWjlzTGFfVG9rZW46Ym94Y25uRUxqUDZUdGxBdk82bW1ZOWVJQXFkXzE2NjkxNjg3ODA6MTY2OTE3MjM4MF9WNA)

-- 特征集 select * from rules_feature_set ;

```SQL
CREATE TABLE `rules_feature_set` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`name` varchar(50) DEFAULT NULL COMMENT '特征集名称',
`state` tinyint(1) DEFAULT NULL COMMENT '0 停用 1 可用 \n已经在用的特征集不能停用，配置时从可用的状态列表中选择',
`remark` varchar(255) DEFAULT NULL COMMENT '备注',
`created_at` bigint(20) DEFAULT NULL COMMENT '创建时间',
`created_user_id` bigint(20) DEFAULT NULL COMMENT '操作员',
PRIMARY KEY (`id`) USING BTREE,
KEY `idx_name` (`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 104 DEFAULT CHARSET = utf8 COMMENT = '特征集配置'
```

![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=NDVjYjIzYzYyZDJmZjY0YjQ5NzRhZDU2MjY0MWRkMTFfT0FNSERNZEpYUFY5Qjk0Q2gxZEtPSzFPdWRIYWtGNVdfVG9rZW46Ym94Y255eEtMbWxNeE1FUnJuQm92dXVYZEdiXzE2NjkxNjg3ODA6MTY2OTE3MjM4MF9WNA)

-- 策略和特征集的关联 select * from rules_feature_set_strategy_detail ;

```SQL
CREATE TABLE `rules_feature_set_strategy_detail` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`feature_set_id` bigint(20) NOT NULL COMMENT '特征集id',
`strategy_id` bigint(20) DEFAULT NULL COMMENT '策略id',
`created_at` bigint(20) DEFAULT NULL COMMENT '创建时间',
`created_user_id` bigint(20) DEFAULT NULL COMMENT '操作员',
PRIMARY KEY (`id`) USING BTREE,
KEY `idx_feature_set_id` (`feature_set_id`) USING BTREE,
KEY `idx_strategy_id` (`strategy_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 134 DEFAULT CHARSET = utf8 COMMENT = '特征集和策略的关联'
```

-- 特征集和特征的关联 select * from rules_feature_set_detail ;

```SQL
CREATE TABLE `rules_feature_set_detail` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`feature_set_id` bigint(20) NOT NULL COMMENT '特征集id',
`feature_id` bigint(20) DEFAULT NULL COMMENT '特征id',
`state` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 启用 0停用',
`created_at` bigint(20) DEFAULT NULL COMMENT '创建时间',
`created_user_id` bigint(20) DEFAULT NULL COMMENT '操作员',
PRIMARY KEY (`id`) USING BTREE,
KEY `idx_feature_set_id` (`feature_set_id`) USING BTREE,
KEY `idx_feature_id` (`feature_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 134 DEFAULT CHARSET = utf8 COMMENT = '特征集详情配置'
```

![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=ZmM1NjQ1N2I5NjFlMDBlNWM0MzhjMWQ2NmY0M2UzNjhfd0tvRmQ4TkpRRXN5RUtmZWNSMGE1SkdQTUc1VTEyb1lfVG9rZW46Ym94Y25qTFNwMzRQOXhwTXA5YWlXUVFyVlZmXzE2NjkxNjg3ODA6MTY2OTE3MjM4MF9WNA)

-- 常量，函数变量表 select * from rules_variable ;

```SQL
CREATE TABLE `rules_variable` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`name` varchar(50) NOT NULL COMMENT '变量名称',
`code` varchar(50) NOT NULL COMMENT '变量编码',
`category` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '类别,1 常量 2 变量',
`type` varchar(100) DEFAULT NULL COMMENT '数据类型，java中的数据类型',
`val` text COMMENT '常量值，基本数据类型，list,map 使用json表示',
`remark` varchar(255) DEFAULT NULL COMMENT '备注',
`update_time` bigint(20) DEFAULT NULL COMMENT '更新时间',
`created_user_id` bigint(20) DEFAULT NULL COMMENT '创建人',
`created_at` bigint(20) DEFAULT NULL COMMENT '创建时间',
PRIMARY KEY (`id`),
UNIQUE KEY `idx_code` (`code`) USING BTREE,
KEY `idx_name` (`name`) USING BTREE,
KEY `idx_update_time` (`update_time`)
) ENGINE = InnoDB AUTO_INCREMENT = 32 DEFAULT CHARSET = utf8 COMMENT = '常量与函数变量配置表'
```

![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=MjQ0NGJjNzI3MWNlNmMxYjhmYjJiM2ZhYzEwNDVhNTRfMVRBeHltTmpTYWx6OHBBYmFNTWQybUJjSjRuNGp1ODVfVG9rZW46Ym94Y25PSEU1U1Z6T2lxY0o4VnB1cmVUQnZkXzE2NjkxNjg3ODA6MTY2OTE3MjM4MF9WNA)

-- 策略 select * from rules_strategy;

```SQL
CREATE TABLE `rules_strategy` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`name` varchar(50) DEFAULT NULL COMMENT '策略名称',
`code` varchar(50) NOT NULL COMMENT '策略编码',
`expression` text COMMENT '条件表达式',
`state` tinyint(1) DEFAULT NULL COMMENT '0 停用 1正常',
`return_type` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '返回类型',
`version` bigint(20) DEFAULT NULL COMMENT '版本',
`created_user_id` bigint(20) DEFAULT NULL COMMENT '创建人',
`created_at` bigint(20) DEFAULT NULL COMMENT '创建时间',
`remark` varchar(255) DEFAULT NULL COMMENT '备注',
PRIMARY KEY (`id`) USING BTREE,
KEY `idx_name` (`name`) USING BTREE,
KEY `idx_scenes_code` (`scenes_code`)
) ENGINE = InnoDB AUTO_INCREMENT = 1100092 DEFAULT CHARSET = utf8 COMMENT = '策略配置'
```

![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=YjhkMDlhMTFhNTdhNDBmMDg4NmM2ZDFlYmRjOGFjMjFfWG5NYk1MQ21jS1U4b1BtMzM3a2o4MDJmU1N3TXRLejFfVG9rZW46Ym94Y250cXljSUE0MkdkY3RvMEZtOTVpWVhiXzE2NjkxNjg3ODA6MTY2OTE3MjM4MF9WNA)

-- 策略集 select * from rules_strategy_set;

```SQL
CREATE TABLE `rules_strategy_set` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`code` varchar(100) DEFAULT NULL COMMENT '策略集编码',
`name` varchar(50) DEFAULT NULL COMMENT '策略集名称',
`rules_node_id` bigint(20) NOT NULL COMMENT '规则节点id',
`mode` tinyint(1) DEFAULT NULL COMMENT '执行模式 \n1 串行\n2 并行\n',
`state` tinyint(1) DEFAULT NULL COMMENT '0 停用 1 可用 ',
`version` bigint(20) DEFAULT NULL COMMENT '版本号',
`created_user_id` bigint(20) DEFAULT NULL COMMENT '创建人',
`created_at` bigint(20) DEFAULT NULL COMMENT '创建时间',
`update_time` bigint(20) DEFAULT NULL COMMENT '更新时间',
`remark` varchar(255) DEFAULT NULL COMMENT '备注',
PRIMARY KEY (`id`) USING BTREE,
KEY `idx_name` (`name`) USING BTREE,
KEY `idx_code_version` (`version`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 70 DEFAULT CHARSET = utf8 COMMENT = '策略集配置'
```

![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=NzgyMTBhNjcxZTA1OWYzNmM3OTBlYmJhYjg1ZDkwNWJfNG15V290ZXY1WHBDaG9WZ2NEMmZBU0Q5a2ZGcTVkZjZfVG9rZW46Ym94Y25nZE1hS2NSTjAxc0xVZjl0MU1XZDFjXzE2NjkxNjg3ODA6MTY2OTE3MjM4MF9WNA)

-- 策略集和策略的绑定 select * from rules_strategy_set_detail;

```SQL
CREATE TABLE `rules_strategy_set_detail` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`strategy_set_id` bigint(20) NOT NULL COMMENT '策略集id',
`strategy_id` bigint(20) NOT NULL COMMENT '策略id',
`state` tinyint(1) DEFAULT '1' COMMENT '0 废弃 1 可用',
`version` bigint(20) DEFAULT NULL COMMENT '版本',
`created_at` bigint(20) unsigned NOT NULL COMMENT '创建时间',
`created_user_id` bigint(20) unsigned DEFAULT NULL COMMENT '操作员',
PRIMARY KEY (`id`) USING BTREE,
KEY `idx_strategy_id` (`strategy_id`),
KEY `idx_strategy_set_id` (`strategy_set_id`, `strategy_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 254 DEFAULT CHARSET = utf8 COMMENT = '策略集详情配置'
```

![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=Y2M0MTQ2NjM1YjZlMjRlMGFmN2JhNThmNzVlYWMzOWRfR1IzbkxQWmpJdU9YRnROTERCSEZDV3dPZ1JpTEJqMkNfVG9rZW46Ym94Y25Vbzdzbkw4M3YwSTV6dFpvNTNSckFkXzE2NjkxNjg3ODA6MTY2OTE3MjM4MF9WNA)

-- 规则节点 select * from rules_node;

```SQL
CREATE TABLE `rules_node` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`name` varchar(100) NOT NULL COMMENT '名称',
`state` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0 删除 1 可用',
`create_time` datetime NOT NULL COMMENT '创建时间',
`update_time` datetime DEFAULT NULL COMMENT '更新时间',
`created_user_id` bigint(20) NOT NULL COMMENT '操作员',
`remark` varchar(255) DEFAULT NULL COMMENT '备注',
PRIMARY KEY (`id`) USING BTREE,
KEY `idx_feature_set_id` (`feature_set_id`),
KEY `idx_strategy_set_inst_code` (`strategy_set_inst_code`)
) ENGINE = InnoDB AUTO_INCREMENT = 126 DEFAULT CHARSET = utf8 COMMENT = '规则流节点配置'
```

![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjBmZGVmNmViOTYwOTkwZDY2MTYxNTkyNDQ1MTJiMjVfeHhtd0xFcG5tS2JvVHI4NjhBZnI3bzZVQmNzV2ZzekFfVG9rZW46Ym94Y25HRlZYUkFjamFZSjJCMkZnZ2tDRVJmXzE2NjkxNjg3ODA6MTY2OTE3MjM4MF9WNA)

-- 规则流 select * from rules_flow;

```SQL
CREATE TABLE `rules_flow` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`code` varchar(100) DEFAULT NULL COMMENT '规则流code',
`name` varchar(100) DEFAULT NULL COMMENT '规则流名称',
`version` bigint(20) DEFAULT NULL COMMENT '版本',
`state` tinyint(1) DEFAULT NULL COMMENT '0 停用 1 可用 ',
`created_user_id` bigint(20) DEFAULT NULL COMMENT '操作员',
`created_at` bigint(20) DEFAULT NULL COMMENT '创建时间',
`update_time` bigint(20) DEFAULT NULL COMMENT '更新时间',
`remark` varchar(255) DEFAULT NULL COMMENT '备注',
PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8 COMMENT = '规则流'
```

![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=MzI3YWQ5ZjlmZjljMGQ0M2RkMDc5YmNiMDgzMmY5NTFfaHFLcERhUXhhQ1pyMUxydnVMR0hWdVBOSUtmakFRNzNfVG9rZW46Ym94Y25LTmZLUThDbXA4a1IyQjhXaXFYUnBmXzE2NjkxNjg3ODA6MTY2OTE3MjM4MF9WNA)

-- 规则流详情（包括规则节点的顺序,有上级节点串行，无上级节点并行） select * from rules_flow_detail;

```SQL
CREATE TABLE `rules_flow_detail` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`flow_id` bigint(20) NOT NULL COMMENT '规则流id',
`rule_node_id` bigint(20) unsigned NOT NULL COMMENT '规则节点id',
`parent_rule_node_id` bigint(20) unsigned DEFAULT NULL COMMENT '上级节点id',
`state` tinyint(1) DEFAULT '1' COMMENT '0 删除 1 可用',
`version` bigint(20) DEFAULT NULL COMMENT '版本',
`create_time` datetime DEFAULT NULL COMMENT '创建时间',
`update_time` datetime DEFAULT NULL COMMENT '更新时间',
PRIMARY KEY (`id`),
KEY `idx_flow_id` (`flow_id`) USING BTREE,
KEY `idx_rule_node_id` (`rule_node_id`) USING BTREE,
KEY `idx_parent_rule_node_id` (`parent_rule_node_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5040 DEFAULT CHARSET = utf8 COMMENT = '规则流详情配置'
```

![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=MzRlOWQzMzljZTUxOTNkMzkxNjQ5MmU0MzNhNDJkYjFfTVM3MW1yeUhvelpkVkJYMEtPeFBPek9WRmdvdTFieXFfVG9rZW46Ym94Y25Xd3A5U25seTNoWjhDdGFWbHE5cldlXzE2NjkxNjg3ODA6MTY2OTE3MjM4MF9WNA)

-- 出参自定义 select * from rules_custom_output;

```SQL
CREATE TABLE `rules_custom_output` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
`flow_id` bigint(20) NOT NULL COMMENT '规则流id',
`output_format` varchar(500) DEFAULT NULL COMMENT  '输出格式',
`version` bigint(20) DEFAULT NULL COMMENT '版本',
`create_time` datetime DEFAULT NULL COMMENT '创建时间',
`update_time` datetime DEFAULT NULL COMMENT '更新时间',
PRIMARY KEY (`id`),
KEY `idx_flow_id` (`flow_id`) USING BTREE,
) ENGINE = InnoDB AUTO_INCREMENT = 5040 DEFAULT CHARSET = utf8 COMMENT = '规则流详情配置'
```

输出格式：

```undefined
{"score1":"策略id1","score2":"策略id2"}
```

