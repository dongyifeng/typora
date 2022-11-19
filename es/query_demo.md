[TOC]

# And

```json
{
	"query": {
		"bool": {
			"must": [{
					"term": {
						"tags_v1": {
							"value": "做多中国"
						}
					}
				},
				{
					"term": {
						"status_id": {
							"value": "132518133"
						}
					}
				}
			]
		}
	}
}
```

# 范围查询

```json
{
    "query": {
        "range" : {
            "created_at" : {
                "gte" : 1546272000000
            }
        }
    }
}
```

# 聚合操作

```json
{
  "size" : 0,
  "timeout" : "4s",
  "query" : {
    "range" : {
      "createdAt" : {
        "from" : 1569495894570
      }
    }
  },
  "aggregations" : {
    "symbol_count" : {
      "terms" : {
        "field" : "symbols",
        "size" : 1000,
        "order" : [
          {
            "_count" : "desc"
          },
          {
            "_term" : "asc"
          }
        ]
      }
    }
  }
}
```

```java
    public Map<String, Double> statsHotStock(long time, int count) {
        time = System.currentTimeMillis() - time;
        // select count(1) as symbol_count from xx where createdAt > xxxx group by symbols
        final RangeQueryBuilder rangeQueryBuilder = QueryBuilders.rangeQuery("createdAt").gte(time);
        final TermsAggregationBuilder aggregationBuilder = AggregationBuilders
                .terms("symbol_count")
                .field("symbols")
                .size(count);
        final SearchRequestBuilder requestBuilder = ESClientUtils.getClient()
                .prepareSearch(XQConfig.getValue(IndexConstants.INDEX_NAME_KEY, "status"))
                .setTypes(IndexConstants.ES_STATUS_TYPE)
                .setTimeout(TimeValue.timeValueSeconds(4))
                .setSearchType(SearchType.QUERY_THEN_FETCH)
                .setQuery(rangeQueryBuilder)
                .addAggregation(aggregationBuilder)
                .setSize(0);  // query 的内容不输出，只输出统计内容

        log.info("hot stock stats dsl:" + requestBuilder.toString());
        final SearchResponse response = requestBuilder.execute().actionGet(TimeValue.timeValueSeconds(4));
        Terms aggregation = response.getAggregations().get("symbol_count");

        Map<String, Double> res = new HashMap<>();
        for (Terms.Bucket bucket : aggregation.getBuckets()) {
            res.put(bucket.getKey().toString(), (double) bucket.getDocCount());
            log.info("stats hot stock data:{}:{}", bucket.getKey(), bucket.getDocCount());
        }
        return res;
    }
```

# 