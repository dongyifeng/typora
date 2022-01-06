难度：<font color=green>简单</font>

> 符合下列属性的数组 arr 称为**山峰数组（山脉数组） **：
>
> arr.length >= 3
> 存在 i（0 < i < arr.length - 1）使得：
> arr[0] < arr[1] < ... arr[i-1] < arr[i]
> arr[i] > arr[i+1] > ... > arr[arr.length - 1]
> 给定由整数组成的山峰数组 arr ，返回任何满足 arr[0] < arr[1] < ... arr[i - 1] < arr[i] > arr[i + 1] > ... > arr[arr.length - 1] 的下标 i ，即山峰顶部。



**示例 1：**

```python
输入：arr = [0,1,0]
输出：1
```

**示例 2：**

```python
输入：arr = [1,3,5,4,2]
输出：2
```

**示例 3：**

```python
输入：arr = [0,10,5,2]
输出：1
```

**示例 4：**

```python
输入：arr = [3,4,5,1]
输出：2
```

**示例 5：**

```python
输入：arr = [24,69,100,99,79,78,67,36,26,19]
输出：2
```

**思路：双指针**



**代码：**

时间复杂度：O(n)

时间复杂度：O(1)

```python
def peak_index_in_mountain_array(arr):
    left = 0
    right = len(arr) - 1
    while left < right:
        if arr[left] < arr[left + 1]:
            left += 1
        if arr[right - 1] > arr[right]:
            right -= 1
    return left

print(peak_index_in_mountain_array([0, 1, 0]))
print(peak_index_in_mountain_array([1, 3, 5, 4, 2]))
print(peak_index_in_mountain_array([0, 10, 5, 2]))
print(peak_index_in_mountain_array([3, 4, 5, 1]))
print(peak_index_in_mountain_array([24, 69, 100, 99, 79, 78, 67, 36, 26, 19]))
```



**思路：二分查找**

**代码：**

时间复杂度：O(log n)

时间复杂度：O(1)

```python
def peak_index_in_mountain_array2(arr):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid = left + ((right - left) >> 1)
        # mid 是山峰
        if arr[mid] > arr[mid + 1] and arr[mid] > arr[mid - 1]:
            return mid
        # mid 落在山峰的左边
        if arr[mid] < arr[mid + 1] and arr[mid] > arr[mid - 1]:
            left = mid + 1
        # mid 落在山峰的右边
        else:
            right = mid - 1
    return left
```

