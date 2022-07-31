[TOC]

![图](../image/20200119141628.jpg)

无向图

- 顶点 ( vertex )
- 边 ( edge )
- 度 （degree）：顶点相连边的条数。

有向图

- 入度（In-degree）：有多少边指向顶点。
- 出度（Out-degree）:顶点有多少边指出去。

带权图（weighted graph）



图这种数据结构的表达能力很强。

# 图的存储

## 邻接矩阵

![](../image/20200119141811.jpg)

邻接矩阵（Adjacency Matrix）底层是一个二维数组。

无向图：顶点 i 与 顶点 j 之间的边 $adj[i][j] = abj[j][i] = 1$

有向图：顶点 i 指向 顶点 j 之间的边$adj[i][j] = 1$

带权图：顶点 i 指向 顶点 j 之间的边，权重为 w：$adj[i][j] = w$



优点：简单，直观，高效，便于矩阵运算。

缺点：浪费存储空间。无线图：浪费一半的空间。稀疏图（Sparse Matrix），。

## 邻接表（Adjacency List）

针对 Adjacency Matrix 比较浪费空间的问题，诞生的。
是时间换空间。

![](../image/20200119143223.jpg)

图中每个节点对应一个链表，链表中存储着该节点指向的节点。

### 优点：

- 节省空间

### 缺点：
- 使用起来比较耗时间。比如：上图我们要确定：是否存在一条顶点 2 到顶点 4 的边，需要遍历顶点 2 对应的链表。
- 链表是非连续存储，对 CPU 缓存非常不友好。

### 优化
如果链表过长，影响查找效率。可以将链表替换为更高效的存储结构。
- 平衡二叉树（比如：红黑树）
- 跳表
- 散列表
- 有序动态数组：通过二分法来快速定位。

# 案例：如何存储微博，微信等社交网络中的好友关系？
微博可以单向关注：有向图。
微信必须双向关注：无向图。

针对微博用户：假设需要支持以下操作。
- 判断 A 是否关注了 B
- A 关注 B
- A 取消关注 B
- 分页获取用户的粉丝列表
- 分页获取用户的关注列表

分析：由于社交网络是一张稀疏图，因此使用邻接表。
注意：用一个图表示用户关注关系，获取用户的粉丝列表，将非常困难。所以需要一个逆邻接表（类似倒排索引）。

![](../image/20200119143310.jpg)

邻接表中链表不适合快速判断两个用户是否是关注与被关注的关系。用哪种动态数据结构替换? 红黑树、跳表、有序动态数组还是散列表？

因为需要按照用户名称的首字母排序，用跳表这种结构再合适不过了。因为：跳表插入、删除、查找都非常高效 O(logn),空间复杂度稍高Q(n)，最重要一点跳表中的数据是有序的，获取粉丝列表和关注列表，非常高效。

如果社交网络中只有几十万用户，可以将整个社交网络存储在内存中，但是如果像微博一样有上亿用户，无法全部存储到内存中。

## 数据量非常大：优化

方案一：用哈希算法，将邻接表存储在不同的机器上。

机器 1 上存储顶点 1，2，3 的邻接表

在机器 2 上，存储顶点 4，5 的邻接表

逆邻接表的处理方式也一样。

![](../image/20200119143412.jpg)

方案二：存在数据库（外部存储）中，在第一列、第二列都建立索引。

![](../image/20200119144057.jpg)

# 常见算法

图的组织结构形式非常多，相同的算法在不同的结构上，差异也非常大。因此我们需要将所有算法在一种（适合自己）结构上，练习熟练。后续再遇到结构不同图，只需要写一个转换函数，将异构的图，转成自己熟悉的图。

下边的  Graph 结构，比较复杂，可以涵盖大部分的图算法。在实际的算法中，对于没有使用的属性，可以不赋值。如果在工程中使用graph 可以根据实际情况进行改动。

```python
class Edge:
    def __init__(self, weight, from_node=None, to_node=None):
        self.weight = weight
        self.from_node = from_node
        self.to_node = to_node


class Node:
    def __init__(self, value):
        self.value = value
        self.in_degree = 0
        self.out_degree = 0
        self.nexts = []
        self.edges = []


class Graph:
    def __init__(self):
        self.nodes = {}
        self.edges = set()
```



