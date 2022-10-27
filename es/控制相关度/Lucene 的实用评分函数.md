*实用评分函数（practical scoring function）*

```python
score(q,d)  =                  # 是文档 d 与查询 q 的相关度评分
            queryNorm(q)       # queryNorm(q) 是 查询归一化因子（新）
          · coord(q,d)         # 是 协调因子 （新）。
          · ∑ (                # 查询 `q` 中每个词 `t` 对于文档 `d` 的权重和。
                tf(t in d)     # 词 t 在文档 d 中的 词频 
              · idf(t)²        # 词 t 的 逆向文档频率 
              · t.getBoost()   # 是查询中使用的 boost（新）
              · norm(t,d)      # 是 字段长度归一值 ，与 索引时字段层 boost （如果存在）的和（新）
            ) (t in q)    
```

