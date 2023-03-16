---
typora-root-url: ../../../typora
---

[TOC]



面试官您好，我叫董一峰，来自河南安阳，我上一家公司是雪球财经，在公司我担任资深 Java 工程师的工作。主要从事搜索系统的架构和研发，了解搜索系统整体架构和流程，对搜索帖子、搜索股票、搜索用户等业务有深入了解。

在公司期间设计并开发了<font color=red>Query 的智能推荐</font>，这个项目架构是这样的：将股票信息、用户信息还有热门 Query 的数据进行处理，构建一颗前缀树，进行前缀搜索，然后用逻辑回归模型排序后返回用户。这个项目单机 QPS 150 左右，P99 耗时 1ms 以内，在搜索效果方面：我训练了逻辑回归模型，使第一个的点击率相对提升 35%。

我还参与了<font color=red>帖子搜索的优化：</font>**使用搜索的用户占日活比例由 2% 提升至 16%。第一页点击率由 10% 提升至 22%，搜索无结果率由 10% 降为 3%**。我们的优化路径是这样的：首先我将帖子搜索划分为三大场景单独优化：Query 是热门股票，Query 是普通股票，Query 是非股票（长尾 Query）。

<font color=red>针对 Query 是热门股票：</font>

- 提升帖子与股票的相关性，将<font color=red>相关性高</font>的帖子优先呈现给用户
- 优化 ES Function score 函数，将<font color=red>质量高</font>的帖子优先呈现给用户
- 对帖子的创建时间进行**指数衰减**，将<font color=red>时效性强</font>的帖子优先呈现给用户
- 采用多路召回丰富帖子搜索结果的多样性：插入股票的最新公告信息、股票最新事件、热门短贴
- 通过上线 **GDBT + LR 混合模型**排序，并引入个性化特征

针对 Query 是冷门股票：优化策略和Query 是热门股票 是一样的，但是使用了不同阈值。

<font color=red>针对长尾 Query：</font>

- 通用 **K-means + Word2vec** 对长尾 Query 语义聚类，了解用户意图、制定优化方向。
- 逆向分析友商搜索功能，抽象落地：引入同义词、根据词性、是否核心词等合理划分词权、**title/content BM25** 权重不同且分开召回

<font color=red>增加了兜底策略：</font>

- 将 DSL 中的  **must 命中优化为 should** 命中，使得搜索无结果率由 10% 降为 3%。

在需求我负责参与了其他其他项目：比如：

- 将 All-In-One 架构拆分为七大独立服务， 迭代更快，服务承载能力更强。
- 搭建预加载系统
- 构架大批量 ES 索引重建系统。

等等，就不在这里一一说明了。面试官你还有什么问题？



# 工作中使用的ES 功能？

<font color=red>ES 别名</font>

<font color=red>bool 查询</font>：工作用检索条件一般都有很多：

- 比如：去掉垃圾贴、去掉红包贴、去掉复盘贴。
- 为了保证帖子的时效性：会根据帖子创建的时间，进行一个<font color=red>范围查询</font>。
- 搜索词：帖子标题命中，帖子正文命中
- 如果 Query 与股票相关，还会匹配：帖子索引中存储的相关股票的字段。
- query 分析出同义词、扩展词，也会去尝试命中：标题和正文。

<font color=red>范围查询</font>

<font color=red>ES function score：自定义打分</font>，转、评、赞、收藏 加权打分，帖子来源：用户发帖、新闻、公告、各个业务系统自动生成的帖子。

		- 转、评、赞、收藏：log
		- 求和
		- 最大分值为 20

<font color=red>ES 指数衰减：</font>帖子创建时间，越新的帖子，分数越高。

- 线性函数：它是条直线
- exp 指数函数：<font color=red>它先剧烈衰减然后变的缓慢。</font>符合帖子特性，今天的帖子比昨天的帖子重要的多，昨天的帖子与前天或者大前天的天，差别不大。
- guass 高斯函数：它的衰减速率是先缓慢，然后变快，最后有放缓。

<font color=red>ES 聚合：</font> 统计是否是热门股票：根据这个股票下近期关联的帖子数。

