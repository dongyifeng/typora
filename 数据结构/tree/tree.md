[TOC]

# 二叉树基础

三个比较混淆的概念

- 节点的高度：节点到叶子节点的最长路径（边数）。
- 节点的深度：根节点到这个节点所经历的边的个数。
- 节点的层数：节点深度 + 1。
- 树的高度：根节点的高度。

![](../image/20191223180301.jpg)

生活中：

- ”高度“就是从下向上度量。
- ”层“ 从下向上度量，从 1 开始（楼层）。
- ”深度“就是：从上向下度量。

![](../image/20191223181935.jpg)

**满二叉树**：叶子节点都在最底层，并且每个节点都有左右两个子节点。（树 2）

**完全二叉树**：叶子节点都在最底两层，最后一层叶子节点靠左排列，且除了最后一层，其他层的节点个数都达到最大。（树 3）

## 二叉树的存储

1. 通过指针链式存储。
2. 通过数组顺序存储。

链式存储：比较常用。

![链式存储](../image/20191223193126.jpg)



![](../image/20191205222250.jpg)

顺序存储

根节点小标为 1，

左子节点：2 * i 

右子节点：2 * i + 1

父节点：i / 2

![](../image/20191223193242.jpg)



顺序存储非常适合完全二叉树，如果是非完全二叉树，比较浪费空间。

![](../image/20191223193642.jpg)

完全二叉树如果用链式存储，需要额外存储左右指针。

堆就是一个完全二叉树，最常用的存储方式就是数组。



# 二叉树遍历

二叉树遍历的时间复杂度：O(n)

```python
print("二叉树遍历")
class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None
'''
先序遍历
根 -> 左 —> 右
'''
def preorder(node):
    if node:
        print(node.data)
        preorder(node.left)
        preorder(node.right)


'''
中序遍历
左 -> 根 —> 右
'''
def inorder(node):
    if node:
        inorder(node.left)
        print(node.data)
        inorder(node.right)


'''
后序遍历
左 -> 右 —> 根
'''
def postorder(node):
    if node:
        postorder(node.left)
        postorder(node.right)
        print(node.data)
        
'''
层遍历
'''
def layerOrder(node):
    if node is Node: return
    queue = [node]
    while queue:
        t = queue.pop(0)
        print(t.data)
        if t.right: queue.append(t.right)
        if t.left: queue.append(t.left)

root = Node(5)
node1 = Node(6)
node2 = Node(7)
node3 = Node(8)

root.left = node1
root.right = node2
node1.left = node3

print("先序遍历")
preorder(root)
print("中序遍历")
inorder(root)
print("后序遍历")

postorder(root)
```

![](../image/20191223194027.jpg)

二叉树遍历：非递归实现

```python
'''
先序遍历：非递归实现
根 -> 左 —> 右
'''
def preorder(node):
    if node is None: return
    stack = [node]
    while stack:
        p = stack.pop(0)
        print(p.data)
        if p.left: stack.append(p.left)
        if p.right: stack.append(p.right)

'''
中序遍历：非递归实现
左 -> 根 —> 右
'''
def inorder(node):
    if node is None: return
    stack = []
    p = node
    while p or stack:
        # 从根节点开始，一直找它的左子树
        while p:
            stack.append(p)
            p = p.left
        # while结束表示当前节点node为空，即前一个节点没有左子树了
        p = stack.pop()
        print(p.data)
        # 开始查看它的右子树
        p = p.right
        
        
'''
后序遍历：非递归实现
左 -> 右 —> 根
'''
def postorder(node):
    if node is Node: return
    stack1 = [node]
    stack2 = []

    '''
    翻译后序遍历，将 print 存到 stack2 中
    '''
    while stack1:
        p = stack1.pop()
        if p.left: stack1.append(p.left)
        if p.right: stack1.append(p.right)
        stack2.append(p)

    while stack2:
        print(stack2.pop().data)
```

中序遍历非递归实现：

1. 将左路径所有节点压栈
2. node = stack.pop()，处理 node 节点，如果 node 有右子树，将 node 右子树的所有左路径节点压栈。

例子：

![](../image/20200106162210.jpg)

![](../image/20200106223141.jpg)

步骤：

1. 将根节点 5 ，的左子树压栈：stack_0
2. 节点_1 = stack.pop()，节点_1 没有右子树，继续 pop
3. 节点_2 = stack.pop()，节点_2 有右子树，将右子树的做路径上节点压栈：stack_3
4. 节点_3 = stack.pop()，节点_3 没有右子树，继续 pop
5. 节点_4 = stack.pop()，节点_3 没有右子树，继续 pop
6. 节点_5 = stack.pop()，节点_5 有右子树，将节点_6 压栈：stack_7
7. 节点_6 = stack.pop()，节点_6 有右子树，将节点_7 压栈：stack_9
8. 节点_7 = stack.pop()，节点遍历完毕，stack 为空，退出循环。

# 计算树的深度

递归实现

```python
def calcTreeDepth(root):
    if not root: return 0

    l_depth = calcTreeDepth(root.left) + 1
    r_depth = calcTreeDepth(root.right) + 1
    return max(l_depth, r_depth)
```

非递归实现

```python
# 层遍历思想
def maxDepth2(root):
    if not root: return 0
    res = 0
    stock = [root]
    while stock:
        tmp = []
        # 遍历一层
        for node in stock:
            if node.left: tmp.append(node.left)
            if node.right: tmp.append(node.right)
        stock = tmp
        res += 1

    return res
```

