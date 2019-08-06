

# ElasticSearch JAVA API 有四类client 连接方式

1. TransportClient
2. RestClient
3. Jest
4. Spring Data Elasticsearch

TransportClient和RestClient是==Elasticsearch原生的api==。TransportClient可以支持2.x，5.x版本，TransportClient将会在==Elasticsearch 7.0弃用并在8.0中完成删除==，替而代之，我们使用Java High Level REST Client，它使用HTTP请求而不是Java序列化请求。

Jest是Java社区开发的，是Elasticsearch的Java Http Rest客户端；Spring Data Elasticsearch是spring集成的Elasticsearch开发包。



**建议**：TransportClient 将会在后面的版本中弃用，因此不推荐后续使用；而Jest由于是社区维护，所以更新有一定延迟，目前最新版对接ES6.3.1，近一个月只有四个issue，说明整体活跃度较低，因此也不推荐使用；Spring Data Elasticsearch主要是与Spring生态对接，可以在 web 系统中整合到 Spring 中使用。目前比较推荐使用官方的高阶、低阶Rest Client，官方维护，比较值得信赖。



参考Elasticsearch的 TransportClient API doc：https://www.elastic.co/guide/en/elasticsearch/client/java-api/current/index.html





参考文档：

https://www.cnblogs.com/swordfall/p/9981883.html