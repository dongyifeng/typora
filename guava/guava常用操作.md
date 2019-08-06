```java
package guava.tool;

import com.google.common.base.*;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.collect.*;
import com.google.common.io.Files;
import org.junit.Assert;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/**
 * Created by dongyifeng on 19/7/11.
 */
public class CollectionDemo {

    // 集合创建
    @Test
    public void create() {
        // 普通Collection 的创建
        List<String> list = Lists.newArrayList();
        Set<String> set = Sets.newHashSet();
        Map<String, String> map = Maps.newHashMap();

        ImmutableList<String> iList = ImmutableList.of("a", "b", "c");
        ImmutableSet<String> iSet = ImmutableSet.of("e1", "e2");
        ImmutableMap<String, String> iMap = ImmutableMap.of("k1", "v1", "k2", "v2");

        System.out.println(iList);
        System.out.println(iSet);
        System.out.println(iMap);
    }

    // 黑科技集合
    @Test
    public void testMulimap() {
        // MultiMap 替换 Map<String,List<Integer>>
        // key - value : key 可以重复
        Multimap<String, Integer> map = ArrayListMultimap.create();
        map.put("aa", 1);
        map.put("aa", 2);

        System.out.println(map.get("aa"));

        // 无序+可重复
        Multiset<String> set = HashMultiset.create();
        set.add("a");
        set.add("a");
        // count 词频
        System.out.println(set.count("a"));

        // 双向Map(Bidirectional Map) 键与值都不能重复
        BiMap<String, String> biMap = HashBiMap.create();
        biMap.put("testA", "Realfighter");
        // 通过put方法存入相同的value值，会抛出异常
        // biMap.put("testB", "Realfighter");
        // 强制传入
        biMap.forcePut("testC", "Realfighter");
        System.out.println(biMap.get("test"));
        System.out.println(biMap.get("testC"));

        // 双键的Map Map--> Table-->rowKey+columnKey+value
        Table<String, String, Integer> tables = HashBasedTable.create();
        tables.put("dong", "yifeng", 1);
        tables.put("dong", "zehao", 2);
        tables.put("zhao", "wenjing", 3);
        System.out.println(tables.get("dong", "yifeng"));
        // ...
    }

    // 将集合装换为字符串
    @Test
    public void testToString() {
        ImmutableList<String> list = ImmutableList.of("a", "b", "c");
        System.out.println(Joiner.on("-").join(list));

        ImmutableMap<String, String> map = ImmutableMap.of("k1", "v1", "k2", "v2");
        System.out.println(Joiner.on(",").withKeyValueSeparator("=").join(map));
    }


    // 字符串将集合装换为
    @Test
    public void testToCollection() {
//        字符串切割,并剔除空格
        String str = "1-2-3-4-  5- 6  ";
        List<String> list1 = Splitter.on("-").omitEmptyStrings().trimResults().splitToList(str);
        System.out.println(list1);

//        String to map
        str = "xiaoming=11,xiaohong=23";
        Map<String, String> map = Splitter.on(",").withKeyValueSeparator("=").split(str);
        System.out.println(map);

//        多字符串分割
        String input = "aa.dd,,ff,,.";
        List<String> list = Splitter.onPattern("[.|,]").omitEmptyStrings().splitToList(input);
        System.out.println(list);
    }

    //
    @Test
    public void testCharMatcher() {
        // 判断匹配结果
        Assert.assertTrue(CharMatcher.inRange('a', 'z').or(CharMatcher.inRange('A', 'Z')).matches('K'));

        // 保留数字
        Assert.assertEquals("123", CharMatcher.digit().retainFrom("abc 123 efg"));

        // 删除数字
        Assert.assertEquals("abc  efg", CharMatcher.digit().removeFrom("abc 123 efg"));
    }

    // set 交集,并集,差集
    @Test
    public void testSet() {
        HashSet setA = Sets.newHashSet(1, 2, 3, 4, 5);
        HashSet setB = Sets.newHashSet(4, 5, 6, 7, 8);

        // 并集
        Assert.assertEquals(Sets.newHashSet(1, 2, 3, 4, 5, 6, 7, 8), Sets.union(setA, setB));

        // 差集
        Assert.assertEquals(Sets.newHashSet(1, 2, 3), Sets.difference(setA, setB));

        // 交集
        Assert.assertEquals(Sets.newHashSet(4, 5), Sets.intersection(setA, setB));
    }

    // map 交集,并集,差集
    @Test
    public void testMap() {
        ImmutableMap<String, String> mapA = ImmutableMap.of("k1", "v1", "k2", "v2");
        ImmutableMap<String, String> mapB = ImmutableMap.of("k2", "v2", "k3", "v3");

        MapDifference<String, String> difference = Maps.difference(mapA, mapB);
        // 差集 mapA - mapB
        System.out.println(difference.entriesOnlyOnLeft());
        // 差集 mapB - mapA
        System.out.println(difference.entriesOnlyOnRight());
        // 交集
        System.out.println(difference.entriesInCommon());

        System.out.println(difference.entriesDiffering());
    }

    // 检查参数
    @Test
    public void testCheckParam() {
        String str = null;

        Assert.assertEquals(true, Strings.isNullOrEmpty(str));

        int count = 1;
        Preconditions.checkArgument(count > 0, "must be positive:%s", count);

        Preconditions.checkNotNull(new Object(), "is not null");

        Preconditions.checkState(true, "用来检查对象的某些状态");

        Preconditions.checkElementIndex(0, 1);

        Preconditions.checkPositionIndex(1, 3, "检查[start, end]表示的位置范围对某个列表、字符串或数组是否有效*");
    }

    // 代码运行时间
    @Test
    public void testStopWatch() throws InterruptedException {
        Stopwatch stopwatch = Stopwatch.createStarted();
        Thread.sleep(1000);
        System.out.println(stopwatch.elapsed(TimeUnit.MILLISECONDS));
    }

    // 文件操作
    @Test
    public void testFile() throws IOException {
        File file = new File("/Users/dongyifeng/test1.py");
        List<String> list = Files.readLines(file, Charsets.UTF_8);
        System.out.println(list);

//        Files.copy(from,to);
//        Files.move(File from, File to);

    }

    // 缓存
    @Test
    public void testChache() throws ExecutionException {

        // CacheLoader
        LoadingCache<String, String> cahceBuilder = CacheBuilder
                .newBuilder()
                .build(new CacheLoader<String, String>() {
                    @Override
                    public String load(String key) throws Exception {
                        String strProValue = "hello " + key + "!";
                        return strProValue;
                    }
                });

        System.out.println(cahceBuilder.apply("begincode"));  //hello begincode!
        System.out.println(cahceBuilder.get("begincode")); //hello begincode!
        System.out.println(cahceBuilder.get("wen")); //hello wen!
        System.out.println(cahceBuilder.apply("wen")); //hello wen!
        System.out.println(cahceBuilder.apply("da"));//hello da!
        cahceBuilder.put("begin", "code");
        System.out.println(cahceBuilder.get("begin"));// code


// callback 方式
        Cache<String, String> cache = CacheBuilder.newBuilder().maximumSize(1000).build();
        String resultVal = cache.get("code", new Callable<String>() {
            public String call() {
                String strProValue = "begin " + "code" + "!";
                return strProValue;
            }
        });
        System.out.println("value : " + resultVal);
    }

    @Test
    public void testMoreObjects() {
        // 该类最大的好处就是不用大量的重写 toString
        Person person = new Person(11);

        String str = MoreObjects.toStringHelper("Person").add("age", person.getAge()).toString();
        System.out.println(str);
    }

    //强大的Ordering排序器
    /*
    natural()  对可排序类型做自然排序，如数字按大小，日期按先后排序
    usingToString()    按对象的字符串形式做字典排序[lexicographical ordering]
    from(Comparator)   把给定的Comparator转化为排序器
    reverse()  获取语义相反的排序器
    nullsFirst()   使用当前排序器，但额外把null值排到最前面。
    nullsLast()    使用当前排序器，但额外把null值排到最后面。
    compound(Comparator)   合成另一个比较器，以处理当前排序器中的相等情况。
    lexicographical()  基于处理类型T的排序器，返回该类型的可迭代对象Iterable<T>的排序器。
    onResultOf(Function)   对集合中元素调用Function，再按返回值用当前排序器排序
*/
    @Test
    public void testOrdering() {
        List<String> list = Lists.newArrayList("peida", "jerry", "harry", "eva", "jhon", "neron");

        Ordering<Object> usingToStringOrdering = Ordering.usingToString();
        Ordering<Object> arbitraryOrdering = Ordering.arbitrary();
        Ordering<String> naturalOrdering = Ordering.natural();


        System.out.println("naturalOrdering:" + naturalOrdering.sortedCopy(list));
        System.out.println("usingToStringOrdering:" + usingToStringOrdering.sortedCopy(list));
        System.out.println("arbitraryOrdering:" + arbitraryOrdering.sortedCopy(list));


        // 例子二
        Ordering<Person> byOrdering = Ordering.natural().nullsFirst().onResultOf(new Function<Person, Integer>() {
            @Override
            public Integer apply(Person s) {
                return s.getAge();
            }
        });


        Person person = new Person(14);
        Person person2 = new Person(13);
        System.out.println(byOrdering.compare(person, person2));
    }
}
```

   