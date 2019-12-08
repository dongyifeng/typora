![](image/20191205222250.jpg)

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

二叉搜索树（Binary Search Tree）

定义：

1. 根节点 > 左节点
2. 根节点 < 右节点

性质：

1. BST 中序遍历：结果是从小到大排列。

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, data):
        if not self.root:
            self.root = Node(data)
            return

        temp = self.root
        while temp:
            if data < temp.data:
                if temp.left:
                    temp = temp.left
                else:
                    temp.left = Node(data)
                    return
            else:
                if temp.right:
                    temp = temp.right
                else:
                    temp.right = Node(data)
                    return

    def get_max(self):
        temp = self.root
        while temp:
            if temp.right:
                temp = temp.right
            else:
                return temp.data

    def get_min(self):
        temp = self.root
        while temp:
            if temp.left:
                temp = temp.left
            else:
                return temp.data

    '''
    中序遍历：输出结果是升序
    '''
    def inorder(self, node):
        if node:
            self.inorder(node.left)
            print(node.data)
            self.inorder(node.right)
    '''
    depth = get_depth(left_sub_tree,right_sub_tree) + 1
    '''
    def get_depth(self, node):
        if not node:
            return 0
        left_h = self.get_depth(node.left)
        right_h = self.get_depth(node.right)
        return max(left_h, right_h) + 1


data = [6, 3, 8, 2, 5, 1, 7]
binarySearchTree = BinarySearchTree()
for item in data:
    binarySearchTree.insert(item)

binarySearchTree.inorder(binarySearchTree.root)
print(binarySearchTree.get_max())
print(binarySearchTree.get_min())
```



