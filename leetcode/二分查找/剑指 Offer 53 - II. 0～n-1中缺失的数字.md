难度：<font color=green>简单</font>

> 一个长度为 n-1 的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围 0～n-1 之内。在范围 0～n-1 内的 n 个数字中有且只有一个数字不在该数组中，请找出这个数字。

**示例 1:**

```python
输入: [0,1,3]
输出: 2
```

**示例 2:**

```python
输入: [0,1,2,3,4,5,6,7,9]
输出: 8
```



**思路：二分查找**



**代码：**

时间复杂度：O(log n)

空间复杂度：O(1)

```python
def missing_number(nums):
    left = 0
    right = len(nums) - 1
    while left <= right:
        mid = left + ((right - left) >> 1)
        if nums[mid] == mid:
            left = mid + 1
        else:
            right = mid - 1
    return left
```

