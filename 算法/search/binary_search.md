二分查找法：其实就是“猜”，但是是有策略的“猜”，用“排除法”在有限的区间里，一次排除一半的区间元素。



> 查找 target，如果命中返回 index ，否则返回 -1

代码：

```python
def binary_search(nums, target):
    if not nums or nums[0] > target or nums[-1] < target: return -1
    l = 0
    r = len(nums) - 1
    while l < r:
        mid = (l + r) >> 1
        if nums[mid] == target: return mid
        if nums[mid] > target:
            r = mid - 1
        else:
            l = mid + 1
    # 如果返回 l 就是要 target 要插入的位置。 
    return -1
```



> ```
> 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
> 你可以假设数组中无重复元素。
> 
> 示例 1:
> 
> 输入: [1,3,5,6], 5
> 输出: 2
> 示例 2:
> 
> 输入: [1,3,5,6], 2
> 输出: 1
> 示例 3:
> 
> 输入: [1,3,5,6], 7
> 输出: 4
> 示例 4:
> 
> 输入: [1,3,5,6], 0
> 输出: 0
> ```

```python
def searchInsert(nums, target):
    if not nums or nums[0] > target: return 0
    n = len(nums)
    l = 0
    r = n

    while l < r:
        mid = (l + r) >> 1
        if nums[mid] == target: return mid
        if nums[mid] < target:
            l = mid + 1
        else:
            r = mid
    return r
```

注意：

1. while l < r
2. r = mid 而非 r = mid + 1

这样循环完毕后，r = l ，不需要考虑返回r 还是 l 的问题。



注意事项：

1. 当 l 和 r 很大时，mid = l + r >> 1 时，l + r 可能超过 int 的最大值。可以使用 mid = l + ( r - l ) >> 1 可以避免。但是 l 和 r 都是数组下标，一般不会很大。
2. mid = l + (r - l ) 当 l 为负数并且很小时，r - l 也容易溢出。l 是数组下标，不可能是负数。
3. mid = (l + r ) >> 1 得到左中位数。
4. mid = (l + r + 1 ) >> 1 得到右中位数。