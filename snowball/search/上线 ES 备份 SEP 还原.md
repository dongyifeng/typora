需求 ：将线上 user_v6 索引创建快照，将快照在 sep ES 集群恢复。

1. 在线上集群创建临时快照库

   ```apl
   POST _snapshot/search_user_v6
   {
       "type": "fs",
       "settings": {
         "location": "search_user_v6",
         "max_restore_bytes_per_sec": "60mb",
         "compress": "true",
         "max_snapshot_bytes_per_sec": "60mb"
       }
     }
   ```

2. 线上ES集群备份 user_v6 索引

   ```apl
   PUT /_snapshot/search_user_v6/user_v6_snapshot
   {
     "indices": "user_v6"
   }
   ```

   

3. 监控备份状态

   ```apl
   GET _snapshot/search_user_v6/user_v6_snapshot/_status
   ```

   

4. 登录 ES 集群服务器：将备份文件打包

   ```shell
   cd /persist/backup
   zip -r search_user_v6.zip search_user_v6
   # 文件传输
   python -m SimpleHTTPServer 8000
   ```

   

5. 在 sep 集群上创建临时快照库

   ```apl
   POST _snapshot/search_user_v6
   {
       "type": "fs",
       "settings": {
         "location": "search_user_v6",
         "max_restore_bytes_per_sec": "60mb",
         "compress": "true",
         "max_snapshot_bytes_per_sec": "60mb"
       }
     }
   ```

6. 登录 sep 集群服务器，获取 search_user_v6.zip ，解压

   ```shell
   wget 文件所在服务器IP:8080/search_user_v6.zip 
   unzip search_user_v6.zip 
   ```

7. 删除 sep 集群上 user_v6 索引

   ```apl
   DELETE user_v6
   ```

   

8. 恢复快照

   ```apl
   POST /_snapshot/search_user_v6/user_v6_snapshot/_restore
   {
     "indices": "user_v6"
   }
   ```

9. 将 sep 环境的user_v6 副本数设置为 1

   ```apl
   PUT user_v6/_settings
   {
     "number_of_replicas": 1
   }
   ```

10. 删除临时快照库

    ```apl
    DELETE _snapshot/search_user_v6
    ```

