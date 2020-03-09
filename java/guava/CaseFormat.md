com.google.common.base.CaseFormat 是一种实用工具类，以提供不同的ASCII字符格式之间的转换。



```java
@GwtCompatible
public enum CaseFormat {
```

**枚举常量**

| 枚举常量         | 说明                                                   |
| ---------------- | ------------------------------------------------------ |
| LOWER_CAMEL      | Java **变量**的命名规则：如：“lowerCamel”              |
| LOWER_HYPHEN     | 连字符连接变量的命名规则：如：“lower-hyphen”           |
| LOWER_UNDERSCORE | C++ 变量命名规则：如：“ lower_underscore ”             |
| UPPER_CAMEL      | Java 和 C++ **类**命名规则：如：“ LowerCamel ”         |
| UPPER_UNDERSCORE | Java 和 C++ **常量**命名规则：如：“ UPPER_UNDERSCORE ” |

**方法**

String to(CaseFormat format, String str) 最常用

| 方法                                                         |                                                  |
| ------------------------------------------------------------ | ------------------------------------------------ |
| Converter<String,String> converterTo(CaseFormat targetFormat) | 返回一个转换，从这个格式转换targetFormat字符串。 |
| String to(CaseFormat format, String str)                     | 从这一格式指定格式的指定字符串 str 转换。        |
| static CaseFormat valueOf(String name)                       | 返回此类型具有指定名称的枚举常量。               |
| static CaseFormat[] values()                                 | 返回一个包含该枚举类型的常量数组中的顺序被声明。 |

**case**

```java
import com.google.common.base.CaseFormat;

public class GuavaTester {
   public static void main(String args[]) {
        CaseFormatTest tester = new CaseFormatTest();
        tester.testCaseFormat();
    }

    private void testCaseFormat() {
        System.out.println(CaseFormat.LOWER_HYPHEN.to(CaseFormat.LOWER_CAMEL, "test-data"));
        System.out.println(CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, "test_data"));
        System.out.println(CaseFormat.UPPER_UNDERSCORE.to(CaseFormat.UPPER_CAMEL, "test_data"));
        
        System.out.println(CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, "testdata"));
        System.out.println(CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, "TestData"));
        System.out.println(CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_HYPHEN, "testData"));
    }
}
```

**结果**

```java
testData
testData
TestData
testdata
test_data
test-data
```