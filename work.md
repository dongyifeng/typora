[TOC]



# VIM

```shell
# vim 编辑器，拷贝数据格式错乱
:set paste
```





# Java

java list 删除元素

```java
        List<String> list = new ArrayList<>();
        list.add("a");
        list.add("b");
        list.add("c");

        for (int i = 0; i < list.size(); i++) {
            String term = list.get(i);
            if (term.equalsIgnoreCase("b")) {
                list.remove(i);
            }
        }
        System.out.println(list);
```



# Shell

## hbase

```shell
hbase shell

# 组合评级
get "partition_scoreType_cubeSymbol","002_cubeRankType_ZH2009315"
```



Java Http 请求添加版本号。

```java
            Map<String, String> header = new HashMap<>();
            header.put("User-Agent", "Xueqiu iPhone 12.0");
            final String json = HttpUtil.httpClientGet(url, header);
```

Java group_by 后，将List<Map> 转为List<String>

```java
        List<Map> result = new ArrayList<>();
        result.add(ImmutableMap.of("stock", "1", "query", "query_1"));
        result.add(ImmutableMap.of("stock", "1", "query", "query_2"));
        result.add(ImmutableMap.of("stock", "2", "query", "query_2_1"));
        result.add(ImmutableMap.of("stock", "2", "query", "query_2_2"));


        final Map<String, List<String>> collect = result.stream().collect(Collectors.groupingBy((x) -> x.get("stock").toString(), Collectors.mapping(x -> x.get("query").toString(), Collectors.toList())));

        System.out.println(collect);
```

直接kill java 进程，程序不会进入catch 和 finally 中。

```java
        try {
            System.out.println("start");
            Thread.sleep(1000 * 60);
        } catch (Exception e) {
            System.out.println("catch");
        } finally {
            System.out.println("finally");
        }
        System.out.println("over");
```

```shell
# 解压
tar -zxvf apache-zookeeper-3.5.6-bin.tar.gz
```

**list 多字段排序**

```java
  List<HotRankStatusDto> data = hotRankStatus.stream()
                .sorted(Comparator.comparing(HotRankStatusDto::getReplyCount).reversed()
                        .thenComparing(HotRankStatusDto::getCreatedAt).reversed())
                .collect(Collectors.toList());
```

# Impala

正则扣数据

```mysql
WITH t1 AS
  (SELECT REGEXP_EXTRACT(extend0,'click_tab_id":"?([^,"|}]+)',1) AS tab
  FROM xueqiu.user_behavior
  WHERE `day`=20191121
     AND page_id=2200
     AND component_type=1
     AND REGEXP_EXTRACT(extend0,'click_area":"?([^,"|}]+)',1) ='股票' )
SELECT tab,
      count(1) AS c
FROM t1
GROUP BY tab
```

