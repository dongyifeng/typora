```shell
# 日历
cal 

wc suggest_stock
#.  行      单词数   字节数    文件
#   16865  562216 26878428 suggest_stock

# 只看行数
wc -l suggest_stock

# 只看单词数
wc -w suggest_stock

# 只看字节数 
wc -c suggest_stock

# 删除文件夹
rmdir tmp/

# move
# 修改名称
mv a b

# 移动
mv a dir/

# chmod 
# drwxr-xr-x
# u -g - o 三个身份的权限。
# u:user 作者
# g:group 群组
# o:other 其他人
# r:可读
# w:可写
# x:可执行
# -：没有权限

# 将 user 的读权限去掉
chmod u-r a.txt
# 将 user 的读权添加。
chmod u+r a.txt

r w x   			r w x					r w x
0 0 1 = 1			0 1 0 = 2			1 0 0 = 4

r w x   			r w x					r w x
0 1 1 = 3			1 1 0 = 6			1 1 1 = 7

# 对 u，g，o 新增 r 权限
chomd 444 a.txt 

# grep
# 以 H 开头
grep ^H a

# 寻找hill 或者 Hill
grep [H|h]ill a

# 
grep [A-Za-z]ill a

# 查号 l
grep l+ a

# 选择 Hxll
grep H.ll z
```



shell 脚本

```shell
a=5
b=35

echo `expr $a + $b `
echo `expr $a - $b `
# 与正则 * 有歧义
echo `expr $a \* $b `
echo `expr $a / $b `
\(  \)


if [ $a -gt $b ]
then
		echo $a
else
		echo $b
fi


for x in 1 2 3 4 5
do
		echo $x
done

x=0
while [ x -le 10 ]
do
	echo $x
	x=`expr $x + 1 `
done
```

