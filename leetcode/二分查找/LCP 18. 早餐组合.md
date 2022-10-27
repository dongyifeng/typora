难度：<font color=green>简单</font>

> 小扣在秋日市集选择了一家早餐摊位，一维整型数组 staple 中记录了每种主食的价格，一维整型数组 drinks 中记录了每种饮料的价格。小扣的计划选择一份主食和一款饮料，且花费不超过 x 元。请返回小扣共有多少种购买方案。
>
> 注意：答案需要以 1e9 + 7 (1000000007) 为底取模，如：计算初始结果为：1000000008，请返回 1

**示例 1：**

```python
输入：staple = [10,20,5], drinks = [5,5,2], x = 15

输出：6

解释：小扣有 6 种购买方案，所选主食与所选饮料在数组中对应的下标分别是：
第 1 种方案：staple[0] + drinks[0] = 10 + 5 = 15；
第 2 种方案：staple[0] + drinks[1] = 10 + 5 = 15；
第 3 种方案：staple[0] + drinks[2] = 10 + 2 = 12；
第 4 种方案：staple[2] + drinks[0] = 5 + 5 = 10；
第 5 种方案：staple[2] + drinks[1] = 5 + 5 = 10；
第 6 种方案：staple[2] + drinks[2] = 5 + 2 = 7。
```

**示例 2：**

```python
输入：staple = [2,1,1], drinks = [8,9,5,1], x = 9

输出：8

解释：小扣有 8 种购买方案，所选主食与所选饮料在数组中对应的下标分别是：
第 1 种方案：staple[0] + drinks[2] = 2 + 5 = 7；
第 2 种方案：staple[0] + drinks[3] = 2 + 1 = 3；
第 3 种方案：staple[1] + drinks[0] = 1 + 8 = 9；
第 4 种方案：staple[1] + drinks[2] = 1 + 5 = 6；
第 5 种方案：staple[1] + drinks[3] = 1 + 1 = 2；
第 6 种方案：staple[2] + drinks[0] = 1 + 8 = 9；
第 7 种方案：staple[2] + drinks[2] = 1 + 5 = 6；
第 8 种方案：staple[2] + drinks[3] = 1 + 1 = 2；
```

**思路一：暴力破解**



**代码：**

时间复杂度：O(n*m)

空间复杂度：O(1)

```python
def breakfast_number(staple, drinks, x):
    staple.sort()
    drinks.sort()
    print("staple:", staple)

    print("drinks:", drinks)

    res = 0
    end = len(drinks) - 1
    for i in range(len(staple)):
        if staple[i] >= x: break
        tmp = x - staple[i]
        for j in range(end, -1, -1):
            if drinks[j] <= tmp:
                break
        if staple[i] + drinks[j] <= x:
            res += (j + 1)
        end = j
    return res


print(breakfast_number([10, 20, 5], [5, 5, 2], 15))
print(breakfast_number([2, 1, 1], [8, 9, 5, 1], 9))
print(breakfast_number([7, 3, 4, 3, 9, 9, 10, 8, 8, 3], [7, 10, 6, 7, 5, 2, 8, 4, 5, 8], 5))
```



**思路：二分查找**

**代码：**

```python
def breakfast_number2(staple, drinks, x):
    staple.sort()
    drinks.sort()

    res = 0
    end = len(drinks)-1
    for i in range(len(staple)):
        if staple[i] + drinks[0] > x: break
        tmp = x - staple[i]
        j = find(drinks, tmp,end)
        if staple[i] + drinks[j - 1] <= x:
            res += j
            end=j
    return res


import sys
def find(nums, k, end):
    if end < 0: return 0
    nums.insert(0, -sys.maxsize)
    nums.append(sys.maxsize)
    left = 0
    right = end + 2
    while left <= right:
        mid = left + ((right - left) >> 1)
        if nums[mid] > k and nums[mid - 1] <= k:
            break

        if nums[mid] > k:
            right = mid - 1
        else:
            left = mid + 1

    nums.remove(-sys.maxsize)
    nums.pop()
    return mid - 1
```

