| 压测指标                                                     | 压测任务                       | 指标含义                               | 评判标准 |
| ------------------------------------------------------------ | ------------------------------ | -------------------------------------- | -------- |
| Cumulative indexing time of primary shards                   | -                              | 主分片累计索引时间                     | 越小越好 |
| Min cumulative indexing time across primary shard            | -                              | 跨分片累计索引最小时间                 | 越小越好 |
| Median cumulative indexing time across primary shard         | -                              | 跨分片累计索引中位时间                 | 越小越好 |
| Max cumulative indexing time across primary shard            | -                              | 跨分片累计索引最大时间                 | 越小越好 |
| Cumulative indexing throttle time of primary shards          | -                              | 主分片累计节流索引时间                 | 越小越好 |
| Min cumulative indexing throttle time across primary shard   | -                              | 跨分片累计节流最小索引时间             | 越小越好 |
| Median cumulative indexing throttle time across primary shard | -                              | 跨分片累计节流中位索引时间             | 越小越好 |
| Max cumulative indexing throttle time across primary shard   | -                              | 跨分片累计节流最大索引时间             | 越小越好 |
| Cumulative merge time of primary shards                      | -                              | 主分片累积合并时间                     | 越小越好 |
| Cumulative merge count of primary shards                     | -                              | 主分片累积合并次数                     | 越小越好 |
| Min cumulative merge time across primary shard               | -                              | 跨主分片累积最小合并时间               | 越小越好 |
| Median cumulative merge time across primary shard            | -                              | 跨主分片累积中位合并时间               | 越小越好 |
| Max cumulative merge time across primary shard               | -                              | 跨主分片累积最大合并时间               | 越小越好 |
| Cumulative merge throttle time of primary shards             | -                              | 主分片累计节流合并时间                 | 越小越好 |
| Min cumulative merge throttle time across primary shard      | -                              | 主分片累计节流最小合并时间             | 越小越好 |
| Median cumulative merge throttle time across primary shard   | -                              | 主分片累计节流中位合并时间             | 越小越好 |
| Max cumulative merge throttle time across primary shard      | -                              | 主分片累计节流最大合并时间             | 越小越好 |
| Cumulative refresh time of primary shards                    | -                              | 主分片累积refresh时间                  | 越小越好 |
| Cumulative refresh count of primary shards                   | -                              | 主分片累积refresh次数                  | 越小越好 |
| Min cumulative refresh time across primary shard             | -                              | 主分片累积最小refresh时间              | 越小越好 |
| Median cumulative refresh time across primary shard          | -                              | 主分片累积中位refresh时间              | 越小越好 |
| Max cumulative refresh time across primary shard             | -                              | 主分片累积最大refresh时间              | 越小越好 |
| Cumulative flush time of primary shards                      | -                              | 主分片累积flush时间                    | 越小越好 |
| Cumulative flush count of primary shards                     | -                              | 主分片累积flush次数                    | 越小越好 |
| Min cumulative flush time across primary shard               | -                              | 主分片累积最小flush时间                | 越小越好 |
| Median cumulative flush time across primary shard            | -                              | 主分片累积中位flush时间                | 越小越好 |
| Max cumulative flush time across primary shard               | -                              | 主分片累积最大flush时间                | 越小越好 |
| Total Young Gen GC time                                      | -                              | Young GC总时间                         | 越小越好 |
| Total Young Gen GC count                                     | -                              | Young GC总次数                         | 越小越好 |
| Total Old Gen GC time                                        | -                              | Old GC总时间                           | 越小越好 |
| Total Old Gen GC count                                       | -                              | Old GC总次数                           | 越小越好 |
| Store size                                                   | -                              | 存储大小                               | 越小越好 |
| Translog size                                                | -                              | Translog大小                           | 越小越好 |
| Heap used for segments                                       | -                              | segments使用的堆内内存                 | 越小越好 |
| Heap used for doc values                                     | -                              | doc values使用的堆内内存               | 越小越好 |
| Heap used for terms                                          | -                              | terms使用的堆内内存                    | 越小越好 |
| Heap used for norms                                          | -                              | norms使用的堆内内存                    | 越小越好 |
| Heap used for points                                         | -                              | points使用的堆内内存                   | 越小越好 |
| Heap used for stored fields                                  | -                              | stored fields使用的堆内内存            | 越小越好 |
| Segment count                                                | -                              | Segment数量                            | 越小越好 |
| Min Throughput                                               | index-append                   | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | index-append                   | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | index-append                   | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | index-append                   | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | index-append                   | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | index-append                   | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | index-append                   | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99.9th percentile latency                                    | index-append                   | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | index-append                   | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | index-append                   | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | index-append                   | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | index-append                   | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99.9th percentile service time                               | index-append                   | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | index-append                   | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | index-append                   | 错误率                                 | 越小越好 |
| Min Throughput                                               | index-stats                    | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | index-stats                    | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | index-stats                    | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | index-stats                    | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | index-stats                    | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | index-stats                    | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | index-stats                    | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99.9th percentile latency                                    | index-stats                    | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | index-stats                    | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | index-stats                    | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | index-stats                    | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | index-stats                    | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99.9th percentile service time                               | index-stats                    | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | index-stats                    | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | index-stats                    | 错误率                                 | 越小越好 |
| Min Throughput                                               | node-stats                     | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | node-stats                     | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | node-stats                     | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | node-stats                     | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | node-stats                     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | node-stats                     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | node-stats                     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99.9th percentile latency                                    | node-stats                     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | node-stats                     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | node-stats                     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | node-stats                     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | node-stats                     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99.9th percentile service time                               | node-stats                     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | node-stats                     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | node-stats                     | 错误率                                 | 越小越好 |
| Min Throughput                                               | default                        | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | default                        | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | default                        | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | default                        | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | default                        | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | default                        | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | default                        | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99.9th percentile latency                                    | default                        | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | default                        | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | default                        | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | default                        | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | default                        | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99.9th percentile service time                               | default                        | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | default                        | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | default                        | 错误率                                 | 越小越好 |
| Min Throughput                                               | term                           | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | term                           | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | term                           | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | term                           | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | term                           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | term                           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | term                           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99.9th percentile latency                                    | term                           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | term                           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | term                           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | term                           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | term                           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99.9th percentile service time                               | term                           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | term                           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | term                           | 错误率                                 | 越小越好 |
| Min Throughput                                               | phrase                         | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | phrase                         | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | phrase                         | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | phrase                         | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | phrase                         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | phrase                         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | phrase                         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99.9th percentile latency                                    | phrase                         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | phrase                         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | phrase                         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | phrase                         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | phrase                         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99.9th percentile service time                               | phrase                         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | phrase                         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | phrase                         | 错误率                                 | 越小越好 |
| Min Throughput                                               | country_agg_uncached           | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | country_agg_uncached           | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | country_agg_uncached           | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | country_agg_uncached           | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | country_agg_uncached           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | country_agg_uncached           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | country_agg_uncached           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | country_agg_uncached           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | country_agg_uncached           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | country_agg_uncached           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | country_agg_uncached           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | country_agg_uncached           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | country_agg_uncached           | 错误率                                 | 越小越好 |
| Min Throughput                                               | country_agg_cached             | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | country_agg_cached             | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | country_agg_cached             | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | country_agg_cached             | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | country_agg_cached             | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | country_agg_cached             | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | country_agg_cached             | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99.9th percentile latency                                    | country_agg_cached             | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | country_agg_cached             | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | country_agg_cached             | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | country_agg_cached             | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | country_agg_cached             | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99.9th percentile service time                               | country_agg_cached             | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | country_agg_cached             | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | country_agg_cached             | 错误率                                 | 越小越好 |
| Min Throughput                                               | scroll                         | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | scroll                         | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | scroll                         | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | scroll                         | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | scroll                         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | scroll                         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | scroll                         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | scroll                         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | scroll                         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | scroll                         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | scroll                         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | scroll                         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | scroll                         | 错误率                                 | 越小越好 |
| Min Throughput                                               | expression                     | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | expression                     | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | expression                     | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | expression                     | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | expression                     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | expression                     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | expression                     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | expression                     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | expression                     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | expression                     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | expression                     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | expression                     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | expression                     | 错误率                                 | 越小越好 |
| Min Throughput                                               | painless_static                | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | painless_static                | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | painless_static                | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | painless_static                | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | painless_static                | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | painless_static                | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | painless_static                | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | painless_static                | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | painless_static                | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | painless_static                | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | painless_static                | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | painless_static                | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | painless_static                | 错误率                                 | 越小越好 |
| Min Throughput                                               | painless_dynamic               | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | painless_dynamic               | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | painless_dynamic               | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | painless_dynamic               | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | painless_dynamic               | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | painless_dynamic               | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | painless_dynamic               | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | painless_dynamic               | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | painless_dynamic               | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | painless_dynamic               | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | painless_dynamic               | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | painless_dynamic               | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | painless_dynamic               | 错误率                                 | 越小越好 |
| Min Throughput                                               | decay_geo_gauss_function_score | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | decay_geo_gauss_function_score | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | decay_geo_gauss_function_score | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | decay_geo_gauss_function_score | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | decay_geo_gauss_function_score | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | decay_geo_gauss_function_score | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | decay_geo_gauss_function_score | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | decay_geo_gauss_function_score | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | decay_geo_gauss_function_score | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | decay_geo_gauss_function_score | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | decay_geo_gauss_function_score | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | decay_geo_gauss_function_score | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | decay_geo_gauss_function_score | 错误率                                 | 越小越好 |
| Min Throughput                                               | decay_geo_gauss_script_score   | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | decay_geo_gauss_script_score   | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | decay_geo_gauss_script_score   | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | decay_geo_gauss_script_score   | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | decay_geo_gauss_script_score   | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | decay_geo_gauss_script_score   | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | decay_geo_gauss_script_score   | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | decay_geo_gauss_script_score   | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | decay_geo_gauss_script_score   | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | decay_geo_gauss_script_score   | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | decay_geo_gauss_script_score   | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | decay_geo_gauss_script_score   | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | decay_geo_gauss_script_score   | 错误率                                 | 越小越好 |
| Min Throughput                                               | field_value_function_score     | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | field_value_function_score     | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | field_value_function_score     | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | field_value_function_score     | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | field_value_function_score     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | field_value_function_score     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | field_value_function_score     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | field_value_function_score     | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | field_value_function_score     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | field_value_function_score     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | field_value_function_score     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | field_value_function_score     | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | field_value_function_score     | 错误率                                 | 越小越好 |
| Min Throughput                                               | field_value_script_score       | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | field_value_script_score       | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | field_value_script_score       | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | field_value_script_score       | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | field_value_script_score       | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | field_value_script_score       | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | field_value_script_score       | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | field_value_script_score       | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | field_value_script_score       | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | field_value_script_score       | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | field_value_script_score       | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | field_value_script_score       | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | field_value_script_score       | 错误率                                 | 越小越好 |
| Min Throughput                                               | large_terms                    | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | large_terms                    | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | large_terms                    | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | large_terms                    | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | large_terms                    | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | large_terms                    | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | large_terms                    | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | large_terms                    | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | large_terms                    | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | large_terms                    | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | large_terms                    | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | large_terms                    | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | large_terms                    | 错误率                                 | 越小越好 |
| Min Throughput                                               | large_filtered_terms           | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | large_filtered_terms           | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | large_filtered_terms           | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | large_filtered_terms           | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | large_filtered_terms           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | large_filtered_terms           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | large_filtered_terms           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | large_filtered_terms           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | large_filtered_terms           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | large_filtered_terms           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | large_filtered_terms           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | large_filtered_terms           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | large_filtered_terms           | 错误率                                 | 越小越好 |
| Min Throughput                                               | large_prohibited_terms         | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | large_prohibited_terms         | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | large_prohibited_terms         | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | large_prohibited_terms         | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | large_prohibited_terms         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | large_prohibited_terms         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | large_prohibited_terms         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | large_prohibited_terms         | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | large_prohibited_terms         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | large_prohibited_terms         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | large_prohibited_terms         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | large_prohibited_terms         | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | large_prohibited_terms         | 错误率                                 | 越小越好 |
| Min Throughput                                               | desc_sort_population           | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | desc_sort_population           | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | desc_sort_population           | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | desc_sort_population           | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | desc_sort_population           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | desc_sort_population           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | desc_sort_population           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | desc_sort_population           | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | desc_sort_population           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | desc_sort_population           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | desc_sort_population           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | desc_sort_population           | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | desc_sort_population           | 错误率                                 | 越小越好 |
| Min Throughput                                               | asc_sort_population            | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | asc_sort_population            | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | asc_sort_population            | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | asc_sort_population            | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | asc_sort_population            | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | asc_sort_population            | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | asc_sort_population            | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | asc_sort_population            | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | asc_sort_population            | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | asc_sort_population            | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | asc_sort_population            | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | asc_sort_population            | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | asc_sort_population            | 错误率                                 | 越小越好 |
| Min Throughput                                               | asc_sort_with_after_population | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | asc_sort_with_after_population | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | asc_sort_with_after_population | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | asc_sort_with_after_population | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | asc_sort_with_after_population | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | asc_sort_with_after_population | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | asc_sort_with_after_population | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | asc_sort_with_after_population | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | asc_sort_with_after_population | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | asc_sort_with_after_population | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | asc_sort_with_after_population | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | asc_sort_with_after_population | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | asc_sort_with_after_population | 错误率                                 | 越小越好 |
| Min Throughput                                               | desc_sort_geonameid            | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | desc_sort_geonameid            | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | desc_sort_geonameid            | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | desc_sort_geonameid            | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | desc_sort_geonameid            | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | desc_sort_geonameid            | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | desc_sort_geonameid            | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | desc_sort_geonameid            | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | desc_sort_geonameid            | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | desc_sort_geonameid            | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | desc_sort_geonameid            | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | desc_sort_geonameid            | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | desc_sort_geonameid            | 错误率                                 | 越小越好 |
| Min Throughput                                               | desc_sort_with_after_geonameid | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | desc_sort_with_after_geonameid | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | desc_sort_with_after_geonameid | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | desc_sort_with_after_geonameid | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | desc_sort_with_after_geonameid | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | desc_sort_with_after_geonameid | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | desc_sort_with_after_geonameid | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | desc_sort_with_after_geonameid | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | desc_sort_with_after_geonameid | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | desc_sort_with_after_geonameid | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | desc_sort_with_after_geonameid | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | desc_sort_with_after_geonameid | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | desc_sort_with_after_geonameid | 错误率                                 | 越小越好 |
| Min Throughput                                               | asc_sort_geonameid             | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | asc_sort_geonameid             | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | asc_sort_geonameid             | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | asc_sort_geonameid             | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | asc_sort_geonameid             | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | asc_sort_geonameid             | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | asc_sort_geonameid             | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | asc_sort_geonameid             | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | asc_sort_geonameid             | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | asc_sort_geonameid             | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | asc_sort_geonameid             | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | asc_sort_geonameid             | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | asc_sort_geonameid             | 错误率                                 | 越小越好 |
| Min Throughput                                               | asc_sort_with_after_geonameid  | 最小吞吐率                             | 越大越好 |
| Mean Throughput                                              | asc_sort_with_after_geonameid  | 平均吞吐率                             | 越大越好 |
| Median Throughput                                            | asc_sort_with_after_geonameid  | 中位吞吐率                             | 越大越好 |
| Max Throughput                                               | asc_sort_with_after_geonameid  | 最大吞吐率                             | 越大越好 |
| 50th percentile latency                                      | asc_sort_with_after_geonameid  | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 90th percentile latency                                      | asc_sort_with_after_geonameid  | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 99th percentile latency                                      | asc_sort_with_after_geonameid  | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 100th percentile latency                                     | asc_sort_with_after_geonameid  | 提交请求和收到完整回复之间的时间段     | 越小越好 |
| 50th percentile service time                                 | asc_sort_with_after_geonameid  | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 90th percentile service time                                 | asc_sort_with_after_geonameid  | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 99th percentile service time                                 | asc_sort_with_after_geonameid  | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| 100th percentile service time                                | asc_sort_with_after_geonameid  | 请求处理开始和接收完整响应之间的时间段 | 越小越好 |
| error rate                                                   | asc_sort_with_after_geonameid  | 错误率                                 | 越小越好 |