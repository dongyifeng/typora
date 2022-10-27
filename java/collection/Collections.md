常用方法

- reverse( list )：翻转 List 中元素的顺序。
- shuffle( list )：对 List 集合元素进行随机排序。
- sort( list )：升序。
- sort( list, Comparator )
- swap(list, int, int)：交换下标为 i 和 j 的元素。
- Object max( Collection )：获取最大元素
- Object max( Collection, Comparator )：
- Object min( Collection )：获取最小元素
- int frequency( Collection, Object )：获取集合中某个元素出现的频次。
- void copy (List dest, List src )：将 src 中元素复制到 dest 中
- boolean replaceAll( List list,Object oldVal, Object newVal )：

==注意：==

```java
List source = new ArrayList();
source.add(1);
source.add(2);
source.add(3);
source.add(4);

// 错误写法
// 报错：因为 Collections.copy( dest, source)，dest.size() 必须大于等于 source.size()
List dest = new ArrayList();
Collections.copy(dest, source);

// 正确写法：将 dest 中空间撑开。
List dest = new ArrayList(new Object[list.size()]);
```



```java
// list1 为线程安全的 List。
List list1 = Collections.synchronizedList(list);
```

