[TOC]

## Installation

```shell
pip install bitarray
```

## 常用操作：

```python
from bitarray import bitarray

# create empty bitarray
a = bitarray()
a.append(True)
a.extend([False, True, True])

print(a)

# 初始化
a = bitarray(2)
b = bitarray("1001011")
c = bitarray([True, False, False, True, False, True, True])
# 调用 bool ，如果为True : 1,False : 0
d = bitarray([42, '', True, {}, 'foo', None])

print(a)
print("b:", b)
print(c)
print(d)

# counts occurrences of True (not 42): c.count(42) <==> c.count(True)
print(c.count(42))
print(c.count(False))

# removes first occurrence of False
b.remove("")
print(b)

# 切片
e = bitarray(50)
# 所有位置为 0
e.setall(False)
e[11:37:3] = 9 * bitarray(True)
print("e:", e)
# 删除
del e[12::3]
print("e:", e)
# 覆盖最右边6位。
e[-6:] = bitarray('10011')
print("e:", e)
# 在最右边拼接：000111
e += bitarray('000111')
print("e:", e)

print("e:", e[9:])

f = 20 * bitarray('0')
print(f)
f[1:15:3] = True
print("f", f)
```

