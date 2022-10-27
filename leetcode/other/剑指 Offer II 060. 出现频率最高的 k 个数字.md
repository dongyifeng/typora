难度：<font color=orange>中等</font>

> 给定一个整数数组 `nums` 和一个整数 `k` ，请返回其中出现频率前 `k` 高的元素。可以按 **任意顺序** 返回答案。

**示例 1:**

```apl
输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]
```



**示例 2:**

```apl
输入: nums = [1], k = 1
输出: [1]
```



**思路:**

1. 统计词频
2. 排序
3. 取 Top k



```python
def top_k_qrequent(nums, k):
    qreq = {}
    for item in nums:
        qreq[item] = qreq.get(item, 0) + 1
    a = sorted(qreq.items(), key=lambda x: x[1], reverse=True)
    return [x for x, y in a[:k]]

print(top_k_qrequent([3, 3, 3, 2, 2, 1], 2))
```



**思路:**

1. 统计词频
2. 使用 heap 获取 Top k

```python
import heapq


def top_k_qrequent2(nums, k):
    qreq = {}
    for item in nums:
        qreq[item] = qreq.get(item, 0) + 1
    print(qreq)
    return [y for x, y in get_least_numbers([(y, x) for x, y in qreq.items()], k)]

    # a = sorted(qreq.items(), key=lambda x: x[1], reverse=True)
    # return [x for x, y in a[:k]]


def get_least_numbers(arr, k):
    if k <= 0: return []
    n = len(arr)
    if n <= k:
        return arr
    res = []
    for i in range(k):
        heapq.heappush(res, arr[i])

    for j in range(k, n):
        if res[0] < arr[j]:
            heapq.heappushpop(res, arr[j])
    return [item for item in res]
```

