

特征必须是离散型的。



OneHotEncoder 步骤：

1. fit：从训练集中生产每个维度类型集合。
2. transform：将数据One Hot Encoding。



编码的基础用法

```python
from sklearn.preprocessing import OneHotEncoder

# handle_unknown='ignore' 忽略在 fit 中没有见过的特征值
enc = OneHotEncoder(handle_unknown='ignore')

X = [['Male', 1], ['Female', 3], ['Female', 2]]
enc.fit(X)

print(enc.categories_)
# 输出每个维度所有特征值集合
# [array(['Female', 'Male'], dtype=object), array([1, 2, 3], dtype=object)]

# one-hot 编码
enc.transform([['Female', 1], ['Male', 4]]).toarray()
# 如果嫌fit 后在transform 麻烦，可以使用：enc.fit_transform(X)

# one-hot 解码
enc.inverse_transform([[0, 1, 1, 0, 0], [0, 0, 0, 1, 0]])
# 结果：array([['Male', 1],[None, 2]], dtype=object)
```



高级用法

训练数据第一列往往是标签列，OneHotE你从的可以跳过第一列

```python
# drop='first' 删除第一列
drop_enc = OneHotEncoder(drop='first').fit(X)
print(drop_enc.categories_)
# [array(['Female', 'Male'], dtype=object), array([1, 2, 3], dtype=object)]

drop_enc.transform([['Female', 1], ['Male', 2]]).toarray()
# 结果：array([[0., 0., 0.],[1., 1., 0.]])
```



对每一个维度只取前两个特征值

```python
drop_binary_enc = OneHotEncoder(drop='if_binary').fit(X)

drop_binary_enc.transform([['Female', 1], ['Male', 2]]).toarray()
# 结果为：array([[0., 1., 0., 0.],[1., 0., 1., 0.]]) 
```



参考：https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html