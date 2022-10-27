1. 进入项目路径

2. 清除本地当前的 Git 缓存

   ```shell
   git rm -r --cached .
   ```

3. 应用 .gitignore 等本地配置文件重新建立 Git 索引

   ```shell
   git add .
   ```

4. 提交当前 Git 版本并备注说明

   ```shell
   git commit -m "update .gitignore"
   ```

