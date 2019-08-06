[TOC]



# 简介

[ElasticSearch](https://www.elastic.co/cn/) 是目前全文搜索引擎的首选。

可以快速存储，搜索和分析数据。

ElasticSearch 特点：

1. 分布式搜索服务
2. Restful API
3. 底层基于Lucene
4. 采用多 shard（分片）的方式保证数据安全。
5. 提供自动resharding 的功能。

# 类型

与MySQL 对照理解

- 索引—数据库
- 类型— 表
- 文档 — 表中的记录
- 属性 — 列



# SpringBoot 整合ElasticSearch 

spring boot 支持两种方式操作ES

1. Jest（默认不生效）
2. Spring Data ElasticSearch
   1. Client：clusterNodes；clusterName
   2. ElaticsearchTemplate：
   3. Elaticssearch Repository：类似 JPA 的编程方式。

## 引入spring-boot-starter-data-elasticsearch

Jest 引入依赖

```xml
<dependency>
   <groupId>io.searchbox</groupId>
   <artifactId>jest</artifactId>
   <version>6.3.1</version>
</dependency>
```

配置

```properties
spring.elasticsearch.jest.uris=http://127.0.0.1:9200/
```

```java
public class Article {

    @JestId
    private int id;
    private String author;
    private String title;
    private String content;
```

操作

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class DemoApplicationTests {

    @Autowired
    JestClient jestClient;

    @Test
    public void contextLoads() throws IOException {
        Article article = new Article();
        article.setId(1);
        article.setTitle("Hello");
        article.setAuthor("zhangsan");
        article.setContent("haoxiaoxi");

        // 构建一个索引功能
        Index index = new Index.Builder(article)
                .index("weibo").type("doc").build();

        // 执行
        DocumentResult execute = jestClient.execute(index);
        System.out.println(execute.getJsonString());
    }

    @Test
    public void search() throws IOException {
        String json = "{\n" +
                "    \"query\": {\n" +
                "        \"match_all\": {}\n" +
                "    }\n" +
                "}";

        Search search = new Search.Builder(json).addIndex("weibo").addType("doc").build();
        SearchResult result = jestClient.execute(search);
        System.out.println("查询结果:"+result.getJsonString());
    }
}
```

Spring Data 引入

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

## 安装Spring Data 对应版本的ElasticSearch

## application.yml 配置

## Spring Boot 自动配置

### ElasticsearchRepository

### ElaticsearchTemplate

### Jest

# 测试ElasticSearch

