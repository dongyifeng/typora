[TOC]

# 问题

钉钉群里经常反馈的问题。

| Badcase              | Target               |
| -------------------- | -------------------- |
| ![](images/byd1.png) | ![](images/byd2.png) |
|                      |                      |
|                      |                      |

原因：

sug 排序规则： query 与 symbol 全匹配优先级最高。



这条规则能否去掉？

不能。下图是 sug 第一位点击占比：81%。也就是这条规则解决了 81% 的问题，而上述问题就是剩下 19% 。

![](images/20200815105752.jpg)



怎么解决剩下 19% 的问题呢？

从上边的 badcase 总结经验

1. 近期更热的股票，排名更高。
2. 退市的股票，排名更低。

![](images/20200815111030.jpg)

绿色：在线系统已有排序因子。

红色：新增的排序因子。



怎么将这么多排序因子融入排序？

1. 产品规则：定义优先级。
2. 线性加权。



产品规则缺点

1. 容易规则冲突。
2. 线上代码逻辑复杂：各种规则堆砌。
3. 容易出现 bug。
4. 后期维护成本高：不易扩展。



线性加权

$$ score = w_1 * 是否全匹配 + w_2 * 匹配度 + w_3 * 粉丝数 + w_4 * 股票状态 + w_5 * 股票近期热度 $$

根据 socre 排序。

优点：

1. 在线代码简单，计算 score ，倒序。
2. 容易扩展，增减排序因子简单。

这种方式，在给帖子打分时也经常使用，比如：$score = 1*阅读数+ 2*点赞数 + 3*转发数 + 4*评论数+ 5*收藏数$



$[w_1,w_2,w_3,w_4,w_5]$ 怎么调权？

1. 拍脑袋。
2. 机器调权（LR）。

# LR

## 机器学习

**什么是机器学习？**

计算机<font color="red">**自动**</font>从<font color="red">**数据**</font>中发现<font color="red">**规律**</font>，并应用于<font color="red">**解决新问题**</font>。

- 跟定数据$(X_1,Y_1),(X_2,Y_2)...(X_n,Y_n)$ ，机器自动学习 X 和 Y 之间的关系，对于新 $X_i$ 能够预测 $Y_i$
  - 垃圾邮件识别：$(邮件_1,垃圾),(邮件_2,正常)...(邮件_n,垃圾)$
  - $邮件_x => 垃圾 or 正常 ?$
- 输入规则到输入数据。
- 从机器执行到机器决策。



**机器学习执行框架**

![](images/20200815115739.jpg)



**机器学习三要素**

- 模型
  - F(X) ：X -> Y 的映射
  - 问题的影响因素（特征）有哪些？它们之间的关系如何？
- 策略
  - 什么样的模型是好的模型。
  - 损失函数
- 算法
  - 如何高效的找到最优参数



## LR

Logistic Regression （ 逻辑回归 ）：用于二分类。

Y ：{ 0 , 1 }

- 1：发生（用户会点击）
- 0：不发生（用户不会点击）

目标：根据特征 x ，预测发生概率：$p( y |x)$

$p(y=1|x) = y $         $p(y=0|x) = 1 - y $  

### 模型

$y = f(wx) = \frac{1}{1+e^{-wx}}$

$ wx = w_1 * 是否全匹配 + w_2 * 匹配度 + w_3 * 粉丝数 + w_4 * 股票状态 + w_5 * 股票近期热度 $

![](images/sigmoid.jpg)



### 策略

假设：样本$(x_i,y_i)$ 独立

- 负对数似然

  $L(w) = -\sum_i{y_i*log(p(y_i=1|x_i,w))+(1-y_i)*log(p(y_i=0|x_i,w))}$

  $=-\sum_i{(y_i*log(f(wx_i))+(1-y_i)log(1-f(wx_i)))}$

$y_i \in \{0,1\}$ 

如果 $y_i = 0$，那么$ f(wx_i)$ , 越大越好。

如果 $y_i = 1$，那么$ 1 - f(wx_i)$ , 越大越好。

在数据集上，先 log 然后求和，越大越好。

### 算法

最小化负对数似然函数

$L(w) = -\sum_i{(y_i*log(f(wx_i))+(1-y_i)log(1-f(wx_i)))}$

