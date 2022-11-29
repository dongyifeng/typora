帖子索引拆分实践（RC）

# 一、结论

目前在rc进行简单测试的结论为：

索引拆分之后查询结果与单个大索引查询保持一致，并且对查询性能没有影响。

# 二、测试流程

#### 1、准备测试索引

以RC环境status_v12索引为例，首先创建status_v12+时间后缀的索引（附录1），并把别名指向status_v12_test。

将该索引按createdAt范围分别重建索引（附录2）到带时间后缀的新索引中。

执行："GET status_v12_test"，得到如下图：

![](/Users/dongyifeng/dongyf/git/typora/images/sb/33a8c645-1525-4a2e-9848-83a61cb51bd0.png)

#### 2、执行查询

因为status_v12没有存储帖子标题及正文的正排数据，所以没有办法模拟线上查询操作，只能用比较简单的查询条件来对比查询结果。

分别执行查询命令：

```Java
GET status_v12/_search

{

  "size": 1000, 

  "query": {

    "bool": {

      "must": [

        {

          "match": {

            "replyCount": 9

          }

        },

        {

          "match": {

            "followerCount": 10000

          }

        }

      ]

    }

  },

  "sort": [

    {

      "createdAt": {

        "order": "desc"

      }

    }

  ]

}
GET status_v12_test/_search

{

  "size": 1000, 

  "query": {

    "bool": {

      "must": [

        {

          "match": {

            "replyCount": 9

          }

        },

        {

          "match": {

            "followerCount": 10000

          }

        }

      ]

    }

  },

  "sort": [

    {

      "createdAt": {

        "order": "desc"

      }

    }

  ]

}
```

对比查询结果，保持一致。

#### 3、restHightClient测试

通过restHightClient连接rc集群，以"replyCount"为查询条件，通过random函数随机取值，循环1W次测试（测试代码为附录3和附录4）：

1、单线程

status_v12索引：

![](/Users/dongyifeng/dongyf/git/typora/images/sb/4e29c8f2-5aa7-472c-8ec4-c95b83b0acda.png)

 



status_v12_test索引：

![](/Users/dongyifeng/dongyf/git/typora/images/sb/c39ca076-8feb-4cb9-a293-192dc6daec7e.png)



2、并发10个线程同时请求（本机双核四线程）：

 status_v12索引：

![](/Users/dongyifeng/dongyf/git/typora/images/sb/9f6061e4-f625-4462-bc4a-75d7f8c22ae1.png)



status_v12_test索引：

![](/Users/dongyifeng/dongyf/git/typora/images/sb/5c3bfacb-2325-42e6-ba74-0213fce74c75.png)





结论：是对查询性能没有什么影响。

# 三、附录

#### 1、创建索引命令

```Java
PUT status_v12_2010

{

  "aliases": {

    "status_v12_test": {}

  }, 

  "mappings" : {

      "status" : {

        "dynamic" : "strict",

        "_all" : {

          "enabled" : false

        },

        "_source" : {

          "includes" : [

            "*"

          ],

          "excludes" : [

            "title",

            "content"

          ]

        },

        "properties" : {

          "allSymbols" : {

            "type" : "keyword"

          },

          "allSymbolsCharLength" : {

            "type" : "short"

          },

          "allSymbolsSize" : {

            "type" : "short"

          },

          "antiSpamState" : {

            "type" : "integer"

          },

          "content" : {

            "type" : "text",

            "analyzer" : "whitespace"

          },

          "contentLength" : {

            "type" : "integer"

          },

          "createdAt" : {

            "type" : "long"

          },

          "data" : {

            "type" : "text"

          },

          "favCount" : {

            "type" : "integer"

          },

          "flags" : {

            "type" : "keyword"

          },

          "followerCount" : {

            "type" : "integer"

          },

          "goodReplyCount" : {

            "type" : "integer"

          },

          "likeCount" : {

            "type" : "integer"

          },

          "nlpCategory" : {

            "type" : "nested",

            "properties" : {

              "name" : {

                "type" : "keyword"

              },

              "score" : {

                "type" : "double"

              }

            }

          },

          "nlpRelevance" : {

            "type" : "double"

          },

          "nlpStaticScore" : {

            "type" : "keyword"

          },

          "nlpSymbols" : {

            "type" : "nested",

            "properties" : {

              "name" : {

                "type" : "keyword"

              },

              "score" : {

                "type" : "double"

              }

            }

          },

          "nlpTopic" : {

            "type" : "nested",

            "properties" : {

              "name" : {

                "type" : "keyword"

              },

              "score" : {

                "type" : "double"

              }

            }

          },

          "replyCount" : {

            "type" : "integer"

          },

          "replyUserCount" : {

            "type" : "integer"

          },

          "retweetCount" : {

            "type" : "integer"

          },

          "retweetStatusId" : {

            "type" : "long"

          },

          "rewardMoney" : {

            "type" : "integer"

          },

          "rewardUserCount" : {

            "type" : "integer"

          },

          "sameStatusId" : {

            "type" : "long"

          },

          "simHashValue" : {

            "type" : "long"

          },

          "source" : {

            "type" : "keyword"

          },

          "staticScore" : {

            "type" : "double"

          },

          "statusId" : {

            "type" : "long"

          },

          "symbolAccessOrder" : {

            "type" : "integer"

          },

          "symbols" : {

            "type" : "keyword"

          },

          "tags" : {

            "type" : "keyword"

          },

          "textHash" : {

            "type" : "keyword"

          },

          "textSimHashGroup" : {

            "type" : "keyword"

          },

          "title" : {

            "type" : "text",

            "analyzer" : "whitespace"

          },

          "titleSymbols" : {

            "type" : "keyword"

          },

          "userId" : {

            "type" : "long"

          }

        }

      }

    },

    "settings" : {

      "index" : {

        "number_of_shards" : "5",

        "number_of_replicas" : "1"

        }

    }

}
```

