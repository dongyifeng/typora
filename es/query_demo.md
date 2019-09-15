And

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

范围查询

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

