MGET 用来批量获取给定 key 对应的 value。

通过 mget 将多个 get 请求汇聚成一条命令，可以大大降低网络，rpc 协议解析的开销，从而大幅提升缓存效率。



Lettuce MGET 在跨 slot 时会经历：1. 拆分 --> 2. 发送 --> 3.合并

```java
@Override
public RedisFuture<List<KeyValue<K, V>>> mget(Iterable<K> keys) {
    //获取分区slot和key的映射关系
    Map<Integer, List<K>> partitioned = SlotHash.partition(codec, keys);
 
    //如果分区数小于2也就是只有一个分区即所有key都落在一个分区就直接获取
    if (partitioned.size() < 2) {
        return super.mget(keys);
    }
 
    //每个key与slot映射关系
    Map<K, Integer> slots = SlotHash.getSlots(partitioned);
    Map<Integer, RedisFuture<List<KeyValue<K, V>>>> executions = new HashMap<>();
 
    //遍历分片信息，逐个发送
    for (Map.Entry<Integer, List<K>> entry : partitioned.entrySet()) {
        RedisFuture<List<KeyValue<K, V>>> mget = super.mget(entry.getValue());
        executions.put(entry.getKey(), mget);
    }
 
    // restore order of key 恢复key的顺序
    return new PipelinedRedisFuture<>(executions, objectPipelinedRedisFuture -> {
        List<KeyValue<K, V>> result = new ArrayList<>();
        for (K opKey : keys) {
            int slot = slots.get(opKey);
 
            int position = partitioned.get(slot).indexOf(opKey);
            RedisFuture<List<KeyValue<K, V>>> listRedisFuture = executions.get(slot);
            result.add(MultiNodeExecution.execute(() -> listRedisFuture.get().get(position)));
        }
 
        return result;
    });
}
```

时间应该等于：分发耗时 + 多个server耗时 + 多个网络RT + 合并耗时



复杂度分析：

- get 复杂度：O(n)
- mget 复杂度：O(slot.size)



1.lettuce的mget是根据slot多次发送的

2.可以尝试把要mget的keys通过hashtag放到一个slot

3.可以尝试根据shard然后pipeline获取（[建议量50~1000](https://lettuce.io/core/release/reference/#_pipelining_and_command_flushing)）

4.减小mget的batch量（建议量小于100），多批次根据业务处理