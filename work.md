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



hbase

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

