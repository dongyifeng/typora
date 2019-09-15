[TOC]

# python heapq 模块

- heap = [] #创建了一个空堆 
- heappush(heap,item) #往堆中插入一条新的值 
- item = heappop(heap) #从堆中弹出最小值 
- item = heap[0] #查看堆中最小值，不弹出 
- heapify(x) #以线性时间讲一个列表转化为堆 
- heapreplace(heap, x)：将堆中最小元素弹出，并将元素x 入堆
- heappushpop(heap, item)：将item 入堆，然后弹出并返回堆中最小的元素。
- nlargest(n, iterable, key=None)：返回堆中最大的 n 个元素。
- nsmallest(n, iterable, key=None)：返回堆中最小的 n 个元素。

```python
import heapq

heap = [(3,"c"),(1,"a"),(2,"b"),(6,"f"),(5,"e")]
# 构建最小堆
heapq.heapify(heap)
# 或者
for n,s in heap:
  heapq.heappush(heap, (n,s))

# 从堆中弹出最小值
heapq.heappop(heap)

# 堆排序
def heapsort(iterable):
    h = []
    for value in iterable:
        heapq.heappush(h,value) #[0, 1, 2, 6, 3, 5, 4, 7, 8, 9]
    return [heapq.heappop(h) for i in range(len(h))]

def HeapSort(list):
    # 将 list 构建成堆
    heapq.heapify(list)
    heap = []
    while list:
        heap.append(heapq.heappop(lists))
    list[:] = heap
    return list
```

# python PriorityQueue 模块

PriorityQueue 使用的就是 heapq 来实现的，所以可以认为两者算法本质上是一样的。当然PriorityQueue考虑到了线程安全的问题。 

## 常用方法

```python
from Queue import PriorityQueue
q = PriorityQueue()
# 向队列中添加元素
# 默认：block=True, timeout=None：阻塞调用，无超时
# block=True, timeout > 0 : 阻塞调用进程最多timeout秒,如果一直无空空间可用，抛出Full异常
# block=False, 如果有空闲空间可用将数据放入队列，否则立即抛出Full异常。
q.put(item[,block[,timeout]])
# 从队列中获取元素
q.get([block[,timeout]])
# 队列判空
q.empty()
# 队列大小
q.qsize()
```

```python
from Queue import PriorityQueue

q = PriorityQueue()
q.put(1)
q.put(5)
q.put(4)
q.put(3)

while True:
    print q.get()
    q.task_done()
```

