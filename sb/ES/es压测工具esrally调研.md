# 一、简介

esrally 是 elastic 官方开源的一款基于 python3 实现的针对 es 的压测工具，源码地址为https://github.com/elastic/rally，相关博客介绍在[这里](https://www.elastic.co/blog/announcing-rally-benchmarking-for-elasticsearch)。esrally主要功能如下：

- 自动创建、压测和销毁 es 集群

- 可分 es 版本管理压测数据和方案

- 完善的压测数据展示，支持不同压测之间的数据对比分析，也可以将数据存储到指定的es中进行二次分析

- 支持收集 JVM 详细信息，比如内存、GC等数据来定位性能问题

# 二、结论

rc环境的elasticsearch写入性能为30W docs/s。

但是term查询性能仅为680 ops/s，可能是压测任务配置不对或者指标理解不够深刻，改用https请求压测的方式，详情见[HTTP请求es压测](https://xueqiu.feishu.cn/wiki/wikcni5q05qZRX13UhnMfr4xFwf) 

# 三、测试流程

### 1、压测命令：

```undefined
esrally race --track=http_logs --target-hosts=10.10.213.109:9200,10.10.213.110:9200,10.10.213.111:9200 --pipeline=benchmark-only --challenge=append-no-conflicts
```

1）参数解析：

race：执行一次压测流程

--track=http_logs：使用http_log这个track进行压测，其他track参考https://github.com/elastic/rally-tracks

 --target-hosts=10.10.213.109:9200,10.10.213.110:9200,10.10.213.111:9200：压测机器地址

--pipeline=benchmark-only：远程集群压测方式

--challenge=append-no-conflicts：压测任务配置

1. challenge任务配置：

```undefined
{
        "name": "append-no-conflicts",
        "description": "Indexes the whole document corpus using Elasticsearch default settings. We only adjust the number of replicas as we benchmark a single node cluster and Rally will only start the benchmark if the cluster turns green. Document ids are unique so all index operations are append only. After that a couple of queries are run.",
        "default": true,
        "schedule": [{
                        "operation": "delete-index"
                },
                {
                        "operation": {
                                "operation-type": "create-index",
                                "settings": {
                                        {
                                                index_settings |
                                                        default ({}) | tojson
                                        }
                                }
                        }
                },
                {
                        "name": "check-cluster-health",
                        "operation": {
                                "operation-type": "cluster-health",
                                "index": "logs-*",
                                "request-params": {
                                        "wait_for_status": "{{cluster_health | default('green')}}",
                                        "wait_for_no_relocating_shards": "true"
                                },
                                "retry-until-success": true
                        }
                },
                {
                        "operation": "index-append",
                        "warmup-time-period": 240,
                        "clients": {
                                {
                                        bulk_indexing_clients |
                                                default (8)
                                }
                        },
                        "ignore-response-error-level": "{{error_level | default('non-fatal')}}"
                },
                {
                        "name": "refresh-after-index",
                        "operation": "refresh"
                },
                {
                        "operation": {
                                "operation-type": "force-merge",
                                "request-timeout": 7200
                        }
                },
                {
                        "name": "refresh-after-force-merge",
                        "operation": "refresh"
                },
                {
                        "name": "wait-until-merges-finish",
                        "operation": {
                                "operation-type": "index-stats",
                                "index": "_all",
                                "condition": {
                                        "path": "_all.total.merges.current",
                                        "expected-value": 0
                                },
                                "retry-until-success": true,
                                "include-in-reporting": false
                        }
                },
                {
                        "operation": "default",
                        "warmup-iterations": 500,
                        "iterations": 100,
                        "clients": 8,
                        "target-throughput": 100
                },
                {
                        "operation": "term",
                        "warmup-iterations": 500,
                        "iterations": 100,
                        "clients": 8
                },
                {
                        "operation": "range",
                        "warmup-iterations": 100,
                        "iterations": 100,
                        "target-throughput": 10
                },
                {
                        "operation": "hourly_agg",
                        "warmup-iterations": 100,
                        "iterations": 100,
                        "target-throughput": 20
                },
                {
                        "operation": "scroll",
                        "warmup-iterations": 100,
                        "iterations": 200,
                        "#COMMENT": "Throughput is considered per request. So we issue one scroll request per second which will retrieve 25 pages",
                        "target-throughput": 100
                }
        ]
}
```

可选配置:

- clients：(可选，默认为1):并发执行一个任务的客户端数量。

- warmup-iterations(可选，默认为0):每个客户机应该执行的迭代数，以预热候选基准测试。热身迭代不会显示在测量结果中。

- iterations (可选，默认为1):每个客户端执行的度量迭代的数量。命令行报告将根据这个数字自动调整百分位数(例如，如果您只运行5次迭代，您将不会得到99.9个百分位数，因为我们需要至少1000次迭代来精确地确定这个值)。

- ramp-up-time-period(可选，默认为0):Rally将逐步启动客户端。在指定时间段结束时达到客户端指定的数量(以秒为单位)。此属性还需要设置预热时间周期，它必须大于或等于预热时间。有关更多细节，请参阅ramp-up一节。

- warmup-time-period(可选，默认为0):Rally考虑的基准测试候选者预热的时间周期，以秒为单位。所有在热身过程中捕获的响应数据都不会显示在测量结果中。

- time-period(可选):Rally考虑测量的以秒为单位的时间段。注意，对于批量索引，通常不应该定义此时间段。拉力将只是批量索引所有的文件，并考虑每个样本后的预热时间周期作为测量样本。

- schedule(可选，默认为确定性的):为这个任务定义时间表，也就是说，它定义了在基准测试期间应该执行某个操作的时间点。例如，如果你指定了一个确定的调度和目标时间间隔为5(秒)，Rally将尝试在秒0,5,10,15 ... .执行相应的操作Rally支持确定性和泊松，但您可以定义自己的自定义时间表。

- target-throughput(可选):定义基准测试模式。如果没有定义，Rally将假设这是一个吞吐量基准，并将以尽可能快的速度运行任务。对于批处理风格的操作，这是最需要的，因为实现最佳吞吐量比获得可接受的延迟更重要。如果定义了它，它将指定所有客户端的每秒请求数。例如，如果你指定8个客户机的目标吞吐量为1000，这意味着每个客户机每秒将发出125(= 1000 / 8)个请求。总的来说，所有客户端每秒将发出1000个请求。如果Rally报告的吞吐量小于指定的吞吐量，那么Elasticsearch就无法到达它。

- target-interval(可选):这仅仅是1 / target-throughput(以秒为单位)，对于吞吐量小于每秒一个操作的情况可能更方便。

- completed-by(可选)：根据提供的任务名来结束并发的task，如果设置为any那么一旦有一个任务结束，整个schedule结束。假设有八个并发的相同任务，其中一个结束，另外7个结束。

- ignore-response-error-level(可选):当基准测试运行时，控制是否忽略任务执行过程中遇到的错误。唯一允许的值是非致命的，它结合cli选项——on-error=abort，将在任务执行期间忽略非致命错误

### 2、压测结果：

```undefined
|                                                         Metric |         Task |         Value |    Unit |
|---------------------------------------------------------------:|-------------:|--------------:|--------:|
|                     Cumulative indexing time of primary shards |              |    212.997    |     min |
|             Min cumulative indexing time across primary shards |              |      0        |     min |
|          Median cumulative indexing time across primary shards |              |      0        |     min |
|             Max cumulative indexing time across primary shards |              |     26.0469   |     min |
|            Cumulative indexing throttle time of primary shards |              |      0        |     min |
|    Min cumulative indexing throttle time across primary shards |              |      0        |     min |
| Median cumulative indexing throttle time across primary shards |              |      0        |     min |
|    Max cumulative indexing throttle time across primary shards |              |      0        |     min |
|                        Cumulative merge time of primary shards |              |    159.044    |     min |
|                       Cumulative merge count of primary shards |              |  10699        |         |
|                Min cumulative merge time across primary shards |              |      0        |     min |
|             Median cumulative merge time across primary shards |              |      0        |     min |
|                Max cumulative merge time across primary shards |              |     16.3502   |     min |
|               Cumulative merge throttle time of primary shards |              |     67.0906   |     min |
|       Min cumulative merge throttle time across primary shards |              |      0        |     min |
|    Median cumulative merge throttle time across primary shards |              |      0        |     min |
|       Max cumulative merge throttle time across primary shards |              |      9.20858  |     min |
|                      Cumulative refresh time of primary shards |              |     28.4676   |     min |
|                     Cumulative refresh count of primary shards |              |  86982        |         |
|              Min cumulative refresh time across primary shards |              |      0        |     min |
|           Median cumulative refresh time across primary shards |              |      0        |     min |
|              Max cumulative refresh time across primary shards |              |      6.1925   |     min |
|                        Cumulative flush time of primary shards |              |      2.56573  |     min |
|                       Cumulative flush count of primary shards |              |    423        |         |
|                Min cumulative flush time across primary shards |              |      0        |     min |
|             Median cumulative flush time across primary shards |              |      0        |     min |
|                Max cumulative flush time across primary shards |              |      0.406683 |     min |
|                                        Total Young Gen GC time |              |     23.227    |       s |
|                                       Total Young Gen GC count |              |    657        |         |
|                                          Total Old Gen GC time |              |      0        |       s |
|                                         Total Old Gen GC count |              |      0        |         |
|                                                     Store size |              |   1233.97     |      GB |
|                                                  Translog size |              |     16.8428   |      GB |
|                                         Heap used for segments |              |    739.674    |      MB |
|                                       Heap used for doc values |              |     13.5653   |      MB |
|                                            Heap used for terms |              |    583.587    |      MB |
|                                            Heap used for norms |              |      0.470947 |      MB |
|                                           Heap used for points |              |     54.9152   |      MB |
|                                    Heap used for stored fields |              |     87.1351   |      MB |
|                                                  Segment count |              |   3484        |         |
|                                    Total Ingest Pipeline count |              |      0        |         |
|                                     Total Ingest Pipeline time |              |      0        |       s |
|                                   Total Ingest Pipeline failed |              |      0        |         |
|                                                 Min Throughput | index-append | 302216        |  docs/s |
|                                                Mean Throughput | index-append | 315771        |  docs/s |
|                                              Median Throughput | index-append | 315870        |  docs/s |
|                                                 Max Throughput | index-append | 327013        |  docs/s |
|                                        50th percentile latency | index-append |    104.218    |      ms |
|                                        90th percentile latency | index-append |    174.588    |      ms |
|                                        99th percentile latency | index-append |    492.844    |      ms |
|                                      99.9th percentile latency | index-append |    905.927    |      ms |
|                                     99.99th percentile latency | index-append |   1373.43     |      ms |
|                                       100th percentile latency | index-append |   1545.91     |      ms |
|                                   50th percentile service time | index-append |    104.218    |      ms |
|                                   90th percentile service time | index-append |    174.588    |      ms |
|                                   99th percentile service time | index-append |    492.844    |      ms |
|                                 99.9th percentile service time | index-append |    905.927    |      ms |
|                                99.99th percentile service time | index-append |   1373.43     |      ms |
|                                  100th percentile service time | index-append |   1545.91     |      ms |
|                                                     error rate | index-append |      0        |       % |
|                                                 Min Throughput |      default |     16.38     |   ops/s |
|                                                Mean Throughput |      default |     16.42     |   ops/s |
|                                              Median Throughput |      default |     16.42     |   ops/s |
|                                                 Max Throughput |      default |     16.43     |   ops/s |
|                                        50th percentile latency |      default | 223944        |      ms |
|                                        90th percentile latency |      default | 240274        |      ms |
|                                        99th percentile latency |      default | 244213        |      ms |
|                                       100th percentile latency |      default | 245391        |      ms |
|                                   50th percentile service time |      default |    482.866    |      ms |
|                                   90th percentile service time |      default |    534.178    |      ms |
|                                   99th percentile service time |      default |    588.663    |      ms |
|                                  100th percentile service time |      default |    637.317    |      ms |
|                                                     error rate |      default |      0        |       % |
|                                                 Min Throughput |         term |    681.03     |   ops/s |
|                                                Mean Throughput |         term |    682.27     |   ops/s |
|                                              Median Throughput |         term |    682.27     |   ops/s |
|                                                 Max Throughput |         term |    683.51     |   ops/s |
|                                        50th percentile latency |         term |     10.0091   |      ms |
|                                        90th percentile latency |         term |     12.0111   |      ms |
|                                        99th percentile latency |         term |     14.157    |      ms |
|                                       100th percentile latency |         term |     18.1044   |      ms |
|                                   50th percentile service time |         term |     10.0091   |      ms |
|                                   90th percentile service time |         term |     12.0111   |      ms |
|                                   99th percentile service time |         term |     14.157    |      ms |
|                                  100th percentile service time |         term |     18.1044   |      ms |
|                                                     error rate |         term |      0        |       % |
|                                                 Min Throughput |        range |      1.36     |   ops/s |
|                                                Mean Throughput |        range |      1.36     |   ops/s |
|                                              Median Throughput |        range |      1.36     |   ops/s |
|                                                 Max Throughput |        range |      1.36     |   ops/s |
|                                        50th percentile latency |        range |  95546.9      |      ms |
|                                        90th percentile latency |        range | 120771        |      ms |
|                                        99th percentile latency |        range | 126364        |      ms |
|                                       100th percentile latency |        range | 126984        |      ms |
|                                   50th percentile service time |        range |    723.716    |      ms |
|                                   90th percentile service time |        range |    740.922    |      ms |
|                                   99th percentile service time |        range |    792.661    |      ms |
|                                  100th percentile service time |        range |   1106.41     |      ms |
|                                                     error rate |        range |      0        |       % |
|                                                 Min Throughput |   hourly_agg |      0.38     |   ops/s |
|                                                Mean Throughput |   hourly_agg |      0.38     |   ops/s |
|                                              Median Throughput |   hourly_agg |      0.38     |   ops/s |
|                                                 Max Throughput |   hourly_agg |      0.38     |   ops/s |
|                                        50th percentile latency |   hourly_agg | 389343        |      ms |
|                                        90th percentile latency |   hourly_agg | 491879        |      ms |
|                                        99th percentile latency |   hourly_agg | 514927        |      ms |
|                                       100th percentile latency |   hourly_agg | 517461        |      ms |
|                                   50th percentile service time |   hourly_agg |   2622.09     |      ms |
|                                   90th percentile service time |   hourly_agg |   2681.56     |      ms |
|                                   99th percentile service time |   hourly_agg |   2729.68     |      ms |
|                                  100th percentile service time |   hourly_agg |   2750.7      |      ms |
|                                                     error rate |   hourly_agg |      0        |       % |
|                                                 Min Throughput |       scroll |     50.97     | pages/s |
|                                                Mean Throughput |       scroll |     52.11     | pages/s |
|                                              Median Throughput |       scroll |     52.13     | pages/s |
|                                                 Max Throughput |       scroll |     53.05     | pages/s |
|                                        50th percentile latency |       scroll |  93982.7      |      ms |
|                                        90th percentile latency |       scroll | 129200        |      ms |
|                                        99th percentile latency |       scroll | 137371        |      ms |
|                                       100th percentile latency |       scroll | 138287        |      ms |
|                                   50th percentile service time |       scroll |    457.903    |      ms |
|                                   90th percentile service time |       scroll |    496.965    |      ms |
|                                   99th percentile service time |       scroll |    526.8      |      ms |
|                                  100th percentile service time |       scroll |    545.251    |      ms |
|                                                     error rate |       scroll |      0        |       % |
```

相关指标含义及评判标准参考[esrally压测指标含义](https://xueqiu.feishu.cn/wiki/wikcnMl9WnMjtDyH7R7AHkOMiLb) 

### 3、比对命令：

```undefined
esrally compare --baseline=d972381a-56a9-4752-82e9-76606659e794  --contender=412b95ce-fc63-4d27-9e66-922b532b5983
```

- d972381a-56a9-4752-82e9-76606659e794：term查询配置target-throughput为500，clients默认为1

- 412b95ce-fc63-4d27-9e66-922b532b5983：term查询配置target-throughput为空值，即不做限制，clients为8

1）对比结果：

```undefined
|                                                        Metric |         Task |      Baseline |     Contender |        Diff |    Unit |   Diff % |
|--------------------------------------------------------------:|-------------:|--------------:|--------------:|------------:|--------:|---------:|
|                    Cumulative indexing time of primary shards |              |    204.964    |    212.997    |     8.03278 |     min |   +3.92% |
|             Min cumulative indexing time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
|          Median cumulative indexing time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
|             Max cumulative indexing time across primary shard |              |     25.3376   |     26.0469   |     0.7093  |     min |   +2.80% |
|           Cumulative indexing throttle time of primary shards |              |      0        |      0        |     0       |     min |    0.00% |
|    Min cumulative indexing throttle time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
| Median cumulative indexing throttle time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
|    Max cumulative indexing throttle time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
|                       Cumulative merge time of primary shards |              |    151.824    |    159.044    |     7.21933 |     min |   +4.76% |
|                      Cumulative merge count of primary shards |              |   8418        |  10699        |  2281       |         |  +27.10% |
|                Min cumulative merge time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
|             Median cumulative merge time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
|                Max cumulative merge time across primary shard |              |     16.1951   |     16.3502   |     0.15513 |     min |   +0.96% |
|              Cumulative merge throttle time of primary shards |              |     68.7591   |     67.0906   |    -1.66855 |     min |   -2.43% |
|       Min cumulative merge throttle time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
|    Median cumulative merge throttle time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
|       Max cumulative merge throttle time across primary shard |              |      9.44797  |      9.20858  |    -0.23938 |     min |   -2.53% |
|                     Cumulative refresh time of primary shards |              |     24.5711   |     28.4676   |     3.89652 |     min |  +15.86% |
|                    Cumulative refresh count of primary shards |              |  63278        |  86982        | 23704       |         |  +37.46% |
|              Min cumulative refresh time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
|           Median cumulative refresh time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
|              Max cumulative refresh time across primary shard |              |      5.49485  |      6.1925   |     0.69765 |     min |  +12.70% |
|                       Cumulative flush time of primary shards |              |      2.74237  |      2.56573  |    -0.17663 |     min |   -6.44% |
|                      Cumulative flush count of primary shards |              |    418        |    423        |     5       |         |   +1.20% |
|                Min cumulative flush time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
|             Median cumulative flush time across primary shard |              |      0        |      0        |     0       |     min |    0.00% |
|                Max cumulative flush time across primary shard |              |      0.490083 |      0.406683 |    -0.0834  |     min |  -17.02% |
|                                       Total Young Gen GC time |              |     23.462    |     23.227    |    -0.235   |       s |   -1.00% |
|                                      Total Young Gen GC count |              |    657        |    657        |     0       |         |    0.00% |
|                                         Total Old Gen GC time |              |      0        |      0        |     0       |       s |    0.00% |
|                                        Total Old Gen GC count |              |      0        |      0        |     0       |         |    0.00% |
|                                                    Store size |              |   1234.3      |   1233.97     |    -0.32903 |      GB |   -0.03% |
|                                                 Translog size |              |     18.8333   |     16.8428   |    -1.99054 |      GB |  -10.57% |
|                                        Heap used for segments |              |    721.135    |    739.674    |    18.5395  |      MB |   +2.57% |
|                                      Heap used for doc values |              |     13.9455   |     13.5653   |    -0.38015 |      MB |   -2.73% |
|                                           Heap used for terms |              |    564.539    |    583.587    |    19.0483  |      MB |   +3.37% |
|                                           Heap used for norms |              |      0.470886 |      0.470947 |     6e-05   |      MB |   +0.01% |
|                                          Heap used for points |              |     54.9848   |     54.9152   |    -0.06959 |      MB |   -0.13% |
|                                   Heap used for stored fields |              |     87.1942   |     87.1351   |    -0.0591  |      MB |   -0.07% |
|                                                 Segment count |              |   3489        |   3484        |    -5       |         |   -0.14% |
|                                   Total Ingest Pipeline count |              |      0        |      0        |     0       |         |    0.00% |
|                                    Total Ingest Pipeline time |              |      0        |      0        |     0       |      ms |    0.00% |
|                                  Total Ingest Pipeline failed |              |      0        |      0        |     0       |         |    0.00% |
|                                                Min Throughput | index-append | 286137        | 302216        | 16079.7     |  docs/s |   +5.62% |
|                                               Mean Throughput | index-append | 301096        | 315771        | 14674.8     |  docs/s |   +4.87% |
|                                             Median Throughput | index-append | 298298        | 315870        | 17571.9     |  docs/s |   +5.89% |
|                                                Max Throughput | index-append | 319704        | 327013        |  7308.59    |  docs/s |   +2.29% |
|                                       50th percentile latency | index-append |    114.129    |    104.218    |    -9.91097 |      ms |   -8.68% |
|                                       90th percentile latency | index-append |    182.223    |    174.588    |    -7.63493 |      ms |   -4.19% |
|                                       99th percentile latency | index-append |    665.04     |    492.844    |  -172.195   |      ms |  -25.89% |
|                                     99.9th percentile latency | index-append |   1053.63     |    905.927    |  -147.704   |      ms |  -14.02% |
|                                    99.99th percentile latency | index-append |   1373.79     |   1373.43     |    -0.3605  |      ms |   -0.03% |
|                                      100th percentile latency | index-append |   1778.67     |   1545.91     |  -232.758   |      ms |  -13.09% |
|                                  50th percentile service time | index-append |    114.129    |    104.218    |    -9.91097 |      ms |   -8.68% |
|                                  90th percentile service time | index-append |    182.223    |    174.588    |    -7.63493 |      ms |   -4.19% |
|                                  99th percentile service time | index-append |    665.04     |    492.844    |  -172.195   |      ms |  -25.89% |
|                                99.9th percentile service time | index-append |   1053.63     |    905.927    |  -147.704   |      ms |  -14.02% |
|                               99.99th percentile service time | index-append |   1373.79     |   1373.43     |    -0.3605  |      ms |   -0.03% |
|                                 100th percentile service time | index-append |   1778.67     |   1545.91     |  -232.758   |      ms |  -13.09% |
|                                                    error rate | index-append |      0        |      0        |     0       |       % |    0.00% |
|                                                Min Throughput |      default |     16.3769   |     16.3768   |    -8e-05   |   ops/s |   -0.00% |
|                                               Mean Throughput |      default |     16.4053   |     16.4193   |     0.01399 |   ops/s |   +0.09% |
|                                             Median Throughput |      default |     16.4056   |     16.4194   |     0.01376 |   ops/s |   +0.08% |
|                                                Max Throughput |      default |     16.4168   |     16.431    |     0.01424 |   ops/s |   +0.09% |
|                                       50th percentile latency |      default | 224229        | 223944        |  -285.001   |      ms |   -0.13% |
|                                       90th percentile latency |      default | 240696        | 240274        |  -421.719   |      ms |   -0.18% |
|                                       99th percentile latency |      default | 244522        | 244213        |  -308.686   |      ms |   -0.13% |
|                                      100th percentile latency |      default | 245388        | 245391        |     2.86786 |      ms |    0.00% |
|                                  50th percentile service time |      default |    484.333    |    482.866    |    -1.46628 |      ms |   -0.30% |
|                                  90th percentile service time |      default |    536.802    |    534.178    |    -2.62357 |      ms |   -0.49% |
|                                  99th percentile service time |      default |    598.147    |    588.663    |    -9.48337 |      ms |   -1.59% |
|                                 100th percentile service time |      default |    646.398    |    637.317    |    -9.08066 |      ms |   -1.40% |
|                                                    error rate |      default |      0        |      0        |     0       |       % |    0.00% |
|                                                Min Throughput |         term |    499.26     |    681.032    |   181.772   |   ops/s |  +36.41% |
|                                               Mean Throughput |         term |    499.26     |    682.269    |   183.009   |   ops/s |  +36.66% |
|                                             Median Throughput |         term |    499.26     |    682.269    |   183.009   |   ops/s |  +36.66% |
|                                                Max Throughput |         term |    499.26     |    683.506    |   184.247   |   ops/s |  +36.90% |
|                                       50th percentile latency |         term |     12.0871   |     10.0091   |    -2.07804 |      ms |  -17.19% |
|                                       90th percentile latency |         term |     56.83     |     12.0111   |   -44.819   |      ms |  -78.86% |
|                                       99th percentile latency |         term |     95.7251   |     14.157    |   -81.568   |      ms |  -85.21% |
|                                      100th percentile latency |         term |     97.602    |     18.1044   |   -79.4976  |      ms |  -81.45% |
|                                  50th percentile service time |         term |     10.6197   |     10.0091   |    -0.61061 |      ms |   -5.75% |
|                                  90th percentile service time |         term |     12.5905   |     12.0111   |    -0.57939 |      ms |   -4.60% |
|                                  99th percentile service time |         term |     16.2026   |     14.157    |    -2.0456  |      ms |  -12.63% |
|                                 100th percentile service time |         term |     96.4937   |     18.1044   |   -78.3893  |      ms |  -81.24% |
|                                                    error rate |         term |      0        |      0        |     0       |       % |    0.00% |
|                                                Min Throughput |        range |      1.34533  |      1.3573   |     0.01197 |   ops/s |   +0.89% |
|                                               Mean Throughput |        range |      1.35217  |      1.36069  |     0.00852 |   ops/s |   +0.63% |
|                                             Median Throughput |        range |      1.35323  |      1.36071  |     0.00748 |   ops/s |   +0.55% |
|                                                Max Throughput |        range |      1.35638  |      1.36375  |     0.00738 |   ops/s |   +0.54% |
|                                       50th percentile latency |        range |  96241.9      |  95546.9      |  -694.95    |      ms |   -0.72% |
|                                       90th percentile latency |        range | 121284        | 120771        |  -512.189   |      ms |   -0.42% |
|                                       99th percentile latency |        range | 126955        | 126364        |  -591.156   |      ms |   -0.47% |
|                                      100th percentile latency |        range | 127570        | 126984        |  -585.285   |      ms |   -0.46% |
|                                  50th percentile service time |        range |    725.658    |    723.716    |    -1.94138 |      ms |   -0.27% |
|                                  90th percentile service time |        range |    743.31     |    740.922    |    -2.38724 |      ms |   -0.32% |
|                                  99th percentile service time |        range |    788.338    |    792.661    |     4.32342 |      ms |   +0.55% |
|                                 100th percentile service time |        range |    793.69     |   1106.41     |   312.72    |      ms |  +39.40% |
|                                                    error rate |        range |      0        |      0        |     0       |       % |    0.00% |
|                                                Min Throughput |   hourly_agg |      0.380926 |      0.378884 |    -0.00204 |   ops/s |   -0.54% |
|                                               Mean Throughput |   hourly_agg |      0.381105 |      0.379163 |    -0.00194 |   ops/s |   -0.51% |
|                                             Median Throughput |   hourly_agg |      0.381117 |      0.379168 |    -0.00195 |   ops/s |   -0.51% |
|                                                Max Throughput |   hourly_agg |      0.381216 |      0.379398 |    -0.00182 |   ops/s |   -0.48% |
|                                       50th percentile latency |   hourly_agg | 387388        | 389343        |  1955.24    |      ms |   +0.50% |
|                                       90th percentile latency |   hourly_agg | 489342        | 491879        |  2536.46    |      ms |   +0.52% |
|                                       99th percentile latency |   hourly_agg | 512138        | 514927        |  2788.34    |      ms |   +0.54% |
|                                      100th percentile latency |   hourly_agg | 514695        | 517461        |  2766.02    |      ms |   +0.54% |
|                                  50th percentile service time |   hourly_agg |   2612.09     |   2622.09     |    10.0056  |      ms |   +0.38% |
|                                  90th percentile service time |   hourly_agg |   2664.19     |   2681.56     |    17.3783  |      ms |   +0.65% |
|                                  99th percentile service time |   hourly_agg |   2732.18     |   2729.68     |    -2.49773 |      ms |   -0.09% |
|                                 100th percentile service time |   hourly_agg |   2755.61     |   2750.7      |    -4.91669 |      ms |   -0.18% |
|                                                    error rate |   hourly_agg |      0        |      0        |     0       |       % |    0.00% |
|                                                Min Throughput |       scroll |     53.5532   |     50.9651   |    -2.58802 | pages/s |   -4.83% |
|                                               Mean Throughput |       scroll |     53.9833   |     52.1087   |    -1.87463 | pages/s |   -3.47% |
|                                             Median Throughput |       scroll |     54.0308   |     52.1294   |    -1.90141 | pages/s |   -3.52% |
|                                                Max Throughput |       scroll |     54.1671   |     53.0464   |    -1.12075 | pages/s |   -2.07% |
|                                       50th percentile latency |       scroll |  90635.7      |  93982.7      |  3347.04    |      ms |   +3.69% |
|                                       90th percentile latency |       scroll | 126639        | 129200        |  2560.72    |      ms |   +2.02% |
|                                       99th percentile latency |       scroll | 134796        | 137371        |  2574.7     |      ms |   +1.91% |
|                                      100th percentile latency |       scroll | 135752        | 138287        |  2535.55    |      ms |   +1.87% |
|                                  50th percentile service time |       scroll |    454.639    |    457.903    |     3.26315 |      ms |   +0.72% |
|                                  90th percentile service time |       scroll |    487.118    |    496.965    |     9.84764 |      ms |   +2.02% |
|                                  99th percentile service time |       scroll |    514.925    |    526.8      |    11.8756  |      ms |   +2.31% |
|                                 100th percentile service time |       scroll |    525.954    |    545.251    |    19.2968  |      ms |   +3.67% |
|                                                    error rate |       scroll |      0        |      0        |     0       |       % |    0.00% |
```

# 参考文章：

[esrally.readthedocs.io](https://esrally.readthedocs.io/en/latest/track.html)

[Elasticsearch Benchmarks](https://elasticsearch-benchmarks.elastic.co/)

https://cloud.tencent.com/developer/article/1901555

[esrally 如何进行简单的自定义性能测试? - 墨天轮](https://www.modb.pro/db/324409)

[Elasticsearch - 压测方案之 esrally 简介_BigManing的博客-CSDN博客_esrally压测结果分析](https://blog.csdn.net/qq_27818541/article/details/116012717)