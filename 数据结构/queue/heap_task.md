[TOC]

# 堆的应用

## 优先级队列

优先级队列：按优先级出队，优先级高，最先出队。

实现有优先级队列方法很多。使用堆实现，最直接，最高效。因为一个堆就可以看做一个优先级队列。往优先级队列中插入一个元素，就相当于往堆中插入一个元素；从优先级队列中取出优先级最高的元素，就相当于取出堆顶元素。



优先级队列应用场景

1. 赫夫曼编码
2. 图的最短路径
3. 最小生成树

Java 中优先级队列：ProrityQueue

### 合并有序小文件

问题：假设我们有 100 个小文件，每个文件的大小是 100MB，每个文件中存储的都是有序的字符串。我们希望将这些 100 个小文件合并成一个有序的大文件。这里就会用到优先级队列。



思路：像归并排序中的合并函数。我们从这 100 个文件中，各取第一个字符串，放入数组中，然后比较大小，把最小的那个字符串放入合并后的大文件中，并从数组中删除。



### 高性能定时器



## 求 Top K

## 静态数据集求 Top K

问题：n 个数据的数组中，查找前 k 大数据。

分析：维护一个大小为 K 的 小顶堆，顺序遍历数组，从数组中取出的数据与堆顶元素比较，如果比堆顶元素大，则删除堆顶元素，并且插入这个元素。如果比堆顶元素小，则不做处理。遍历完毕后，堆中的元素就是前 K 大数据。

```python

```

时间复杂度分析：遍历数据需要 O(n)，一次堆化需要：O(log k)，最坏的情况，n 个元素都需要堆化：O(n log k)

## 动态数据集求 Top k

问题：实时求 Top K，一个数据集合有两个操作，一个是添加数据，另一个询问当前的前 k 大数据。

分析：维护一个大小为 K 的 小顶堆，当有数据被添加到集合时，就拿它与堆顶元素对比，如果比堆顶元素大，则删除堆顶元素，并且插入这个元素。如果比堆顶元素小，则不做处理。无论何时查询当前的前 K 大数据，都返回堆。

## 求中位数

中位数：

- n 为奇数，$\frac{n}{2}+1$ 为中位数。
- n 为偶数，$\frac{a[\frac{n}{2}]+a[\frac{n}{2}+1]}{2} $ 为中位数

静态数据，只需要一次排序，每次访问中位数时，直接返回。

动态数据，中位数不断在变。

