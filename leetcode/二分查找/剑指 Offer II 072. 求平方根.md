难度：<font color=green>简单</font>

> 给定一个非负整数 x ，计算并返回 x 的平方根，即实现 int sqrt(int x) 函数。
>
> 正数的平方根有两个，只输出其中的正数平方根。
>
> 如果平方根不是整数，输出只保留整数的部分，小数部分将被舍去。



**示例 1:**

```python
输入: x = 4
输出: 2
```

**示例 2:**

```python
输入: x = 8
输出: 2
解释: 8 的平方根是 2.82842...，由于小数部分将被舍去，所以返回 2
```

**思路：二分查找**



**代码：**

```python
def my_sqrt(x):
    left = 0
    right = x
    while left <= right:
        mid = left + ((right - left) >> 1)
        tmp = mid * mid
        if tmp == x:
            return mid
        if tmp < x:
            left = mid + 1
        else:
            right = mid - 1
    return left - 1

print(my_sqrt(4))
print(my_sqrt(6))
print(my_sqrt(8))
print(my_sqrt(9))
print(my_sqrt(10))
```

