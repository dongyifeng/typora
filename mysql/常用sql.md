列

```mysql
# 新增列
alter table search_task_log add column task_id varchar(128) DEFAULT '' COMMENT '任务Id'

# 删除列
alter table search_task_log drop column source;

# 修改列名
alter table search_task_log change iterm_id item_id varchar(128) DEFAULT '' COMMENT '处理主体标识';

# 修改列类型

```



索引

```mysql
# 创建普通索引
alter table search_status_index add index index_status_id_created_at(`status_id`,`status_created_at`,`sharding_id`);

# 唯一索引
alter table table_name add unique (column_list) ;

# 主键索引
alter table table_name add primary key (column_list) ;

# 删除索引
alter table search_status_index drop index index_status_id_created_at;
```

