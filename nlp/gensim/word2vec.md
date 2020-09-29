[TOC]

# 安装

```shell
pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple gensim
```



# Usage examples

```python
from gensim.models import word2vec

raw_sentences = ["There are more ways to train word vectors in Gensim than just Word2Vec",
                 "This module implements the word2vec family of algorithms, using highly optimized C routines, data streaming and Pythonic interfaces"]

sentences = [s.strip().split() for s in raw_sentences]

model = word2vec.Word2Vec(sentences, min_count=1)

print(model.similarity("word","Gensim"))

# 保存模型
model.save("word2vec.model")
# 加载模型
model = Word2Vec.load("word2vec.model")

```



# 数据准备

- 雪球帖子数据：1.3G，700838 条。
- 用户搜索 query：26M，1613488 条。
- 维基百科：1.2 G，372433 条。
- 智齿系统：用户反馈问题。
- 



## 帖子数据

评论数比较高的前：2000000 帖子

```mysql
SELECT id from snowball.status ORDER BY reply_count desc limit 2000000
```

帖子分词

```python
def seg(id):
    try:
        url = "http://10.10.212.17:8080/internal/word/analyzer/index/status.json?access_token=XqTest3966cb08f93c41a006e0acc0dc6aea9e17d1aebf&statusId=" + id
        response = requests.get(url, headers=headers)
        return json.loads(response.text)["content"]
    except Exception as err:
        print("raw_query", id, err)
```



## query

### 挖掘

从日志中挖掘：50.17

```shell
zgrep "controller comprehensive search's first part" production/*/logs/stdout.log* | grep "\"symbol\":\"\"" | grep -v "addSymbol" | awk -F"\q\":\"" '{ print substr($2,0,index($2,",")-2)  }' > query
```

### 分词

```shell
python3 -m jieba -d ' ' query > query.seg
```



## 维基百科

### 数据下载

https://dumps.wikimedia.org/zhwiki/20200901/

[zhwiki-20200901-pages-articles-multistream.xml.bz2](https://dumps.wikimedia.org/zhwiki/20200901/zhwiki-20200901-pages-articles-multistream.xml.bz2)



### 将 .xml.bz2 文件解析为纯文本

```python
from gensim.corpora import WikiCorpus

outp = "/Users/dongyf/dongyf/data/word2vec/wiki"
inp = "/Users/dongyf/dongyf/data/word2vec/zhwiki-20200901-pages-articles-multistream.xml.bz2"

output = open(outp, 'w')
wiki = WikiCorpus(inp, lemmatize=False, dictionary={})

i = 0
for text in wiki.get_texts():
    output.write(" ".join(text) + "\n")
    i = i + 1
    if i % 10000 == 0:
        print(i)
output.close()
```



### 中文：繁体转简体

安装 opencc

```shell
brew install opencc
```



转换

```shell
opencc -i wiki -o wiki.zh.chs -c t2s.json
```



### 分词

结巴分词

```shell
python3 -m jieba -d ' ' wiki.zh.chs > wiki.zh.seg
```



# 训练

```shell
nohup word2vec -train train_data -output vec_model -size 100 -window 5 -sample 1e-3 -negative 5 -hs 0 -binary 0 -cbow 1 -iter 5 &
```



# 预测

$similarity = cos(\theta) = \frac{A.B}{||A||\;||B||}=\frac{\sum_{i=0}^{n}A_i*B_i}{\sqrt{\sum_i{A_i^2}}*\sqrt{\sum_iB_i^2}}$





$similarity =\sum_i^{n}{max(query_i,knowledge_i)}$

