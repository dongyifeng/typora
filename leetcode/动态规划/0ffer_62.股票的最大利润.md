# 股票的最大利润

> 假设把某股票的价格按照时间先后顺序存储在数组中，请问买卖该股票一次可能获得的最大利润是多少？



**示例 1:**

```python
输入: [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格。
```



**示例 2:**

```python
输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
```



**思路：暴力破解**

两两计算价格的差值，找出最大差值。



**代码：**

时间复杂度：$O(n^2)$

空复杂度：O(1)

```python
def max_profit(prices):
    n = len(prices)
    res = 0
    for i in range(n):
        for j in range(i + 1, n):
            res = max(res, prices[j] - prices[i])
    return res
```



**思路：**

遍历数组，当前价格与之前最低价格的差值即为当前最大利润。

**代码：**

时间复杂度：O(n)

空复杂度：O(1)

```python
def max_profit2(prices):
    if not prices: return 0
    res = 0
    min_value = prices[0]
    for p in prices:
        min_value = min(min_value, p)
        res = max(res, p - min_value)
    return res


print(max_profit2([7, 1, 5, 3, 6, 4]))
print(max_profit2([7, 6, 4, 3, 1]))
```

