

[TOC]



# MyBatis 注解版

## 步骤

### 依赖

```xml
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.mybatis.spring.boot</groupId>
			<artifactId>mybatis-spring-boot-starter</artifactId>
			<version>2.0.1</version>
		</dependency>

		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>
```

mybatis-spring-boot-starter 引入依赖 jar
[图]

通过 druid 链接数据库：添加依赖
```xml
		<dependency>
			<groupId>com.alibaba</groupId>
			<artifactId>druid</artifactId>
			<version>1.0.13</version>
		</dependency>
```

### 替换DataSource

```java
import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DruidConfig {

    @ConfigurationProperties(prefix = "spring.datasource")
    @Bean
    public DataSource druid() {
        return new DruidDataSource();
    }
  
    // 配置 Druid 的监控
    // 1. 配置一个管理后台的 Servlet
    @Bean
    public ServletRegistrationBean statViewServlet() {
        ServletRegistrationBean bean = new ServletRegistrationBean(new StatViewServlet(), "/druid/*");
        Map<String, String> initParams = new HashMap<>();

        initParams.put("loginUsername", "admin");
        initParams.put("loginPassword", "123456");
        initParams.put("allow", "");// 默认允许所有访问.
        initParams.put("deny", "192.168.15.21");

        bean.setInitParameters(initParams);
        return bean;
    }


    // 2.配置一个web 监控的 filter
    @Bean
    public FilterRegistrationBean webStatFilter() {
        FilterRegistrationBean<Filter> bean = new FilterRegistrationBean<>();

        Map<String, String> initParams = new HashMap<>();
        initParams.put("exclusions", "*.js,*.css,/druid/*");

        bean.setInitParameters(initParams);
        bean.setUrlPatterns(Arrays.asList("/*"));
        return bean;
    }
}
```

### 配置链接字符串

```yml
spring:
  datasource:
    username: xueqiu
    password: snowball2010233
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://10.10.201.107:3306/snowball
    type: com.alibaba.druid.pool.DruidDataSource
```

### 创建 Bean 

```java
public class SearchSugg {
    private long id;
    private int type;
    private String symbol;
    private String query;
    private int weight;
    private String nicknames;
    private int state;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public String getNicknames() {
        return nicknames;
    }

    public void setNicknames(String nicknames) {
        this.nicknames = nicknames;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }
}

```

### 数据库增删改查

```java
import com.example.demo.bean.SearchSugg;
import org.apache.ibatis.annotations.*;

// 告诉MyBatis：这是一个操作数据库的 mapper
@Mapper
public interface SearchSuggMapper {

    @Select("select * from t_search_sugg where id=#{id}")
    SearchSugg getById(long id);

    @Delete("delete from t_search_sugg where id=#{id}")
    int delete(long id);


    // 将自动生成主键赋值给对象
    @Options(useGeneratedKeys = true,keyProperty = "id")
    @Insert("insert into t_search_sugg(type,symbol,query,weight,nicknames,state)values(#{type},#{symbol},#{query},#{weight},#{nicknames},#{state})")
    SearchSugg insert(SearchSugg searchSugg);

    @Update("update t_search_sugg set type=#{tupe},symbol=#{symbol},query=#{query},weight=${weight},nicknames=${nicknames},state=#{state} where id=#{id}")
    SearchSugg update(SearchSugg searchSugg);
}
```

通过MybatisAutoConfiguration 自动配置Mybatis。

通过MybatisProperties 映射Mybatis properties文件中的数据。

如果Bean 中字段名和数据表中字段名不一致，数据不能自动赋值。



**注意：要字符串拼接SQL，使用${}** 

```java
 @Select("select * from search_status_index where ${sql}")
    List<StatusIndexEntity> findBySql(@Param("sql") String sql);
```



### Controller

```java
import com.example.demo.bean.SearchSugg;
import com.example.demo.mapper.SearchSuggMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SearchSuggestController {

    @Autowired
    SearchSuggMapper searchSuggMapper;

    @GetMapping("/search/suggest/{id}")
    public SearchSugg get(@PathVariable("id") long id) {
        return searchSuggMapper.getById(id);
    }
}

```



## 扩展

### 下划线装驼峰

```java
import org.apache.ibatis.session.Configuration;
import org.mybatis.spring.boot.autoconfigure.ConfigurationCustomizer;
import org.springframework.context.annotation.Bean;

// 自定义MyBatis的配置规则;给容器中添加一个ConfigurationCustomizer;
//
@org.springframework.context.annotation.Configuration
public class MyBatisConfig {

    @Bean
    public ConfigurationCustomizer configurationCustomizer() {
        return new ConfigurationCustomizer() {
            @Override
            public void customize(Configuration configuration) {
                // 将数据库表字段从下划线转换为驼峰后,再映射到 Bean
                configuration.setMapUnderscoreToCamelCase(true);
            }
        };
    }
}
```

OR

```yaml
mybatis:
  configuration:
    map-underscore-to-camel-case: true
```

OR

```properties
 mybatis.configuration.mapUnderscoreToCamelCase=true
```

### 打印 mysql 日志

```properties
mybatis:
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

org.apache.ibatis.logging.stdout.StdOutImpl

sql 和执行结果都会打印。

log-impl 的其他选择：







## 通过 @MapperScan 替换 @Mapper

每一个mapper 类都加@Mapper 太麻烦。

```java
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// 使用 MapperScan 批量扫描所有的 Mapper 接口
@MapperScan(value = "com.example.demo.mapper")
@SpringBootApplication
public class SpringJdbcMybatisApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringJdbcMybatisApplication.class, args);
	}
}
```



# MyBatis 配置版

## 全局配置文件

mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>
</configuration>
```



## SQL映射文件

EmployeeMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.demo.mapper.EmployeeMapper">

    <select id="getById" resultType="com.example.demo.bean.Employee">
        select * from employee where id = #{id}
    </select>

    <insert id="insert">
        INSERT INTO employee(nickName)VALUES (#{nickName})
    </insert>
</mapper>
```

## 将上边两个文件注册到Mybatis

application.yml

```yml
mybatis:
  config-location: classpath:mybatis/mybatis-config.xml  # 指定全局配置文件的位置
  mapper-locations: classpath:mybatis/mapper/*.xml    # 指定 sql 映射文件的位置
```

## Mapper

由于有 @MapperScan，此处并没有@Mapper

```java
public interface EmployeeMapper {
    Employee getById(int id);

    void insert(Employee employee);
}
```

## Bean

```java
public class Employee {
    private int id;
    private String nickName;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }
}
```

