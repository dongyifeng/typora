[TOC]

```python
import numpy as np

# 创建
array = np.array([[1, 2, 3],
                  [4, 5, 6]])

print(array)
# 维度：2
print("number of dim", array.ndim)
# （行，列）：（2，3）
print("shape", array.shape)
# 元素个数：6
print("size", array.size)
```



# 创建 array



```python
# 创建
array = np.array([[1, 2, 3],
                  [4, 5, 6]])

a = np.zeros((2, 3))

a = np.ones((2, 3))

a = np.empty((2, 3))

# 重新定义 shape
a = np.arange(6).reshape((2, 3))

# 生成线段： start,end,num（个数）
a = np.linspace(1, 10, 5)
```



# 基础运算

```python
a = np.array([10, 20, 30, 40])
b = np.arange(4)
print(a)
print(b)
# 点减
print(a - b)

# 点加
print(a + b)

# 点乘
print(a * b)

# 点平方
print(b ** 2)

# 点 sin
c = 10 * np.sin(a)
c = 10 * np.cos(a)
c = 10 * np.tan(a)
print(c)

print(c < 3)
print(c == 3)

# 矩阵
a = np.array([[1, 1], [0, 1]])
b = np.arange(4).reshape((2, 2))

print('-' * 100)
# 点乘
c = a * b
# 矩阵相乘
c_dot = np.dot(a, b)
c_dot_2 = a.dot(b)

print(c)
print(c_dot)

# 求和
# shape:(2,4)
a = np.random.random((2, 4))

np.sum(a)
np.max(a)
np.min(a)

# axis=0 在列中求和，最大值，最小值，返回数组，列的长度
# axis=1 在行中求和，最大值，最小值，返回数组，行的长度
print(np.sum(a, axis=1))
print(np.max(a, axis=1))
print(np.min(a, axis=1))

print(np.sum(a, axis=0))
print(np.max(a, axis=0))
print(np.min(a, axis=0))


a = np.arange(14, 2, -1).reshape((3, 4))

# 矩阵中最小值的索引
np.argmin(a)
np.argmax(a)

# 均值
np.mean(a)
a.mean()
np.average(a)
# 列的均值
np.mean(a,axis=0)
# 行的均值
np.mean(a,axis=1)

# 中位数
np.median(a)

# 前缀和
print(np.cumsum(a))

# 行相邻数的差
print(np.diff(a))

# 非零（[行数]，[列数]）
np.nonzero(a)

# 排序
np.sort(a)

# 矩阵转置
np.transpose(a)
a.T

# 矩阵相乘
np.transpose(a).dot(a)
a.T.dot(a)

# 在 a，所有小于 5 的数，赋值为 5
# 所有大于 9 的数，赋值为 9
print(np.clip(a, 5, 9))
#[[9 9 9 9]
# [9 9 8 7]
# [6 5 5 5]]
```



# 索引

```python
A = np.arange(3, 15).reshape((3, 4))
print(A)
# 第 2 行
print(A[2])
# 第 2 行，第 1 列的数
print(A[2][1])
print(A[2, 1])

# 第 2 行，: 表示所有
print(A[2, :])
# 第 1 列
print(A[:1])
# 第 2 行，第 1 第 3 数
print(A[2, 1:3])

# 遍历行
for row in A:
    print(row)

# 遍历列
for column in A.T:
    print(column)

# 遍历元素
for item in A.flat:
    print(item)

# 返回迭代器
A.flat
# 泛会数组
A.flatten()
```



# 合并

```python
A = np.array([1,1,1])
B = np.array([2,2,2])

# 垂直合并
print(np.vstack((A,B,A)))
#[[1 1 1]
# [2 2 2]
# [1 1 1]]

# 水平合并
print(np.hstack((A,B,A)))
# [1 1 1 2 2 2 1 1 1]

# 如果想将[1,1,1] 转成[[1]
#                     [1],
#                     [1]]
# A.T 是不行的。[1,1,1] 是一维的，转换后是二维的

print(A.T)
# [1 1 1]
print(A.reshape((3,1)))
#[[1 1 1]
# [2 2 2]
# [1 1 1]]

# 在行增加一维
print(A[np.newaxis,:])
# 在列增加一维
print(A[:,np.newaxis])

A = A.reshape(3,1)
B = B.reshape(3,1)
# 垂直合并
C = np.concatenate((A,B,A,B),axis=0)

# 水平合并
C = np.concatenate((A,B,A,B),axis=1)
print(C)
#[[1 2 1 2]
# [1 2 1 2]
# [1 2 1 2]]
```



# 分割

```python
A = np.arange(12).reshape((3,4))
'''
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]]
'''
# 纵向分割(等份)
print(np.vsplit(A,3))
print(np.split(A,3,axis=0))
'''
[array([[0, 1, 2, 3]]), array([[4, 5, 6, 7]]), array([[ 8,  9, 10, 11]])]
'''

# 横向分割(等份)
print(np.hsplit(A,2))
print(np.split(A,2,axis=1))
'''
[array([[0, 1],
       [4, 5],
       [8, 9]]), array([[ 2,  3],
       [ 6,  7],
       [10, 11]])]
'''

# 不等量分割
print(np.array_split(A,3,axis=1))
'''
[array([[0, 1],
       [4, 5],
       [8, 9]]), array([[ 2],
       [ 6],
       [10]]), array([[ 3],
       [ 7],
       [11]])]
'''
```



# copy

```python
A = np.arange(12)

B = A.copy()

A[1:5] = 22
print(A)
print(B)

```

