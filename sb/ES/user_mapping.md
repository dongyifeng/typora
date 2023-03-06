```json
#! Deprecation: [types removal] The parameter include_type_name should be explicitly specified in get mapping requests to prepare for 7.0. In 7.0 include_type_name will default to 'false', which means responses will omit the type name in mapping definitions.
{
  "user_v6" : {
    "mappings" : {
      "user" : {
        "dynamic" : "strict",
        "_all" : {
          "enabled" : false
        },
        "_source" : {
          "includes" : [
            "*"
          ]
        },
        "properties" : {
          "antiSpamState" : {
            "type" : "integer"
          },
          "antiSpamWords" : {
            "type" : "text",
            "analyzer" : "whitespace"
          },
          "follower" : {
            "type" : "long"
          },
          "keywords" : {
            "type" : "text",
            "analyzer" : "whitespace"
          },
          "name" : {
            "type" : "text",
            "analyzer" : "whitespace"
          },
          "pinyin" : {
            "type" : "text",
            "analyzer" : "whitespace"
          },
          "updatedAt" : {
            "type" : "long"
          },
          "userId" : {
            "type" : "long"
          }
        }
      }
    }
  }
}
```