```python
# [ from, to, weight ]

# [ [1, 2, 0.5],
#  [2, 3, 0.6] ]
def create_graph(matrix):
    graph = Graph()

    for i in range(len(matrix)):
        from_val = matrix[i][0]
        to_val = matrix[i][1]
        weight = matrix[i][0]

        if from_val not in graph.nodes:
            graph.nodes[from_val] = Node(value=from_val)
        if to_val not in graph.nodes:
            graph.nodes[to_val] = Node(value=to_val)

        from_node = graph.nodes[from_val]
        to_node = graph.nodes[to_val]
        from_node.nexts.append(to_node)
        from_node.out_degree += 1
        to_node.in_degree += 1

        edge = Edge(weight, from_node, to_node)
        from_node.edges.append(edge)
        graph.edges.add(edge)

    return graph
```





```python
graph_map = {
    "A": ["B", "C"],
    "B": ["A", "C", "D"],
    "C": ["A", "B", "D", "E"],
    "D": ["B", "C", "E", "F"],
    "E": ["C", "D"],
    "F": ["D"]
}

def create_graph2(graph_map):
    graph = Graph()

    for from_val, to_list in graph_map.items():

        weight = 0
        for to_val in to_list:

            if from_val not in graph.nodes:
                graph.nodes[from_val] = Node(value=from_val)
            if to_val not in graph.nodes:
                graph.nodes[to_val] = Node(value=to_val)

            from_node = graph.nodes[from_val]
            to_node = graph.nodes[to_val]
            from_node.nexts.append(to_node)
            from_node.out_degree += 1
            to_node.in_degree += 1

            edge = Edge(weight, from_node, to_node)
            from_node.edges.append(edge)
            graph.edges.add(edge)

    return graph

graph = create_graph2(graph_map)
```



```python
# 带权无向图
matrix = [[0, 5, 3, 0],
          [5, 0, 2, 6],
          [3, 2, 0, 1],
          [0, 6, 1, 0]]

def create_graph3(matrix):
    graph = Graph()

    n = len(matrix)
    for from_val in range(n):

        for to_val in range(n):
            weight = matrix[from_val][to_val]
            if weight == 0: continue

            if from_val not in graph.nodes:
                graph.nodes[from_val] = Node(value=from_val)
            if to_val not in graph.nodes:
                graph.nodes[to_val] = Node(value=to_val)

            from_node = graph.nodes[from_val]
            to_node = graph.nodes[to_val]
            from_node.nexts.append(to_node)
            from_node.out_degree += 1
            to_node.in_degree += 1

            edge = Edge(weight, from_node, to_node)
            from_node.edges.append(edge)
            graph.edges.add(edge)

    return graph

graph = create_graph3(matrix)
```



- 图的搜索：广度优先和深度优先
- 最短路径
- 最小生成树
- 二分图

广度优先和深度优先遍历主要针对：无权图。



## 广度优先遍历

![](images/20210201101123.jpg)

图的广度优先遍历和树的层遍历类似，需要使用<font color=red>**队列**</font>来控制节点遍历顺序。不同的是，图可能有环，导致死循环，因此需要借助一个集合，存放已经遍历过的节点，后续遍历跳过这些节点。



节点1，为起始节点。

seen 是一个集合：记录已访问过的结点。



![](images/20210203112402.jpg)

```python
# 无向图
graph = {
    "A": ["B", "C"],
    "B": ["A", "C", "D"],
    "C": ["A", "B", "D", "E"],
    "D": ["B", "C", "E", "F"],
    "E": ["C", "D"],
    "F": ["D"]
}

'''
广度遍历
s:起始节点
借助 queue
'''
print("广度遍历")
def BFS(graph, s):
    queue = []
    queue.append(s)
    seen = set()
    seen.add(s)
    while queue:
        vertex = queue.pop(0)
        nodes = graph[vertex]
        for w in nodes:
            if w in seen: continue
            queue.append(w)
            seen.add(w)
        print(vertex)
BFS(graph, "E")
```



## 深度遍历

深度遍历与树的：前序、中序、后序遍历类似，需要使用<font color=red>**栈**</font>来控制节点遍历顺序。不同的是，图可能有环，导致死循环，因此需要借助一个集合，存放已经遍历过的节点，后续遍历跳过这些节点。

