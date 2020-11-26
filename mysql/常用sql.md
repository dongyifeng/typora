Select 

```mysql
create table candelete.cube_stock_id  as
SELECT DISTINCT(stock_id) as stock_id from blizzard.balance_history

# 自动生成行号 row_number() over( ORDER BY c DESC) as id
WITH t as
  (SELECT SOURCE,count(1) AS c
   FROM snowball.status
   GROUP BY SOURCE )
SELECT 
                    SOURCE,
                    row_number() over( ORDER BY c DESC) as id,
                    c
FROM t



case 
when tb1.os = 'android' then 'android'
when tb1.os = 'ios' then 'iPhone'
else 'PC'
end as os



# 综合搜索帖子排序：XGBoost 模型特征
WITH click_t AS
  (SELECT UID,
          log_time,
          default.get_json_object(extend0,'$.input') AS query,
          default.get_json_object(extend0,'$.status_id') AS status_id,
          default.get_json_object(extend0,'$.query_id') AS query_id,
          default.get_json_object(extend0,'$.rank') AS `rank`,
          default.get_json_object(extend0,'$.click_symbol') AS click_symbol
   FROM xueqiu.user_behavior
   WHERE page_id=2200
     AND component_type=1
     AND DAY = 20201115
     AND extend0 LIKE '%query_id%' ),
     show_t AS
  (SELECT CASE
              WHEN (cast(click_t.status_id AS BIGINT) =s.status_id
                    OR s.status_id= cast(click_symbol AS BIGINT)) THEN 1
              ELSE 0
          END AS label,
          s.q,
          s.status_id AS sid,
          default.get_json_object(RESULT,'$.userId') AS `status_user_id`,
          default.get_json_object(RESULT,'$.createdAt') AS t,
          default.get_json_object(RESULT,'$.allSymbolsCharLength') AS `allSymbolsCharLength`,
          default.get_json_object(RESULT,'$.allSymbolsSize') AS `allSymbolsSize`,
          default.get_json_object(RESULT,'$.contentLength') AS `contentLength`,
          default.get_json_object(RESULT,'$.favCount') AS `favCount`,
          default.get_json_object(RESULT,'$.followerCount') AS `followerCount`,
          default.get_json_object(RESULT,'$.likeCount') AS `likeCount`,
          default.get_json_object(RESULT,'$.replyCount') AS `replyCount`,
          default.get_json_object(RESULT,'$.retweetCount') AS `retweetCount`,
          default.get_json_object(RESULT,'$.staticScore') AS `staticScore`,
          default.get_json_object(RESULT,'$.symbolAccessOrder') AS `symbolAccessOrder`,
          default.get_json_object(RESULT,'$.source') AS `source`
   FROM logs.ugc_search_results_display AS s
   INNER JOIN click_t ON cast(click_t.query_id AS BIGINT) =s.query_id
   WHERE ds = '20201115'
     AND s.type=60 ),
     t2 AS
  (SELECT `symbol`,
          show_t.*,
          concat(show_t.status_user_id,"_",`symbol`) AS user_stock
   FROM stock.stock
   INNER JOIN show_t ON show_t.q=name),
     t3 AS
  (SELECT t2.*,
          CASE
              WHEN regexp_like(s.title,t2.q)
                   OR regexp_like(s.title,t2.`symbol`) THEN 1
              ELSE 0
          END AS titleSymbol
   FROM t2
   INNER JOIN snowball.status AS s ON t2.sid=s.id)
SELECT *
FROM t3
LIMIT 10
```



列

```mysql
# 新增列
alter table search_task_log add column task_id varchar(128) DEFAULT '' COMMENT '任务Id'

# 删除列
alter table search_task_log drop column source;

# 修改列名
alter table search_task_log change iterm_id item_id varchar(128) DEFAULT '' COMMENT '处理主体标识';

# 修改列类型
ALTER TABLE bomb_box MODIFY link varchar(1024) NOT NULL DEFAULT '' COMMENT '跳转链接';
```



索引

```mysql
# 创建普通索引
alter table search_status_index add index index_status_id_created_at(`status_id`,`status_created_at`,`sharding_id`);

# 唯一索引
alter table table_name add unique index_name (column_list) ;

# 主键索引
alter table table_name add primary key index_name (column_list) ;

# 删除索引
alter table search_status_index drop index index_status_id_created_at;
```

```sql
show tables like '%ticket%'
```

日期

```mysql
# 
select unix_timestamp('2016-01-02')*1000;  

select from_unixtime(1451997924);  
```

