# 位图(BitMap)



```python
class BitMap:
    def __init__(self, size):
        self.size = size
        self.data = 0

    # 新增
    def set(self, num):
        if num >= self.size or num < 0: return
        # 将 1 左移 num 位：1 —> 10,2 -> 100 ,3 -> 1000
        # 将 data 对应位 num 上值改为 1
        self.data |= 1 << num

    # 获取
    def get(self, num):
        if num > self.size or num < 0: return False
        # 判断 data num 位上的数据是否为 0
        return (self.data & 1 << num ) > 0


bit_map = BitMap(1000000)

bit_map.set(0)
bit_map.set(1)
bit_map.set(2)
bit_map.set(3)
bit_map.set(10)

print(bit_map.get(0))
print(bit_map.get(1))
print(bit_map.get(2))
print(bit_map.get(3))
print(bit_map.get(4))
print(bin(bit_map.data))
```

