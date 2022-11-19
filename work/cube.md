# 组合比赛

## redis 

```shell
# 组合标签
./redis_blizzard.sh get "blizzard:cube_tags:2158942"

# 比赛信息
./redis_cube_genius.sh get "cube_genius:game:cube:game_info:11"

# 组合调仓信息


# rpc
./redis_blizzard.sh get "blizzard:rebalancing:symbol:rb_id:68414672"

# 组合最新调仓
./redis_blizzard.sh get "blizzard:lastRebalancing:cube_id:969111"


```







计算组合收益：指定时间段

```mysql
WITH t1 AS
  (SELECT `symbol`,
          name,
          CLOSE,
          c.created_at
   FROM blizzard.nav_daily n
   INNER JOIN blizzard.cube c ON n.cube_id = c.id
   WHERE n.time ='2019-12-31'
     AND c.truncated = 0
     AND c.market='cn'
     AND c.closed_at IS NULL),
     t2 AS
  (SELECT `symbol`,
          name,
          CLOSE
   FROM blizzard.nav_daily n
   INNER JOIN blizzard.cube c ON n.cube_id = c.id
   WHERE n.time ='2018-12-28'
     AND c.truncated = 0
     AND c.market='cn'
     AND c.closed_at IS NULL ),
     t3 as
  (SELECT t1.`symbol`,t1.name,CASE
                                  WHEN t2.CLOSE IS NULL THEN 100*(t1.CLOSE-1)
                                  ELSE 100*(t1.CLOSE-t2.CLOSE)/t2.CLOSE
                              END profit,t1.CLOSE AS start_nav,t2.CLOSE AS end_nav
   FROM t1
   LEFT JOIN t2 ON t1.`symbol` = t2.`symbol`)
SELECT *
FROM t3
ORDER BY profit DESC
LIMIT 50
```



查询用户调仓

```shell
ssh 10.10.54.2

grep "cubes/rebalancing/create.json" */logs/http_access.log-20200226* | grep "6416922094"
```





慢SQL 

```shell
grep -A1 "ERROR" mysql.log |sed 's/slow sql //g'| sed 's/ millis.//'  | awk -F"|" '{if(match($0,"ERROR")){ a= $5  }else{OFS="\t"; print a,$0 }}'  | grep -v '-' | sort -k1rn | more
```

