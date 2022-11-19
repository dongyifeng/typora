#### 重做日志 redo log

redo log就是保存执行的SQL语句到一个指定的Log文件，当Mysql执行recovery时重新执行redo log记录的SQL操作即可。当客户端执行每条SQL（更新语句）时，redo log会被首先写入log buffer；当客户端执行COMMIT命令时，log buffer中的内容会被视情况刷新到磁盘。redo log在磁盘上作为一个独立的文件存在，即Innodb的log文件。主要是防止脏页数据没有刷到磁盘

#### 回滚日志 undo log

与redo log相反，undo log是为回滚而用，具体内容就是copy事务前的数据库内容（行）到undo buffer，在适合的时间把undo buffer中的内容刷新到磁盘。undo buffer与redo buffer一样，也是环形缓冲，但当缓冲满的时候，undo buffer中的内容会也会被刷新到磁盘；与redo log不同的是，磁盘上不存在单独的undo log文件，所有的undo log均存放在主ibd数据文件中（表空间），即使客户端设置了每表一个数据文件也是如此。

#### 二进制日志（binlog）

二进制日志(binlog)记录了数据库中所有的DDL和DML操作，但是不包括select语句，语句以“事件”的形式保存，记录了数据库的更改变化，在主从复制（replication）和数据恢复中起着重要的作用。

#### 错误日志（error log）

#### 慢查询日志（slow query log）

#### 一般查询日志（general log）

#### 中继日志（relay log）