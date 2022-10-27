难度：<font color=green>简单</font>

> 输入一个递增排序的数组和一个数字s，在数组中查找两个数，使得它们的和正好是s。如果有多对数字的和等于s，则输出任意一对即可。

**示例 1：**

```python
输入：nums = [2,7,11,15], target = 9
输出：[2,7] 或者 [7,2]
```

**示例 2：**

```python
输入：nums = [10,26,30,31,47,60], target = 40
输出：[10,30] 或者 [30,10]
```



**思路：二分法**



**代码：**

时间复杂度：O(nlogn)

空间复杂度：O(1)

```python
def two_sum(nums, target):
    for i in range(len(nums)):
        p = find(nums, target - nums[i], i)
        if p != -1:
            return [nums[i], nums[p]]
    return []

def find(nums, target, left):
    right = len(nums) - 1
    while left <= right:
        mid = left + ((right - left) >> 1)
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```



**思路：双指针**



**代码：**

时间复杂度：O(n)

空间复杂度：O(1)

```python
def two_sum2(nums, target):
    left = 0
    right = len(nums) - 1
    while left < right:
        tmp = nums[left] + nums[right]
        if tmp == target:
            return [nums[left], nums[right]]
        if tmp < target:
            left += 1
        else:
            right -= 1
    return []
```

