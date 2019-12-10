[TOC]

AC 自动机

Trie 树的多模式匹配算法

```python
class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        p = self.root
        for i in range(len(word)):
            if word[i] not in p.children:
                p.children[word[i]] = TrieNode()
            p = p.children[word[i]]
        p.data = word

    def find(self, pattern):
        p = self.root
        for i in range(len(pattern)):
            if pattern[i] not in p.children: return
            p = p.children[pattern[i]]
        return p.data

    def multi_match(self, text):
        res = []
        for i in range(len(text)):
            p = self.root
            for j in range(i, len(text)):
                if text[j] not in p.children: break
                p = p.children[text[j]]
                if p.data: res.append(p.data)

        return res

if __name__ == "__main__":
    trie = Trie()
    # 加载敏感词表
    trie.insert("格力")
    trie.insert("苹果")
    trie.insert("和服")

    text = "格力电器和苹果公司的商品和服务非常不错"
    print(trie.multi_match(text))
# 输出：['格力', '苹果', '和服']
```

基于 Trie 树这种处理方式，有点类似单模式串匹配的 BF 算法。单模式串匹配算法中，KMP 进入了 next 数组，让匹配失败时，尽可能将模式串往后多移动几位。

类似的 **AC 自动机就是在 Trie 树之上，加了类似 KMP 的 next 数组，只不过此处的 next 数组是构建在树上**。

