proto 文件



client 获取返回对象后，序列化为 Json 工具。

maven 依赖

```xml
 <!-- https://mvnrepository.com/artifact/com.google.protobuf/protobuf-java-util -->
        <dependency>
            <groupId>com.google.protobuf</groupId>
            <artifactId>protobuf-java-util</artifactId>
            <version>3.7.1</version>
        </dependency>

<!-- https://mvnrepository.com/artifact/com.googlecode.protobuf-java-format/protobuf-java-format -->
        <dependency>
            <groupId>com.googlecode.protobuf-java-format</groupId>
            <artifactId>protobuf-java-format</artifactId>
            <version>1.4</version>
        </dependency>
```

Demo

```java
public class GRPCUtil {

    public static String get(GeneratedMessageV3 message) {
        try {
            final String json = JsonFormat.printer().print(message);
            return json;
        } catch (InvalidProtocolBufferException e) {
            e.printStackTrace();
        }
        return "";
    }
}

   @RequestMapping(value = "/stock/dividend_range")
    @ResponseBody
    public String getDividendsBySymbolRange(@RequestParam String symbol,
                                            @RequestParam long begin,
                                            @RequestParam long end) {
        DividendServiceGrpc.DividendServiceBlockingStub blockingStub = DividendServiceGrpc.newBlockingStub(channel);
        DividendOuterClass.DividendRequest request = DividendOuterClass.DividendRequest.newBuilder()
                .setSymbol(symbol).setBegin(begin).setEnd(end).build();
        return GRPCUtil.get(blockingStub
                .withDeadlineAfter(TIME_OUT, TimeUnit.MILLISECONDS)
                .getDividendsBySymbolRange(request));
    }
```

