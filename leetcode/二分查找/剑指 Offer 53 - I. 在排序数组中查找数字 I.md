难度：<font color=green>简单</font>

> 统计一个数字在排序数组中出现的次数。

**示例 1:**

```python
输入: nums = [5,7,7,8,8,10], target = 8
输出: 2
```

**示例 2:**

```python
输入: nums = [5,7,7,8,8,10], target = 6
输出: 0
```



**思路:二分查找 + 双指针**

1. 通过二分查找先定位到，target 的位置：pos。
2. 在 pos 位置左右两侧，统计target 个数

**代码:**

时间复杂度：O( log n)

空间复杂度：O(1)

```python
def search(nums, target):
    left = 0
    right = len(nums) - 1
    pos = -1
    while left <= right:
        mid = left + ((right - left) >> 1)
        if nums[mid] == target:
            pos = mid
            break
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    if pos == -1: return 0

    res = 1
    left = mid - 1
    right = mid + 1
    while 0 <= left or right < len(nums):

        if 0 <= left and nums[left] == target:
            res += 1
            left -= 1
            continue
        if right < len(nums) and nums[right] == target:
            res += 1
            right += 1
            continue

        break
    return res


print(search([5, 7, 7, 8, 8, 10], 8))
print(search([5, 7, 7, 8, 8, 10], 6))
print(search([2, 2], 2))
print(search([1, 4], 4))
```

