# spring_boot 两种访问 ElasticSearch 方式

## Jest 访问ElasticSearch。

需要自己添加依赖

```xml
	<dependency>
			<groupId>io.searchbox</groupId>
			<artifactId>jest</artifactId>
			<version>6.3.1</version>
		</dependency>
```

配置连接集群

```properties
spring.elasticsearch.jest.uris=http://127.0.0.1:9200
```

```java
@Autowired
JestClient jestClient;

// index 创建索引
@Test
public void index() {
    Article article = new Article(1, "zhangsan", "title", "content");
    Index index = new Index.Builder(article).index("article").build();
    try {
        jestClient.execute(index);
    } catch (IOException e) {
        e.printStackTrace();
    }
}

// 搜索
@Test
public void testSearch() throws IOException {
    String json = "{ \"query\":{ \"match\":{ \"content\":\"hello\" } } }";
    System.out.println(json);
    Search search = new Search.Builder(json).addIndex("article").addType("_doc").build();
    SearchResult searchResult = jestClient.execute(search);
    System.out.println(searchResult.getJsonString());
}
```

官方文档：https://github.com/facebook/jest

## SpringData 访问 ElasticSearch。

1. ElasticSearchTemplate 访问。
2. ElasticSearchRepository 的子接口操作数据。

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

spring-boot-starter-data-elasticsearch 目前不支持ElasticSearch 7.x 

配置连接集群

```properties
spring.data.elasticsearch.cluster-name=elasticsearch
spring.data.elasticsearch.cluster-nodes=127.0.0.1:9300
```

@Document 指定index 和 type

```java
@Document(indexName = "article2",type = "_doc")
public class Article {
    private int id;
    private String author;
    private String title;
    private String content;
```

实现ElasticsearchRepository 接口

```java
public interface ArticleRepository extends ElasticsearchRepository<Article,Integer> {
      // 等值查询
    List<Article> findByAuthor(String author);

    // 模糊查询
    List<Article> findByAuthorLike(String author);
}
```

数据操作

```java
@Autowired
ArticleRepository articleRepository;

@Test
public void testIndex(){
    Article article = new Article(4, "lisi", "title", "content");
    Article index = articleRepository.index(article);
    System.out.println(index);
}
```

官方文档：https://github.com/spring-projects/spring-data-elasticsearch