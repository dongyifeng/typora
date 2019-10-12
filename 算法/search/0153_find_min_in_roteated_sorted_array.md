> ```properties
> 假设按照升序排序的数组在预先未知的某个点上进行了旋转。
> 
> ( 例如，数组 [0,1,2,4,5,6,7] 可能变为 [4,5,6,7,0,1,2] )。
> 
> 请找出其中最小的元素。
> 
> 你可以假设数组中不存在重复元素。
> 
> 示例 1:
> 
> 输入: [3,4,5,1,2]
> 输出: 1
> 示例 2:
> 
> 输入: [4,5,6,7,0,1,2]
> 输出: 0
> ```

# 暴力求解

思路：

nums 有两种情况：

1. 有旋转：旋转点就是最小值：（遍历数组寻找旋转点）
2. 没有旋转：nums[0] 就是最小值

```python
def findMin(nums):
    rotation_index = 0
    last = nums[0]
    # 判断是否旋转
    for i in range(1, len(nums)):
        if last > nums[i]:
            rotation_index = i
            break
        last = nums[i]
    return min(nums[0], nums[rotation_index])
```

# 二分查找

思路：

if 存在旋转点，那么有序数组将被分为两个：nums1，nums2，且 nums1 > nums2。

目标：找到：num2， 并逐步将 mid 指向 nums2 的起始位置。

if nums[mid] > nums[right]: mid 在 nums1，则 left = mid + 1，右移（mid 在nums1 上，可以mid + 1）
if nums[mid] < nums[right]: mid 在 nums2，则 right = mid，mid 已经在nums2 上 ，mid -1 可能正确的数据。

```python
def findMin2(nums):
    left = 0
    right = len(nums) - 1
    while left < right:
        mid = (left + right) >> 1
        if nums[mid] > nums[right]:
            left = mid + 1
        elif nums[mid] < nums[right]:
            right = mid

    return nums[left]
```



## nums 有重复数据

如果nums 有重复数据：【7, 0, 1, 1, 1, 1, 1, 2, 3, 4】

if nums[mid] == nums[right]: 无法判断 mid 在哪个数组中。
例如：left = 0 ，right = 4，mid = 2 时，
如果nums = 【1,0,1,1,1】中 mid 在 nums2 中
如果nums = 【1,1,1,0,1】中 mid 在 nums1 中

if nums[mid] == nums[right]: right = right - 1

```python
def findMin3(nums):
    left = 0
    right = len(nums) - 1
    while left < right:
        mid = (left + right) >> 1
        if nums[mid] > nums[right]:
            left = mid + 1
        elif nums[mid] < nums[right]:
            right = mid
        else:
            right -= 1

    return nums[left]
  
print findMin3([7, 0, 1, 1, 1, 1, 1, 2, 3, 4])
```