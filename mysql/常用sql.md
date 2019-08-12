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

