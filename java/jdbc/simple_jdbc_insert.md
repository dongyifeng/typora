`org.springframework.jdbc.core.SimpleJdbcInsert`  类是一个多线程，可重用的对象，为将数据插入表提供了易用的功能。它提供元数据处理以简化构建基本 `insert` 语句所需的代码。实际的插入是使用 Spring 的`JdbcTemplate` 来处理的。



mvn 依赖：

```xml
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.0.8.RELEASE</version>
        </dependency>
```



```java
    public void setDataSource(DataSource dataSource, Class<T> domainClass) {
        this.clazz = domainClass;
        this.tableName = CaseFormat.UPPER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, clazz.getSimpleName());
        this.simpleJdbcInsert = new SimpleJdbcInsert(dataSource)
                .withTableName(tableName)
                .usingGeneratedKeyColumns("id");
        this.rowMapper = BeanPropertyRowMapper.newInstance(clazz);
    }

    public Long add(T t) {
        try {
            final Long now = System.currentTimeMillis();
            Arrays.asList("createdAt", "updatedAt").forEach(n -> {
                try {
                    Field f = clazz.getDeclaredField(n);
                    f.setAccessible(true);
                    f.set(t, now);
                } catch (Exception e) {
                    // ignored
                }
            });
            SqlParameterSource parameters = new BeanPropertySqlParameterSource(t);
            Number newId = simpleJdbcInsert.executeAndReturnKey(parameters);
            Field field = clazz.getDeclaredField("id");
            field.setAccessible(true);
            field.set(t, newId.longValue());
            return newId.longValue();
        } catch (Exception e) {
            logger.error(JSON.toJSONString(t), e);
        }
        return -1L;
    }
```



**支持分表的实现**

```java
    public void setDataSource(DataSource dataSource, Class<T> domainClass) {
        this.clazz = domainClass;
        this.tableName = CaseFormat.UPPER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, clazz.getSimpleName());
        this.rowMapper = BeanPropertyRowMapper.newInstance(clazz);
        this.simpleJdbcInsert = new SimpleJdbcInsert(dataSource)
                .withTableName(tableName + "_0")
                .usingGeneratedKeyColumns("id");
        simpleJdbcInsert.compile();
        insertSQL = simpleJdbcInsert.getInsertString();
        columnNames = getColumnNames(insertSQL);
    }

    protected static List<String> getColumnNames(String insertSQL) {
        int end = insertSQL.indexOf("VALUES");
        int start = insertSQL.indexOf("(");
        return Arrays.stream(insertSQL.substring(start, end).trim().replace(")", "").replace("(", "").split(","))
                .map(x -> CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, x.trim().toLowerCase()))
                .collect(Collectors.toList());
    }

    @Override
    public Long add(Long shardId, T t) {
        try {
            final Long now = System.currentTimeMillis();
            Arrays.asList("createdAt", "updatedAt").forEach(n -> {
                try {
                    Field f = clazz.getDeclaredField(n);
                    f.setAccessible(true);
                    f.set(t, now);
                } catch (Exception e) {
                    // ignored
                }
            });
            SqlParameterSource parameters = new BeanPropertySqlParameterSource(t);
            List<Object> params = new ArrayList<>();

            for (String key : columnNames) {
                params.add(parameters.getValue(key));
            }
            String sql = insertSQL.replace(tableName + "_0", getSplitTableName(shardId));
            jdbcTemplate.update(sql, params);
            Map<String, Object> id = jdbcTemplate.queryForMap("SELECT LAST_INSERT_ID() as id", null);
            return MapUtils.getLong(id, "id");
        } catch (Exception e) {
            logger.error(JSON.toJSONString(t), e);
        }
        return -1L;
    }
```

注意：

1. 在初始化 simpleJdbcInsert 对现实，使用第一个分表 balance_history_0，通过 simpleJdbcInsert.compile(); 加载表结构。
2. insertSQL = simpleJdbcInsert.getInsertString(); 获取插入SQL
3. getColumnNames() , 获取insert_sql 列的顺序。
4. SqlParameterSource parameters = new BeanPropertySqlParameterSource(t); 获取对象属性和属性值。
5. List<Object> params：遍历 columnNames，生成对应顺序的值
6.  jdbcTemplate.update(sql, params); 插入数据库。 