这是一个凸优化问题，根据凸优化理论，经典数值优化算法：梯度下降法，牛顿法。

#### 梯度下降法

梯度

$\nabla L(w) = -\sum(y_i-f(wx_i))*x_i$



目标：最小化 L(w)

步骤：

1. 设置初始 w ，计算 L(w)

2. 计算梯度：$ d = \nabla L(w)$

   下降方向：$dir = -\nabla L(w) $

3. $w^{new} = w + dir$

4. 计算 $L(w^{new})$

5. 如果 $L(w^{new}) - F(w)$ 较小，停止；跳转到 2 。



计算梯度：

$f(wx) = \frac{1}{1+e^{-wx}}$

$$L(w)=-\sum_i{ ( y_i * log( f( wx_i )) + (1-y_i) log( 1-f(wx_i)))}$$

$=-\sum_i{ y_i log( \frac{1}{1+e^{ -wx_i }} )+(1-y_i)log( 1 - \frac{1}{1+e^{ -wx_i }} ) }$

$令 a = e^{-wx}$

$=-\sum_i{ y_i log( \frac{1}{1+a} )+(1-y_i)log( 1 - \frac{1}{1+a} ) }$

$=-\sum_i{ y_i log( \frac{1}{1+a} )+(1-y_i)log(\frac{a}{1+a} ) }$

$=-\sum_i{ y_i log( \frac{1}{1+a} )+log( \frac{a}{1+a} )-y_ilog( \frac{a}{1+a} ) }$

$=-\sum_i{ y_i [log( \frac{1}{1+a} )-log(\frac{a}{1+a})]+log( \frac{a}{1+a} ) }$

$=-\sum_i{ y_ilog( \frac{1}{a} )+log( \frac{a}{1+a} ) }$

$代入 a = e^{-wx}$

$=-\sum_i{ y_ilog( \frac{1}{e^{-wx_i}} )+log( \frac{e^{-wx_i}}{1+e^{-wx_i}} ) }$

$=-\sum_i{ y_i(wx_i)+log( \frac{1}{1+e^{wx_i}} ) }$

$=-\sum_i{ y_i(wx_i)-log(1+e^{wx_i}) }$

对 w 求导

$\nabla L(w) =-\sum_i{ y_ix_i-(\frac{1}{1+e^{wx_i}})*e^{wx_i}x_i) } $

$=-\sum_i{ x_i(y_i-\frac{1}{1+e^{wx_i}})}$

$=-\sum_i{ x_i(y_i-f(wx_i))}$

#### 牛顿法

Hession 矩阵：$\nabla \nabla L(w) = \sum_i {f(wx_i)(1-f(wx_i))x_ix_i^T }$

牛顿下降方向：$dir = (\nabla\nabla L(w))^{-1}(-\nabla L(w))$



## 正则化框架

![](images/20200816211617.jpg)

目的：为了得到更好的推广性能。控制模型复杂度。

奥卡姆剃刀：如无必要，勿增实体。

![](images/20200816212102.jpg)

正则化框架

$min L(w) + \lambda r(w)$

L(w) 为经验损失，越小表示训练数据上拟合程度越高。

$\lambda $：这种因子

r(w)：正则化项，越小表示模型复杂度越小。



常用的正则化项

- L1 范数正则：$||w||_1=\sum_i|w_i|$
- L2 范数正则：$w^2=\sum_iw_i^2$
- Lp 范数正则：$||w||_P=\sum_i|w_i|^P$



# 工程实现

![](images/20200815115739.jpg)

## 离线训练

目标：根据用户点击数据，训练 LR 模型，在线预估用户对 sug 点击率，根据点击率排序。 

### 准备训练数据

$ score = w_1 * 是否全匹配 + w_2 * 匹配度 + w_3 * 粉丝数 + w_4 * 股票状态 + w_5 * 股票近期热度 $

$(X_1,Y_1),(X_2,Y_2)...(X_n,Y_n)$

例子：

X1 = [ 是否全匹配, 匹配度，粉丝数，股票状态，股票近期热度 ]

Y1 = {1,0} 

- 1：用户点击
- 0：没有点击

用户 sug 点击日志

