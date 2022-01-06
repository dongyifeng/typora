难度：<font color=green>简单</font>

> 给定一个排序的整数数组 nums 和一个整数目标值 target ，请在数组中找到 target ，并返回其下标。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
>
> 请必须使用时间复杂度为 O(log n) 的算法。

**示例 1:**

```python
输入: nums = [1,3,5,6], target = 5
输出: 2
```

**示例 2:**

```python
输入: nums = [1,3,5,6], target = 2
输出: 1
```

**示例 3:**

```python
输入: nums = [1,3,5,6], target = 7
输出: 4
```

**示例 4:**

```python
输入: nums = [1,3,5,6], target = 0
输出: 0
```

**示例 5:**

```python
输入: nums = [1], target = 0
输出: 0
```



**思路：二分查找**



**代码:**

```python
def search_insert(nums, target):
    left = 0
    right = len(nums) - 1
    while left <= right:
        mid = left + ((right - left) >> 1)
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return left

print(search_insert([1, 3, 5, 6], 5))
print(search_insert([1, 3, 5, 6], 2))
print(search_insert([1, 3, 5, 6], 7))
print(search_insert([1, 3, 5, 6], 0))
print(search_insert([1], 0))
  
```

