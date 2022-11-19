

JsonPath 解析 Json 数据，获取 Json 中的数据。



JsonPath 要点

- $ 文档的根元素。
- @ 表示文档的当前元素。
- .node_name 或者  [ 'node_name' ] 匹配下级节点
- [ index ] 检索数组中的元素
- [ start : end : step ] 支持数组切片
- \* 通配符，匹配所有成员。
- .. 子递归通配符，匹配成员的所有子元素。
- (<expr>)  使用表达式
- ?(<boolean expr>) 进行数据筛选  



# 示例

```python
{ "store": {
    "book": [ 
      { "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      { "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}
```

| JsonPath                                 | 结果                                             |
| ---------------------------------------- | ------------------------------------------------ |
| \$.store.book[*].author                  | 获取商店里所有书籍的作者                         |
| \$..author                               | 获取所有作者                                     |
| \$.store.*                               | 商店里的所有东西，都是一些书和一辆红色的自行车。 |
| \$.store..pirce                          | 商店里一切商品的价格                             |
| \$..book[2]                              | 第三本书                                         |
| \$..book[-1:]<br> \$..book[(@.length-1)] | 最后一本书                                       |
| \$..book[0,1]<br/> \$..book[:2]          | 前两本书                                         |
| $..book[?(@.isbn)]                       | 使用 isbn number 过滤所有书籍                    |
| $..book[?(@.price<10)]                   | 过滤所有便宜10以上的书籍                         |
| $..*                                     | XML 文档中的所有元素。JSON 结构的所有成员        |



Java mvn

```xml
  <dependency>
  		<groupId>com.jayway.jsonpath</groupId>
  		<artifactId>json-path</artifactId>
  		<version>2.4.0</version>
 </dependency>
```



Java 程序：

```java

import com.jayway.jsonpath.Configuration;  
import net.minidev.json.JSONArray;
import com.jayway.jsonpath.JsonPath;

	String json="{}";
	String path = "$.store.book[*].author";
  
  Object doc2 = Configuration.defaultConfiguration().jsonProvider().parse(json);
  Object value2 = JsonPath.read(doc2, path);
	JSONArray jsonArray1 = (net.minidev.json.JSONArray) value1;
```

