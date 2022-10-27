[TOC]

# 概念

NDCG（Normalized Discounted cumulative gain）归一化折损累计增益。衡量搜索排序结果的算法。

DCG 的两个思想

- 相关性高的结果比一般相关性的结果更影响最终的指标得分。
- 相关性高的结果出现在更靠前的位置，指标会越高。

# 累计增益(CG)

CG ，cumulative gain ，只考虑的相关性，没有考虑位置信息。
$$
CG_p = \sum_{i=1}^p{rel_i}
$$
$rel_i$：i 位置元素的相关性。



缺点：query = "蓝球" , result1 = [A1，A2，A3] 与 result1 = [A3，A1，A2] 的 CG 值一样。

# 折损累计增益(DCG)

DCG（Discounted cumulative gain）：根据位置信息为每一个 CG 生折算值。

目的：让排名越靠前的结果，越能影响到最后结果。

第 i 个位置：折损值：$\frac{1}{log_2(i+1)}$
$$
DCG_p = \sum_{i=1}^p{\frac{rel_i}{log_2(i+1)}}
$$
业界更常用的DCG公式
$$
DCG_p = \sum_{i=1}^p{\frac{2^{rel_i}-1}{log_2(i+1)}}
$$


如果相关性是二进制时，$rel_i \in {0,1}$ , 上边两个公式是一样的。

# 归一化折损累计收益 (NDCG)

NDCG（Normalized Discounted cumulative gain）

DCG 是一个累加值，不同 query 的返回结果数量不同，因此不同 query 的 DCG 值不具备可比性。所以需要归一化。
$$
nDCG_p = \frac{DCG_p}{IDCG_p}
$$
IDCG 为理想情况下最大的 DCG 值。

理想情况：<font color='red'>**按照相关性从大到小排序后的 DCG 值。**</font>
$$
IDCG_p = \sum_{i=1}^{|REL|}{\frac{2^{rel_i}-1}{log_2(i+1)}}
$$

# Demo

假设一个 query 有 5 个结果，其相关性为：3、2、3、0、1、2

1. 计算 DCG

| i    | $rel_i$ | $log_2(i+1)$ | $\frac{rel_i}{log_2(i+1)}$ |
| ---- | ------- | ------------ | -------------------------- |
| 1    | 3       | 1            | 3                          |
| 2    | 2       | 1.58         | 1.26                       |
| 3    | 3       | 2            | 1.5                        |
| 4    | 0       | 2.32         | 0                          |
| 5    | 1       | 2.58         | 0.38                       |
| 6    | 2       | 2.8          | 0.71                       |

DCG = 3 + 1.26 + 1.5 + 0 + 0.38 + 0.71= 6.86



2. 计算 IDCG

根据相关性排序后，计算IDCG

| i    | $rel_i$ | $log_2(i+1)$ | $\frac{rel_i}{log_2(i+1)}$ |
| ---- | ------- | ------------ | -------------------------- |
| 1    | 3       | 1            | 3                          |
| 2    | 3       | 1.58         | 1.89                       |
| 3    | 2       | 2            | 1                          |
| 4    | 2       | 2.32         | 0.86                       |
| 5    | 1       | 2.58         | 0.39                       |
| 6    | 0       | 2.8          | 0                          |

IDCG = 3 + 1.89 + 1 + 0.86 + 0.39 + 0 = 7.14

 NDCG = DCG / IDCG = 6.86 / 7.14 = 96.08%



# GSB

通常用于对比两个模型之间的对比，而非单个模型的评测

$GSB=\frac{good-bad}{good+same+bad}$



场景：上线模型 A 和实验模型 B，评估 B 是否更优于 A

| <query,doc> | B 模型比 A 模型的提升 |
| ----------- | --------------------- |
| q1,d1       | Good                  |
| q2,d2       | Same                  |
| q3,d3       | Bad                   |
| q4,d4       | Bad                   |

$GSB=\frac{1-2}{1+1+2}=\frac{-1}{4}$ 不能上线