<font color=red>滚动查询</font>：股票代码变更，需要批量迁移帖子，将帖子迁移到新的 code 下。

<font color=red>调用使用 ES 做  Query 推荐的方案：</font>

<font color=red>ES 飘红</font>：





[TOC]

# 工作中使用的 ES 做过哪些优化？

<font color=red>设计阶段</font>

- SDD 硬盘、64G 内存，CPU 多核
- 优化节点间的任务分布，尽量在同一个机房中。
- 将一半的内存交给 Lucene（ES 的 JVM 不要超过 32 G）
- 合理分片数和副本数：一个节点上最好不好超过 3 个分片。
- 冷热分离的架构设计。
- 通用最小化算法，能用更小的字段类型就用更小的，keyword 类型比 int 更快。
- 禁用 all 字段：all 字段包含所有字段分词后的 Term，作用是可以在搜索时不指定特定字段，从所有字段中检索，ES 6.0 之前需要手动关闭。
- 能不建倒排索引的字段就不建：比如：一些字段不作为检索用，只是作为粗排使用。
- 能建正排索引的字段就不建：比如：帖子正文，如果建了正排索引，用途不大，非常占空间。
- 索引使用 别名。



<font color=red>写优化</font>

- 如果不考虑搜索结果的实行性要求不高：
  - 加大 Translog Flush 的时间间隔，目的是降低 Iops、Writeblock
  - 增加 Index Refresh 间隔，目的是减少 Segment Merge 的次数
  - 增加 index Buffer 大小，本质也是减少 refresh 的时间间隔，因为导致 segment 文件创建的原因不仅有时间间隔，还有 buffer 空间的大小，写满了也会创建。默认最小值 48M < 堆空间的 10%（默认）< 默认最大限制
- 大批量的数据写入时，尽量控制在低检索请求的时间段，大批量的写入请求越集中越好。
- 调整 _source 字段，通过 include 和 exclude 过滤，查询的字段越少越好，过滤不必要的字段。
- 调整 Bulk 线程池和队列，每次批量数据 5–15 MB 大是个不错的起始点。



<font color=red>读优化</font>

- 数据预热
- 使用 filter 代替 query：filter 不计算相关度评分。
- 避免深度分页，避免分片数量过多，es 提供两种解决方案：scroll search 和 search after
- 调整 _source 字段，通过 include 和 exclude 过滤，查询的字段越少越好，过滤不必要的字段。



<img src="/images/es/WX20230302-113652@2x.png" style="zoom:33%;" />

# ES  聚合

类似 MySQL 中 group by 

聚合分类：

- 分桶聚合
- 指标聚合
- 管道聚合



聚合分析底层使用的 doc_values （正排）和 field_data 的数据结构，只有有正排索引的字段，才能聚合。



常用的查询函数：

- histogram：直方图 或者 柱状图
- percentile：百分位统计 或者 饼状图



<font color=red>分桶聚合</font>

个股页帖子个数：降序 Top 100

```json
GET status/_search
{
    // 查询结果
  "query":{
    "range":{
      "created_at":{
        "gte":11111111
      }
    }
  },
  // 在查询结果上，进行聚合
  "aggs": {
    "status_count": {
      "terms": {
        "field": "symbols",
         "size": 100,
         "order":{
           "_count":"desc"
         }
      }
    }
  },
  "size": 0
}
```

<img src="/images/tmp/WX20230315-113636.png" style="zoom:33%;" />





<font color=red>指标聚合</font>

- Avg 平均值
- Max 最大值
- Min 最小值
- Sum 求和
- Cardinality 基数（去重）
- Value Count 计数
- Stats 统计聚合
- Top Hits 聚合



例子：查询最贵或者最便宜的价格。

```json
GET status/_search
{
  "aggs": {
    "max_price": {
      "max": {
        "field": "price"
      }
    },
     "min_price": {
      "min": {
        "field": "price"
      }
    },
     "avg_price": {
      "avg": {
        "field": "price"
      }
    }
  },
  "size": 0
}

// 所有指标
GET status/_search
{
  "aggs": {
    "price_stats": {
      "stats": {
        "field": "price"
      }
    }
  },
  "size": 0
}

// 按照 symbol 去重
GET status/_search
{
  "aggs": {
    "symbol_count": {
      "cardinality": {
        "field": "symbols"
      }
    }
  },
  "size": 0
}
```



