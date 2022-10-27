[TOC]

# group by

## case 1：将10分数据，根据jobs ( 0,10] 划分给不同机器。

输入：jobs = 5  

输出：[[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]]

方案一：

```java
    public List<List<Integer>> sharding(int jobs) {
 				if (jobs <= 0 || jobs > MAX_SHARDING) {
            jobs = MAX_SHARDING;
        }
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < jobs; i++) {
            result.add(new ArrayList<>());
        }

        for (int i = 0; i < MAX_SHARDING; i++) {
            result.get(i % jobs).add(i);
        }
        return result;
    }
```

```java
    public static Collection<List<Integer>> sharding(int jobs) {
        if (jobs <= 0 || jobs > MAX_SHARDING) {
            jobs = MAX_SHARDING;
        }
        List<Integer> list = IntStream.range(0, MAX_SHARDING).boxed().collect(Collectors.toList());
        int finalJobs = jobs;
        return list.stream().collect(Collectors.groupingBy(sharding -> sharding % finalJobs)).values();
    }
```