#### 2、重建索引命令

```Java
POST _reindex?wait_for_completion=false

{

        "source": {

                "index": "status_v12",

                "query": {

                        "range": {

                                "createdAt": {

                                        "gte": 1262275200000,

                                        "lte": 1293811200000

                                }

                        }

                }

        },

        "dest": {

                "index": "status_v12_2010"

        }

}
```

#### 3、单线程测试代码

```Java
#单线程

static List<Long> latencyList = new ArrayList<>();



public static void main(String[] args) throws IOException {

    String hosts = "10.10.213.109,10.10.213.110,10.10.213.111";



    String[] clusterHosts = hosts.split(",");

    HttpHost[] httpHosts = new HttpHost[clusterHosts.length];

    for (int i = 0; i < clusterHosts.length; i++) {

        httpHosts[i] = new HttpHost(clusterHosts[i], 9200);

    }

    RestClientBuilder builder = RestClient.builder(httpHosts);





    RestHighLevelClient restHighLevelClient = new RestHighLevelClient(builder);



    for (int i = 0; i < 10000; i++) {

        request(restHighLevelClient, "status_v12_test");

    }

    Long latency = 0L;

    for (Long aLong : latencyList) {

        latency += aLong;

    }

    System.out.println("有返回结果的数量："+latencyList.size());

    System.out.println("平响："+(double)latency/latencyList.size());



}



public static void request(RestHighLevelClient restHighLevelClient, String indexName) throws IOException {



    Random random = new Random();

    TermQueryBuilder queryBuilder = QueryBuilders.termQuery("replyCount", random.nextInt(10000));



    SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();

    sourceBuilder

            .timeout(ESClient.LONG_TIME)

            .query(queryBuilder)

            .from(0)

            .size(1000)

            .sort(Constants.Status.CREATED_AT, SortOrder.DESC);

    SearchRequest request = new SearchRequest();

    //索引

    request.indices(indexName)

            .source(sourceBuilder)

            .searchType(SearchType.QUERY_THEN_FETCH)

            .preference("_local");

    Stopwatch started = Stopwatch.createStarted();

    SearchResponse response = restHighLevelClient.search(request, RequestOptions.DEFAULT);

    int length = response.getHits().getHits().length;

    long elapsed = started.elapsed(TimeUnit.MILLISECONDS);



    if(length!=0){

        System.out.println("latency:"+elapsed);

        latencyList.add(elapsed);

    }





}
```

#### 4、多线程测试代码

```Java
static List<Long> latencyList = new CopyOnWriteArrayList<>();



public static void main(String[] args) throws IOException, ExecutionException, InterruptedException {

    ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(10, 10, 0, TimeUnit.SECONDS, new ArrayBlockingQueue<>(10000));

    String hosts = "10.10.213.109,10.10.213.110,10.10.213.111";



    String[] clusterHosts = hosts.split(",");

    HttpHost[] httpHosts = new HttpHost[clusterHosts.length];

    for (int i = 0; i < clusterHosts.length; i++) {

        httpHosts[i] = new HttpHost(clusterHosts[i], 9200);

    }

    RestClientBuilder builder = RestClient.builder(httpHosts);



    RestHighLevelClient restHighLevelClient = new RestHighLevelClient(builder);



    List<Future<?>> futureList = new ArrayList<>();

    String indexName = "status_v12_test";

    for (int i = 0; i < 10000; i++) {

        futureList.add(threadPoolExecutor.submit(() -> request(restHighLevelClient, indexName)));

    }

    for (Future<?> future : futureList) {

        future.get();

    }



    Long latency = 0L;

    for (Long aLong : latencyList) {

        latency += aLong;

    }

    System.out.println("索引:"+indexName+",有返回结果的数量："+latencyList.size());

    System.out.println("索引:"+indexName+",平响："+(double)latency/latencyList.size());



}



public static void request(RestHighLevelClient restHighLevelClient, String indexName)  {



    Random random = new Random();

    TermQueryBuilder queryBuilder = QueryBuilders.termQuery("replyCount", random.nextInt(10000));



    SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();

    sourceBuilder

            .timeout(ESClient.LONG_TIME)

            .query(queryBuilder)

            .from(0)

            .size(1000)

            .sort(Constants.Status.CREATED_AT, SortOrder.DESC);

    SearchRequest request = new SearchRequest();

    //索引

    request.indices(indexName)

            .source(sourceBuilder)

            .searchType(SearchType.QUERY_THEN_FETCH)

            .preference("_local");

    Stopwatch started = Stopwatch.createStarted();

    SearchResponse response = null;

    try {

        response = restHighLevelClient.search(request, RequestOptions.DEFAULT);

    } catch (IOException e) {

    }

    int length = response.getHits().getHits().length;

    long elapsed = started.elapsed(TimeUnit.MILLISECONDS);



    if(length!=0){

        System.out.println("latency:"+elapsed);

        latencyList.add(elapsed);

    }





}
```

