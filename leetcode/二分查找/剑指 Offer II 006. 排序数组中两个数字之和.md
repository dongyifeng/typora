> 给定一个已按照 升序排列  的整数数组 numbers ，请你从数组中找出两个数满足相加之和等于目标数 target 。
>
> 函数应该以长度为 2 的整数数组的形式返回这两个数的下标值。numbers 的下标 从 0 开始计数 ，所以答案数组应当满足 0 <= answer[0] < answer[1] < numbers.length 。
>
> 假设数组中存在且只存在一对符合条件的数字，同时一个数字不能使用两次。

**示例 1：**

```python
输入：numbers = [1,2,4,6,10], target = 8
输出：[1,3]
解释：2 与 6 之和等于目标数 8 。因此 index1 = 1, index2 = 3 。
```

**示例 2：**

```python
输入：numbers = [2,3,4], target = 6
输出：[0,2]
```

**示例 3：**

```python
输入：numbers = [-1,0], target = -1
输出：[0,1]
```



**思路：双指针**



**代码：**

时间复杂度：O(n)

空间复杂度：O(1)

```python
def two_sum(numbers, target):
    left = 0
    right = len(numbers) - 1
    while left < right:
        sum = numbers[left] + numbers[right]
        if sum == target:
            return [left, right]
        if sum < target:
            left += 1
        if sum > target:
            right -= 1
            
print(two_sum([1, 2, 4, 6, 10], 8))
print(two_sum([2, 3, 4], 6))
print(two_sum([-1, 0], -1))
```



**思路：二分查找**



**代码：**

时间复杂度：O(n*log n)

空间复杂度：O(1)

```python
# 二分查找
def two_sum2(numbers, target):
    n = len(numbers)
    for i in range(n):
        left = i + 1
        right = n - 1
        while left <= right:
            mid = left + ((right - left) >> 1)
            sum = numbers[mid] + numbers[i]
            if sum == target:
                return [i, mid]
            if sum < target:
                left = mid + 1
            if sum > target:
                right = mid - 1
```

