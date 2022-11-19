[TOC]

# Httpd 简介

httpd是一个开源软件，且一般用作web服务器来使用。



httpd 的长连接功能

由于http是无状态的，且http是基于tcp协议的，因此http的建立必须要经过tcp的三次握手和四次断开，所以每当请求一个资源时，都会经过tcp的三次握手和四次断开，因此，如果进行多个请求时，这样比较浪费资源，而且请求速度比较慢。



所谓长连接就是客户端一直与http的80端口建立连接不断开，这样如果再有资源请求时，就不需要经过tcp的三次握手和四次断开了，客户端就可以通过之前已经建立好的连接继续请求资源，所以长连接可以增加访问请求的速度和节省带宽资源。一般我们在httpd的配置文件中需要设置关于长连接的一些参数，比如长连接请求的数目和长连接请求的时间，这样就可以避免在某个客户端一直占有该连接，其他客户端就无法与web服务器建立连接了。在http报文的header信息中，如果出现Connection：keep-alive这一行，表示这个httpd软件版本支持长连接的功能。



# 配置

查看版本

```shell
sudo apachectl －v
```



启动 apache 服务器

```shell
sudo apachectl start
```



http://locahost 查看是否启动

![](/Users/dongyifeng/doc/es/images/QQ20190715-140629@2x.jpg)

常用命令：

```shell
启动：sudo apachectl start
停止：sudo apachectl stop
重启：sudo apachectl restart
测试配置：sudo apachectl configtest
版本信息：sudo apachectl -v
```

目录：

文件目录：/Library/WebServer/Documents

服务器配置目录：/etc/apache2



前往：cd /etc/apache2

sudo vi httpd.conf

1. LoadModule php5_module libexec/apache2/libphp5.so 去掉 #

   允许运行 PHP 脚本

2. DocumentRoot 和 <Directory ""> 指定路径到，自己文件路径。

   注意：==apache 要求每一级目录具有执行权限，也就是 x。chmod 755 /usr/local/site==

3. 之后找到Options FollowSymLinks：修改为Options ==Indexes== FollowSymLinks

4. 修改：ServerName 为：ServerName 127.0.0.1:80

保存退出：wq



重启服务

```shell
sudo apachectl restart
```



浏览器访问：http://127.0.0.1/

![](/Users/dongyifeng/doc/spring_cloud/images/QQ20190715-140228.jpg)



其他需要使用文件地方直接访问：http://127.0.0.1/my_extra_word.dic