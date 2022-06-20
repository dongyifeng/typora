难度：<font color=orange>中等</font>

> 给定一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
>
> 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。



**示例 1：**

```apl
输入：nums = [1,2,3]
输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```



**示例 2：**

```apl
输入：nums = [0]
输出：[[],[0]]
```



**思路：**



**代码：**

```python
def subsets(nums):
    """
    :type nums: List[int]
    :rtype: List[List[int]]
    """
    if not nums: return []
    result = [[]]
    for item in nums:
        for k in copy.deepcopy(result):
            k.append(item)
            result.append(k)
    return result

print(subsets([1, 2, 3]))
```

