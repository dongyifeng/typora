

[TOC]

# BitMap

## 面试题

0 亿的数据（0~40 亿的区间）少了一条数据，限制在 1 G 的内存空间中，找出丢失的数据？



分析

假设我们是64 为系统，一个数字占 8 个字节，那么 40亿 * 8 byte = 32G 的空间。那么我们改如何存储这些数据？

如果使用 bitmap 来进行存储，40 亿 bit = $\frac{4000000000}{(8*1000*1024*1024.0) }= 0.48 G$ 的空间。

如何构建 bitmap ？

​		计算机表示数字是有上限的，最大是 8 个字节，64 个bit 位。我们无法创建一个含有 40 亿个 bit 位的数字。

​		如果使用字符串表示，1 个英文字符需要占用 1 个字节的空间，那么用 40 亿个字节来表示，需要 4 G的空间。（$\frac{4000000000}{(1000*1024*1024.0)}=3.8 G$）



​		我们可以换个思路，1 个数字拥有 64 个bit，那么我们可以将数字按照 64 的倍数进行划分，将 64 个数字表示到一个数字中。

​		我们可以定义一个数组结构，比如数字 50，由于 $\frac{50}{64}=0$ ，50 这个数划归到数组下标为 0 的元素里，但是下标为 0 对应的数据该赋值为多少呢？我们需要计算 50 对应第几个 bit 应该被设置为 1，对应的bit 位是 $ 50 \% 60 = 50$ ,我们只需要将这个数字对应的二进制 50 设置为 1。依次类推，如果数字是 64 ，那么被划归到下标为 1 的元素里，对应的二进制位就是 0。

```python
# max_value = 40 * 100000000
bitmap = [0]*( max_value/64 + 1)
bitmapIndex = value / 64
bitmapOffset = value % 64
bitmap[bitmapIndex] = bitmap[bitmapIndex] & 1 << bitmapOffset
```



## BitMap 代码

```python
class BitMap:
    def __init__(self, max_value):
        self.bitmap = [0] * (int(max_value / 64) + 1)

    def add(self, item):
        index, offset = self.getIndexOffset(item)
        self.bitmap[index] |= 1 << offset

    def remove(self, item):
        index, offset = self.getIndexOffset(item)
        self.bitmap[index] &= ~(1 << offset)

    def __contains__(self, item):
        index, offset = self.getIndexOffset(item)
        res = self.bitmap[index] & (1 << offset)
        return res != 0

    def getIndexOffset(self, item):
        return int(item / 64), item % 64

bitmap = BitMap(10)
bitmap.add(1)
bitmap.add(2)
bitmap.add(5)
bitmap.add(7)

print(1 in bitmap)
print(2 in bitmap)
print(3 in bitmap)
print(4 in bitmap)
print(5 in bitmap)
print(7 in bitmap)
```











