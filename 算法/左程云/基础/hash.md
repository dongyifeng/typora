# hash table





## 应用

> 设计 RandomPool 结构
>
> 设计一种结构，在该结构中有如下三种功能：
>
> Insert(key)：将某个 key 加入到该结构中，做到不重复加入。
>
> Delete(key)：将原本在结构中的某个 key 移除
>
> getRandom()：等概率随机返回结构中任何一个 key。
>
> 【要求】：Insert、delete 和 getRandom 方法的时间复杂度都是 O(1)  

注意：

1. getRandom 要求等概率返回任何一个key：我们可以使用 int(random.random() * (len(self.data))) 生成，一个随机数。因此需要维护一个 index 到 key 的map
2. 如果要删除的 key 的index 不是最后一个，这就导致 index 不连续，有空洞，getRandom 就需要重试多次。因此要向堆删除结点一样，先将最后一节的数据覆盖要删除的数据，然后删除最后一个节点（index 最大的节点：index = len(data) -1）



```python
import random

class RandomPool:
    def __init__(self):
        self.data = {}
        self.reverse = {}

    def insert(self, key):
        if key in self.data: return
        size = len(self.data)
        self.data[key] = size
        self.reverse[size] = key

    def delete(self, key):
        if key not in self.data: return
        index = self.data[key]

        size = len(self.data) - 1
        last_key = self.reverse[size]
        self.reverse[index] = last_key
        self.data[last_key] = index

        self.data.pop(key)
        self.reverse.pop(size)

    def get_random(self):
        index = int(random.random() * (len(self.data)))
        return self.reverse[index]


random_pool = RandomPool()

random_pool.insert("a")
random_pool.insert("b")
random_pool.insert("c")
random_pool.insert("d")
random_pool.insert("e")

res = {}
for i in range(100):
    key = random_pool.get_random()
    res[key] = res.get(key, 0) + 1
print(res)
```



# 布隆过滤器



## bitMap

一个 int 数字占 32 bit，我们可以使用 int [] 表示一个 bitMap。

```java
    // 32bit * 10 --> 320 bits
        int[] arr = new int[10];

        // 想取得第 178 个 bit 的状态
        int i = 178;

        // 先获取数组的下标
        int numIndex = 178 / 32;
        int bitIndex = 178 % 32;
        System.out.println("bitIndex:" + bitIndex);

        // 拿到 178 位的状态
        int s = ((arr[numIndex] >> (bitIndex)) & 1);
        // int s = ((arr[i / 32] >> (i % 32)) & 1);


        // 请将第 178 位的状态改为 1
        arr[numIndex] = arr[numIndex] | (1 << (bitIndex));

        // 请将第 178 位的状态改为 0
        arr[numIndex] = arr[numIndex] & (~(1 << (bitIndex)));
```





# 一致性 hash

