[TOC]



# 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

JPA:ORM (Object Relational Mapping)

# 步骤

1. 编写一个实体类(bean)和数据表进行映射,并且配置好映射关系。

   ```java
   import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
   import javax.persistence.*;
   
   // 配置映射关系
   @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
   @Entity // 告诉 JPA 这是一个实体类(和数据表映射的类)
   @Table(name = "t_search_sugg")   // @Table 指定数据表,默认是类名小写
   public class SearchSuggest {
       @Id // 主键
       @GeneratedValue  // 自增策略
       private long id;
   
       @Column(name = "nicknames")
       private String nickNames;
   
       @Column // 默认列名就是属性名
       private String query;
   
       private int state;
   
       private String symbol;
   
       private int type;
   
       private int weight;
   
       public long getId() {
           return id;
       }
   
       public void setId(long id) {
           this.id = id;
       }
   
       public String getNickNames() {
           return nickNames;
       }
   
       public void setNickNames(String nickNames) {
           this.nickNames = nickNames;
       }
   
       public String getQuery() {
           return query;
       }
   
       public void setQuery(String query) {
           this.query = query;
       }
   
       public int getState() {
           return state;
       }
   
       public void setState(int state) {
           this.state = state;
       }
   
       public String getSymbol() {
           return symbol;
       }
   
       public void setSymbol(String symbol) {
           this.symbol = symbol;
       }
   
       public int getType() {
           return type;
       }
   
       public void setType(int type) {
           this.type = type;
       }
   
       public int getWeight() {
           return weight;
       }
   
       public void setWeight(int weight) {
           this.weight = weight;
       }
   
       public SearchSuggest() {
       }
   }
   ```

2. 编写一个Dao 接口来：增删改查（Respository）

   ```java
   import org.springframework.data.jpa.repository.JpaRepository;
   
   public interface SearchSuggestRepository extends JpaRepository<SearchSuggest, Long> {
   
   }
   ```

3. 基本的配置：jpaProperties

   ```properties
   spring: 
     jpa:
       hibernate:
         # 跟新或者创建数据库表结构
         ddl-auto: update
       # 控制台显示 SQL
       show-sql: true
   ```

4. Controller

   ```java
   @RestController
   public class SearchSuggestController {
       @Autowired
       SearchSuggestRepository searchSuggestRepository;
   
       @GetMapping("/search/suggest/{id}")
       public SearchSuggest get(@PathVariable("id") Long sid) {
           return searchSuggestRepository.getOne(sid);
       }
   
       @GetMapping("/search/suggest/save")
       public SearchSuggest save(SearchSuggest searchSuggest) {
           return searchSuggestRepository.save(searchSuggest);
       }
   }
   ```