<font color=red>管道聚合</font>

概念：对聚合的结果二次聚合



```json
// 统计每个分类下的平均价格最低的商品分类
GET status/_search
{
  "aggs": {
    // 商品类型分桶
    "type_bucket": {
      "terms": {
        "field": "type.keyword"
      },
      // 计算每个桶里价格平均值：在什么结果上计算，就与谁平级
      "aggs":{
        "price_bucket":{
          "avg":{
            "field":"prince"
          }
        }
      }
    },
    // 获取每个桶里平均价格的最小值，在已经计算平均价格后的桶上，进行去最小值。
    "min_price_bucket":{
      "min_bucket":{
        "buckets_path":"type_bucket>price_bucket"
      }
    }
  },
  "size": 0
}
```



<font color=red>histogram：直方图 或者 柱状图</font>

```json
// 根据商品的价格区间，统计直方图
GET status/_search
{
  "aggs": {
    "price_hist": {
      "histogram": {
        "field": "price",
        "interval":1000,
        "min_doc_count":1
      }
    }
  },
  "size": 0
}

// 统计每日的发帖量
  //"fixed_interval":"1d",单位 ms、s、m、h、d
// calendar_interval: "day" "month" "year"
GET status/_search
{
  "aggs": {
    "status_date_hist": {
      "date_histogram": {
        "field": "created_at",
        "calendar_interval":"month",
        "format":"yyyy-MM-dd",
        // 统计范围
        "extended_bounds":{
          "min":"2022-01",
          "max":"2022-12"
        }
      }
    }
  },
  "size": 0
}
```

<font color=red>percentile：百分位统计 或者 饼状图</font>

```json
// 统计每个段的占比
GET status/_search
{
  "aggs": {
    "price_percentiles": {
      "percentiles": {
        "field": "price",
        "percents":[1,10,20,30,40,50,60,70,80,90,100]
      }
    }
  },
  "size": 0
} 

// 统计 P99,P80,P90
// 统计 0~80，0~90,0~99 每个段的占比
GET status/_search
{
  "aggs": {
    "price_percentiles": {
      "percentile_ranks": {
        "field": "price",
        "percents":[80,90,99]
      }
    }
  },
  "size": 0
} 
```



# ES 打分

**更改BM25 参数 k1 和 b 的值**：**只能在创建index的时候定义字段的similarity**.

```java
PUT /my_index
{
  "settings": {
    "similarity": {
      "my_bm25": {
        "type": "BM25",
        "b": 0.8,
        "k1": 1.5
      }
    }
  },
  "mappings": {
    "doc": {
      "properties": {
        "title": {
          "type": "text",
          "similarity": "my_bm25"
        }
      }
    }
  }
}
```





# Term 和 Match 的区别？

## term 和 match

term：搜索时，对搜索词<font color=red>不分词</font>

match：搜索时，对搜索词<font color=red>分词</font>



## term 和 keyword

Term：检索类型。

Keyword：字段类型。



# ES 支持哪些查询类型？

按语言划分

1. Query DSL：Domain Specific Language
2. Script：脚本查询（可编程语言，灵活度高，性能不如 DSL）
3. Aggregations：聚合查询
4. SQL 查询
5. EQL 查询

按场景划分



# ES 的开发模式和生产模式

- 开发模式：ES 启动时，没有引导检查。方便学习者快速上手。
- 生成模式：ES 启动时，有引导检查。避免一些不合理的配置，导致日后生产上更大的问题。

引导项检查的检查项：

- 堆的大小
- 文件描述检查
- 内存锁检查
- 最大线程数检查
- 最大文件大小检查

等等



# ES 模糊搜索

Fuzzy query

- 更改字符（box→fox）
- 删除字符（black→lack）
- 插入字符（sic→sick）
- 转置两个相邻字符（act→cat）
