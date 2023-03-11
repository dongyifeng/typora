---
typora-root-url: ../../../typora
---

[TOC]

核心原理，对底层刷盘机制、集群分片机制都有深入理解，并对消息丢失和重复消费有对应的上线解决方案



# Kafka 数据丢失问题分别从 producer, broker, consumer 来回答



**producer 端需**要确保消息能够到达 Broker，并且实现消息的存储。

有可能会出现网络问题，导致消息发送失败。真对 producer 端通过两种方式来避免消息丢失

1. producer 默认是异步发送消息，将异步发送改为同步发送。这样 producer 就能实时知道消息发送的结果。
2. 添加异步回调的函数来监听消息发送的结果，如果发送失败，可以在回调中重试。
3. producer 本身提供了一个重试参数：retries，如果因为网络问题或者 Broker 故障导致发送失败，producer 会自动重试。



**broker 端**：需要确保 producer 发送过来的消息不会丢失。将消失持久化到磁盘。kafka 为了提供性能采用了异步批量刷盘的机制，按照一定的消息量和时间间隔去刷盘。刷盘的动作是有系统调度实现的，所以如果刷盘前系统崩溃了，就会导致数据丢失。kafka 并没有提供同步刷盘的机制，需要通过 Partition 的副本机制和 acks 机制来解决。



consumer 必须要能消费这个小：

只要 producer 和 broker 能得到保障，consumer 端是不太可能出现消息丢失的。除非consumer 没有消费完这个消息，就已经提交了 offset，但是即便是出现这样的情况，我们也是可以通过重新调整 offset 的值，进行消息的重放。



# MQ 是如何保证消息顺序性？



在 kafka 的架构里，用到了 partition 的分区机制，去实现消息的物理存储。在同一个 topic 里，来维护多个 partition，去实现消息的分片。生产者在发送消息时，会根据消息的 key 进行取模，来决定把当前消息发送到哪个 partition 里。消息是按照顺序存储到 partition 里面。

假设一个 topic 里面有三个partition，而消息被路由到三个独立的 partittion 里，然后有三个消费端，通过 balance 机制，去分别指派了对应的消费分区。



自定义

Kafka保证消息的有序性总结：生产者双端队列 –> 进入一个parttition–>进入一个消费者（同一个线程）–>进入一个cpu核心：保证有序性
