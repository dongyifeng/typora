这个模块提供了堆队列算法的实现，也称为优先队列算法。



# 初始化堆

1. 一个空列表 + heapq.heappush() 。
2. heapd.heapify(list) 

```python
l = [(1, 0), (1, 1), (1, 2), (4, 3)]
heapq.heapify(l)
print(heapq.nlargest(3, l, key=lambda a: a[0]))
# [(4, 3), (1, 0), (1, 1)]


```



