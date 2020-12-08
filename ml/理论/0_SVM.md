# 模型

$f(x_{test})=sign(w \cdot x_{test}+b)=sign(\sum_{i=1}^N a_i y_i x_i \cdot x_{test}+b)$

$w=\sum_{i=1}^N a_i y_i x_i$



## Kernal SVM 模型

将 x 通过 $\Phi(x)$ 映射到高位空间。

$f(x_{test})=sign(w \cdot \Phi(x_{test})+b)=sign(\sum_{i=1}^N a_i y_i \Phi(x_i) \cdot \Phi(x_{test})+b)$

令 $K(u,v)=\Phi(u) \cdot \Phi(v)$

$f(x_{test})=sign(w \cdot \Phi(x_{test})+b)=sign(\sum_{i=1}^N a_i y_i \Phi(x_i) \cdot \Phi(x_{test})+b)=sign(\sum_{i=1}^N a_i y_i K(x_i,x_{test})+b)$

- a 是拉格朗日系数。<font color=red>**对于非支持向量 a = 0，所以测试样本只需要与决策向量计算核函数的值。**</font>
- b 是截距

```python
from sklearn.datasets import make_blobs
from sklearn.svm import SVC
import matplotlib.pyplot as plt

X, y = make_blobs(n_samples=50, centers=2, random_state=0, cluster_std=0.6)

plt.scatter(X[:, 0], X[:, 1], c=y, s=50, cmap="rainbow")
plt.xticks([])
plt.yticks([])

plt.show()

clf = SVC(kernel="linear").fit(X, y)

# 支持向量
print("support_vectors_", clf.support_vectors_)
# 双系数：a_i * y_i 
print("dual_coef_", clf.dual_coef_)
# b 截距
print("intercept_", clf.intercept_)
```

决策函数：

$f(x_{test})=sign(\sum_{i=1}^k a_i y_i K(x_i,x_{test})+b)$

注意：

k 是支持向量个数

$x_i$ 是支持向量



Kernal SVM 模型参数

- 支持向量
- 系数：a_i * y_i 
- 截距：b 

### 常见的核函数



| 名称    | 含义       | 解决问题 | 核函数表达式                     | 参数gamma | 参数degree | 参数coef0 |
| ------- | ---------- | -------- | -------------------------------- | --------- | ---------- | --------- |
| linear  | 线性核     | 线性     | $K(x,y) = x^T \cdot = x \cdot y$ | No        | No         | No        |
| poly    | 多项式核   | 偏线性   | $K(x,y) =()$                     | Yes       | Yes        | Yes       |
| sigmoid | 双曲正切核 | 非线性   | $K(x,y) =$                       | Yes       | No         | Yes       |
| rbf     | 高斯径向核 | 偏非线性 | $K(x,y) =$                       | Yes       | No         | No        |



# Sklearn SVM

|            | 功能                                                         |
| ---------- | ------------------------------------------------------------ |
| 有监督学习 | 线性二分类与多分类（Linear Support Vector Classification）<br>非线性二分类与多分类（Support Vector Classification, SVC）<br>普通型连续变量的回归(Support Vector Regression)<br>概率型连续变量的回归( Bayesian SVM ) |
| 半监督学习 | 转导支持向量机（ Transductive Support Vector Machines,TSVM ） |
| 无监督学习 | 支持向量聚类( Support Vector Clustering,SVC )<br/>异常值检测( One-class SVM ) |



```python
class sklearn.svm.SVC(C=1.0, kernel=’rbf’, degree=3, gamma=’auto_deprecated’,
 coef0=0.0, shrinking=True, probability=False, tol=0.001, cache_size=200,   
 class_weight=None, verbose=False, max_iter=-1, decision_function_shape=’ovr’, 
 random_state=None)
```





## SVC 属性

| 属性             | 属性说明                                 |
| ---------------- | ---------------------------------------- |
| support_         | 返回支持向量的==索引==                   |
| support_vectors_ | 支持向量的索引及支持向量                 |
| n_support_       | 每一类中支持向量的个数                   |
| dual_coef_       | 决策函数中支持向量的系数                 |
| coef_            | 每一个特征被分配的权值，只在线性核中有效 |
| intercept_       | 决策函数中的偏置常量                     |