```mysql
SELECT REGEXP_EXTRACT(extend0,'input":"?([^,"|}]+)',1) AS input,
REGEXP_EXTRACT(extend0,'query":"?([^,"|}]+)',1) AS query,
REGEXP_EXTRACT(extend0,'rank":"?([^,"|}]+)',1) AS rank
FROM web_mobile.user_behavior
WHERE ds LIKE '20200609%'
  AND page_id = 2200
  AND component_type =19
  AND extend0 like '%input%'
```



缺少展示数据（之前没有记录）

分析：线上 sug 没有个性化，相同的 query 在返回的是相同的内容。

通过逆向功能生成展示数据：

```python
# sug 接口 ( 是否全匹配，匹配度，分数数 )
http://10.10.33.23:8080/query/v1/suggest?q=

# 股票接口（股票状态）
http://api.inter.xueqiu.com/internal/v5/stock/batch/quote.json?symbol=
  
# 股票近期热度(股票覆盖度不够，不可以使用)
http://stock.xueqiu.com/v5/stock/screener/quote/list.json?order=desc&order_by=value&page=1&size=100&type=hot_1h&_=1586418778761&x=0.500
```

股票近期热度

```mysql
 WITH t as
  ( SELECT REGEXP_EXTRACT(extend0,'symbol":"?([^,"|}]+)',1) AS `symbol`
   FROM web_mobile.user_behavior
   WHERE ds LIKE '20200617%'
     AND page_id = 1600
     AND component_type =1)
SELECT `symbol`,
       count(1) AS c
FROM t
GROUP BY `symbol`
```

### 模型训练

训练模型

```python
from sklearn.linear_model import LogisticRegression as LR

class SugRank:
    def __init__(self):
        self.model = LR(penalty="l2", solver="liblinear", C=0.2, max_iter=1000)
    
    def train(self, fileName):
        x = []
        y = []
        feature_selector = set(range(100)) - set([])

        for line in open(fileName, "r"):
            try:
                data = line.strip().split(",")
                y.append(int(data[0]))
                x_feature = [float(data[i]) for i in range(1, len(data)) if i in feature_selector] 
                x.append(x_feature)
            except Exception as e:
                print("load data:", line, e)
        self.model = self.model.fit(x, y)
        self.w = self.model.coef_[0]
        self.b = self.model.intercept_[0]
```



交叉验证

```python
from sklearn.linear_model import LogisticRegression as LR
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 绘图
import numpy as np
import matplotlib.pyplot as plt


l1_train = []
l2_train = []
l1_test = []
l2_test = []

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.1, random_state=300)

# np.linspace(起始数，终止数，个数)
# np.linspace(0.05,1,19)：[0.05,1] 均匀生成19个数
for i in np.linspace(0.05, 1, 19):
    lrl1 = LR(penalty="l1", solver="liblinear", C=i, max_iter=1000)
    lrl2 = LR(penalty="l2", solver="liblinear", C=i, max_iter=1000)

    lrl1 = lrl1.fit(x_train, y_train)
    l1_train.append(accuracy_score(lrl1.predict(x_train), y_train))
    l1_test.append(accuracy_score(lrl1.predict(x_test), y_test))

    lrl2 = lrl2.fit(x_train, y_train)
    l2_train.append(accuracy_score(lrl2.predict(x_train), y_train))
    l2_test.append(accuracy_score(lrl2.predict(x_test), y_test))

graph = [l1_train, l2_train, l1_test, l2_test]
color = ["green", "black", "yellow", "red"]
label = ["l1_train", "l2_train", "l1_test", "l2_test"]

# 6*6 的画布
plt.figure(figsize=(6, 6))
for i in range(len(graph)):
    plt.plot(np.linspace(0.05, 1, 19), graph[i], color[i], label=label[i])

plt.legend(loc=4)
plt.show()
```

![](images/20200816220752.jpg)

效果：比猜略微好。



新增特征：sug 召回位置。

![](images/87.png)

新增特征：query 下 stock 的点击率

![](images/image2020-6-30_15-26-29.png)

## 在线排序

在线系统架构图

![](images/image2020-6-30_14-13-59.png)



特征工程

![](images/image2020-6-30_15-24-56.png)

智能排序

![](images/image2020-6-30_15-31-26.png)

