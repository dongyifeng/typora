[TOC]

# 索引字段部分更新

```java
UpdateResponse response = ESClientUtils.getClient().prepareUpdate("satus_v7","status",          "123456").setDoc(updateFieldMap).get(1000);
```

