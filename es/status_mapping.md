```json
#! Deprecation: [types removal] The parameter include_type_name should be explicitly specified in get mapping requests to prepare for 7.0. In 7.0 include_type_name will default to 'false', which means responses will omit the type name in mapping definitions.
{
  "status_v12" : {
    "mappings" : {
      "status" : {
        "dynamic" : "strict",
        "_all" : {
          "enabled" : false
        },
        "_source" : {
          "includes" : [
            "*"
          ],
          "excludes" : [
            "title",
            "content"
          ]
        },
        "properties" : {
          "allSymbols" : {
            "type" : "keyword"
          },
          "allSymbolsCharLength" : {
            "type" : "short"
          },
          "allSymbolsSize" : {
            "type" : "short"
          },
          "antiSpamState" : {
            "type" : "integer"
          },
          "content" : {
            "type" : "text",
            "analyzer" : "whitespace"
          },
          "contentLength" : {
            "type" : "integer"
          },
          "createdAt" : {
            "type" : "long"
          },
          "data" : {
            "type" : "text"
          },
          "favCount" : {
            "type" : "integer"
          },
          "flags" : {
            "type" : "keyword"
          },
          "followerCount" : {
            "type" : "integer"
          },
          "goodReplyCount" : {
            "type" : "integer"
          },
          "likeCount" : {
            "type" : "integer"
          },
          "nlpCategory" : {
            "type" : "nested",
            "properties" : {
              "name" : {
                "type" : "keyword"
              },
              "score" : {
                "type" : "double"
              }
            }
          },
          "nlpRelevance" : {
            "type" : "double"
          },
          "nlpStaticScore" : {
            "type" : "keyword"
          },
          "nlpSymbols" : {
            "type" : "nested",
            "properties" : {
              "name" : {
                "type" : "keyword"
              },
              "score" : {
                "type" : "double"
              }
            }
          },
          "nlpTopic" : {
            "type" : "nested",
            "properties" : {
              "name" : {
                "type" : "keyword"
              },
              "score" : {
                "type" : "double"
              }
            }
          },
          "replyCount" : {
            "type" : "integer"
          },
          "replyUserCount" : {
            "type" : "integer"
          },
          "retweetCount" : {
            "type" : "integer"
          },
          "retweetStatusId" : {
            "type" : "long"
          },
          "rewardMoney" : {
            "type" : "integer"
          },
          "rewardUserCount" : {
            "type" : "integer"
          },
          "sameStatusId" : {
            "type" : "long"
          },
          "simHashValue" : {
            "type" : "long"
          },
          "source" : {
            "type" : "keyword"
          },
          "staticScore" : {
            "type" : "double"
          },
          "statusId" : {
            "type" : "long"
          },
          "symbolAccessOrder" : {
            "type" : "integer"
          },
          "symbols" : {
            "type" : "keyword"
          },
          "tags" : {
            "type" : "keyword"
          },
          "textHash" : {
            "type" : "keyword"
          },
          "textSimHashGroup" : {
            "type" : "keyword"
          },
          "title" : {
            "type" : "text",
            "analyzer" : "whitespace"
          },
          "titleSymbols" : {
            "type" : "keyword"
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

