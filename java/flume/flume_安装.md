# 下载

下载地址：http://archive.apache.org/dist/flume/

```shell
# 解压
tar -zxvf apache-flume-1.9.0-bin.tar.gz

# 进入配置目录
cd apache-flume-1.9.0-bin/conf
echo $JAVA_HOME
mv flume-env.sh.template flume-env.sh
vi flume-env.sh
# 修改 export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_191.jdk/Contents/Home
```

安装完毕。

# 入门案例

需求：使用 Flume 监听一个端口，收集端口数据，并打印到控制台。

## netcat

安装 netcat（非必须）

```shell
brew install netcat
```

netcat 使用

服务端：nc -lk 44444