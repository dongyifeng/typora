安装（陈天奇）

```shell
brew install gcc@7
pip3 install xgboost
```

上边安装报错。

```python
brew install gcc@8
brew install libomp
```



测试安装是否成功

```python
import xgboost as xgb
```



流程：

![](images/20201027165450.jpg)

注意：使用 xgb 的读取数据的方法。