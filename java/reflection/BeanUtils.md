BeanUtils 功能

1. 对 JavaBeans 的属性赋值。
2. 对 JavaBeans 的对象赋值。
3. 将 Map 集合的数据拷贝到一个 JavaBean 对象中。

依赖

```xml
<!-- https://mvnrepository.com/artifact/commons-beanutils/commons-beanutils -->
<dependency>
    <groupId>commons-beanutils</groupId>
    <artifactId>commons-beanutils</artifactId>
    <version>1.9.3</version>
</dependency>

or
<!-- https://mvnrepository.com/artifact/org.springframework/spring-beans -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-beans</artifactId>
    <version>5.2.2.RELEASE</version>
</dependency>

```



```java
import org.springframework.beans.BeanUtils;

// 对 JavaBeans 的属性赋值。
BeanUtils.setProperty(obj, "id", "1");

// 将 source 的属性值拷贝到 target 中
BeanUtils.copyProperties(source, target);

// 将 Map 集合的数据拷贝到一个 JavaBean 对象中
Map<String,Object> map = new HashMap<String,Object>();
//2.给一些参数
map.put("id", 2);
map.put("name", "EZ");
map.put("age", 22);
map.put("classID", 3);
map.put("birthday", new Date());
        
//需求：把 map 的属性值拷贝到S中
Student s = new Student();
BeanUtils.copyProperties(s, map);
```

