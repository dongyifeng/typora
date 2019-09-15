[TOC]

# List 接口

## ArrayList

ArrayList 是 List 接口的典型实现类。本质上是一个==“变长”数组==。

- JDK1.7：ArrayList 像饿汉式，初始化是创建容量位置 10 的数组。
- JDK1.8：ArrayList 像懒汉式，初始化是创建容量位置 0 的数组，当第一个元素添加时，再扩容到10.

Arrays.asList(…)：返回既不是 ArrayList 也不是 Vector 而是一个==固定长度==的 List 集合。

## LinkedList

LinkedList : ==双向链表==

使用场景：频繁的插入或者删除元素。



常用方法：

1. void addFirst(Object obj)
2. void addLast(Object obj)
3. Object getFirst()
4. Object getLast()
5. Object removeFirst()
6. Object removeLast()

## Vector

大多数操作与 ArrayList 相同。区别：==Vector 是线程安全的==。比 ArrayList 慢，避免使用。



# Set 接口

- 不重复。
- 使用 equals() 判断两个对象是否相等

## HashSet

Set 接口的典型实现。

特点：

1. 不能保证元素的顺序。
2. 不是线程安全的
3. 集合元素可以是 null

