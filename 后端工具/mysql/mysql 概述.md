---
typora-root-url: ../../../typora
---

[TOC]

# MySQL 包含的模块

<img src="/images/mysql/WX20230317-181553@2x.png" style="zoom:50%;" />



# SQL 执行过程

1. 先将数据库中的旧值写入 Undo Log 中。

2. 新数据写入 Buffer Pool

3. 为了防止数据丢失，InnoDB 还会将数据写入 Redo Log Buffer。

4. InnoDB 定时将 Redo Log Buffer 数据写入磁盘。（如果服务器挂了，重启后将 Buffer Pool 没有刷到磁盘的日志，通过 Redo Log 刷进磁盘，从而保证数据的完整。）commit 命令写入 Redo Log 中，数据就算写完毕了。

   ```sql
   # Redo log 刷盘策略
   show variables like 'innodb_flush_log_at_trx_commit';
   # 默认值为 1，表示在事务更新前，都会将数据写入 Redo Log Buffer 中，并立即刷盘
   set global innodb_flush_log_at_trx_commit=1;
   
   # 数据写入 Redo Log Buffer ，每隔 1 秒钟将 Redo Log Buffer 写入 Page cache 并立即刷盘。
   set global innodb_flush_log_at_trx_commit=0;
   # 数据写入 Redo Log Buffer 和 Page cache，每隔 1 秒后刷盘
   set global innodb_flush_log_at_trx_commit=2;
   ```

   <img src="/images/mysql/WX20230317-195717@2x.png" style="zoom:33%;" />

5. 将操作写入 BigLog，供程序员：遍历历史查询、数据库备份和恢复、主从复制等功能。

6. 向Redo Log 写入 commit。至此数据写入完成。

7. InnoDB 定时将 Buffer Pool 中的数据写入磁盘。



<img src="/images/mysql/WX20230317-200505.png" style="zoom:33%;" />



将 Buffer Pool 中的数据写入磁盘过程：InnoDB 通过调用操作系统提供的 open + write 函数进行的。innoDB 没有使用 Page cache

<img src="/images/mysql/WX20230317-192616.png" style="zoom:33%;" />



# 存储结构



<img src="/images/mysql/WX20230317-204811@2x.png" style="zoom:50%;" />





# 执行原理



<img src="/images/mysql/WX20230317-212522@2x.png" style="zoom:33%;" />









<img src="/images/mysql/WX20230317-212648@2x.png" style="zoom:50%;" />