- 实线箭头：遍历
- 虚线箭头：回退

![](images/20210201102257.jpg)

- 

![](images/20210203145247.jpg)

<font color=red>深度优先搜索：回溯思想</font>

```python
'''
深度遍历
s:其实节点
借助 stack
'''
def DFS(graph, s):
    stack = [s]
    seen = set(s)
    while stack:
        vertex = stack.pop()
        nodes = graph[vertex]
        for w in nodes:
            if w in seen: continue
            stack.append(w)
            seen.add(w)
        print(vertex)
DFS(graph, "E")
```



## 最短路径(Shortest Path Algorithm)

- 在无权图上的最短路径
- 在有权图上的最短路径



## 无权图最短路径

![](images/20210201101123.jpg)



<font color=red>广度优先遍历算法</font>，从起始节点一层一层遍历，首次遍历到 t 节点，就是 s 到 t 的最短路径。

此时队列中节点是有顺序的（层级更深的结点，放在后边）。天然就是一个优先级队列。加权图，由于权重的存在，需要人工根据权重维护一个优先级队列。

上边 BFS ,没有存储路径。我们需要 parent 数组（如果结点编号，用数据存储；如果结点没有编号，用 map 存储）来存储路径。



![](images/20210204104704.jpg)

```python
'''
求任意两点间的最短路径
借助 parent 字典，记录所有节点的前一个节点
parent ={
    "A":None,
    "B":"A",
    "C":A,
    "D":"B",
    "E":"C",
    "F":"D" }

假设求：A -> E 的最短路径：E <- C <- A (通过查 parent 表即可获得)
'''
print("求任意两点间的最短路径")

def BFS2(graph, s):
    queue = []
    queue.append(s)
    seen = set()
    seen.add(s)
    parent = {s: None}
    while queue:
        vertex = queue.pop(0)
        nodes = graph[vertex]
        for w in nodes:
            if w in seen: continue
            queue.append(w)
            seen.add(w)
            parent[w] = vertex
        print(vertex)
    return parent

parent = BFS2(graph, "A")
print(parent)

print("打印路径")
v = 'E'
while v:
    print(v)
    v = parent[v]
```



## 有权图最短路径

单源最短路径算法（从一个顶点到一个顶点）：Dijkstra 算法

Dijkstra 算法与无权图最短路基算法的区别在于：

1. 使用<font color=red>优先级队列</font>，保证最短的路径节点，优先被拿出。

```python
# 通过小顶堆实现的
import heapq

queue=[]
# (1,'a'):(优先级,数据)
heapq.heappush(queue,(1,'a'))
heapq.heappush(queue,(3,'c'))
heapq.heappush(queue,(2,'b'))
heapq.heappush(queue,(4,'d'))

heapq.heappop(queue)
# (1,'a')
heapq.heappop(queue)
# (2,'b')
heapq.heappop(queue)
# (3,'c')
heapq.heappop(queue)
# (4,'d')
```

![](../image/20191205221309.jpg)

![](images/20210204155120.jpg)

```python
'''
求任意两点间的最短路径(加权图)
BFS：借助队列，而 dijkstra 借助：优先队列 Priority Queue
'''
import heapq
import math

graph = {
    "A": {"B": 5, "C": 1},
    "B": {"A": 5, "C": 2, "D": 1},
    "C": {"A": 1, "B": 2, "D": 4, "E": 8},
    "D": {"B": 1, "C": 4, "E": 3, "F": 6},
    "E": {"C": 8, "D": 3},
    "F": {"D": 6}
}

def dijkstra(graph, s):
    queue = []
    heapq.heappush(queue, (0, s))
    seen = set()

    parent = {s: None}
    distance = dict((i, math.inf) for i in graph.keys())
    distance[s] = 0
    while queue:
        dist, vertex = heapq.heappop(queue)
        nodes = graph[vertex].keys()
        seen.add(vertex)
        for w in nodes:
            if w in seen: continue
            if dist + graph[vertex][w] < distance[w]:
                heapq.heappush(queue, (dist + graph[vertex][w], w))
                parent[w] = vertex
                distance[w] = dist + graph[vertex][w]
    return parent, distance

p, d = dijkstra(graph, "A")
print(p)
print(d)

v = 'E'
while v:
    print(v, d[v])
    v = p[v]
```

