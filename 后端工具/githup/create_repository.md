[TOC]

# 回滚

```shell
git log 3
git reset --hard 596f6d3c17030b9d1b18b384d0441afc0200f705
# 强制将 feature-msg 分支覆盖 prod 分支
git push -f upstream feature-msg:prod
```



# Fork

Githup 上 fork 到本人远程分支

```shell
# 建立跟远端的联系
git remote add upstream git@git.com:backend/snowball.git

# 删除远端的联系
git remote remove upstream

# 从远端切分支
git fetch -p upstream
git checkout upstream/prod -b feature-msg
```



# 删除分支

```shell
# 删除远程分支
git push -f origin :feature-msg

# 删除本地分支
git branch -D feature-msg
```

# 将其他分支的提交合并当前分支

```shell
git log feature-msg

git cherry-pick 8d17fd3fbdeb380121fce4f6b274ce0b2deff04a
```

git cherry-pick用于把另一个本地分支的 commit 修改应用到当前分支

<font color=red>注意：从后向前 cherry-pick</font>

# 创建新仓库

```shell
echo "# my" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin git@github.com:dongyifeng/my.git
git push -u origin master
```

push an existing repository from the command line

```shell
git remote add origin git@github.com:dongyifeng/my.git
git push -u origin master
```



# 创建新项目

## 命令行初始化

```shell
git config --global user.name "dongyifeng"
git config --global user.email "dongyf@qq.com"
```



## 创建新项目

```shell
git clone git@git.com:data/snowflake-push-notification.git
cd snowflake-push-notification
touch README.md
git add README.md
git commint -m "add README"
git push -u origin master
```



## 创建已存在项目

```shell
cd existing_folder
git init
git remote add origin git@git.com:data/snowflake-push-notification.git
git add .
git commit
git push -u origin master
```









# SSK 失效

```shell
# 重新生成 ~/.ssh/id_rsa.pub
ssh-keygen -t rsa -C "jff1314@126.com"

ssh -v git@github.com

ssh-agent -s

ssh-add ~/.ssh/id_rsa

# 将内容拷贝到 github.com 上
cat ~/.ssh/id_rsa.pub



ssh -T git@github.com

```

