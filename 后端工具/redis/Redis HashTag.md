HashTag 机制可以影响 key 被分配到的 slot。



分片就是一个 hash 的过程：对 key 做 md5，sha1等 hash 算法，根据 hash 值分配到不同的机器上。



为了实现将不同的 key 分配到相同的机器上，就需要有相同的 hash 值（改变 hash 算法也行，但是不简单），使用相同的 key，不现实，因为不同的 key 有不同的用法，key 不能重名。



<font color=red>HashTag 允许用 key 的部分字符串来计算 hash 值。</font>

当一个 key 包含 {} 时，就不对整个 key 做hash，而仅对 {} 括号的字符串做 hash。

例如：

redis key： Search:user1:name 和 Search:user1:tweets 两个key，分配到同一台机器上，mget 时一次请求就可以获取数据。

将 redis key 改为：Search:{user1}:name 和 Search:{user1}:tweets ，其 hash 值都等于 sha1(user1)

```java
    private String getUserNameRedisKey(long uid) {
        return String.format("Search:%s:name:{%s}", uid, uid % 10);
    }
```



HastTag 配置

Hash Tag是用于hash的部分字符串开始和结束的标记，例如"{}"、"$$"等。

```yaml
beta:
  listen: 127.0.0.1:22122
  hash: fnv1a_64
  hash_tag: "{}"
  distribution: ketama
  auto_eject_hosts: false
  timeout: 400
  redis: true
  servers:
   - 127.0.0.1:6380:1 server1
   - 127.0.0.1:6381:1 server2
   - 127.0.0.1:6382:1 server3
   - 127.0.0.1:6383:1 server4
```









