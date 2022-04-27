难度：<font color=green>简单</font>

> 输入整数数组 `arr` ，找出其中最小的 `k` 个数。例如，输入4、5、1、6、2、7、3、8这8个数字，则最小的4个数字是1、2、3、4。



**示例 1：**

```apl
输入：arr = [3,2,1], k = 2
输出：[1,2] 或者 [2,1]
```



**示例 2：**

```apl
输入：arr = [0,1,2,1], k = 1
输出：[0]
```



```python
import heapq

def get_least_numbers(arr, k):
    if k <= 0: return []
    n = len(arr)
    if n <= k:
        return arr
    res = []
    for i in range(k):
        heapq.heappush(res, -arr[i])

    for j in range(k, n):
        if -res[0] > arr[j]:
            heapq.heappushpop(res, -arr[j])
    return [-item for item in res]


# print(get_least_numbers([4, 5, 1, 6, 2, 7, 3, 8], 4))
print(get_least_numbers([0, 0, 0, 2, 0, 5], 0))
```

