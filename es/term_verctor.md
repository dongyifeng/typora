# TermVector 查询倒排

```java

    public static void main(String[] args) throws IOException {
        final Settings cluster_name = Settings.builder()
                // 是否忽略集群名
                .put("client.transport.ignore_cluster_name", false)
                // 集群嗅探是否开启
                .put("client.transport.sniff", true)
                // ping超时事件 默认5s
                .put("client.transport.ping_timeout", "5s")
                // ping or sample操作间隔 默认5s
                .put("client.transport.nodes_sampler_interval", "5s")
                .build();


        InetSocketTransportAddress inetSocketTransportAddress =
                new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"), 9300);

        TransportClient client = new PreBuiltTransportClient(cluster_name)
                .addTransportAddresses(inetSocketTransportAddress);

        TermVectorsResponse response = client.prepareTermVectors().setIndex("test").setType("test")
                .setId("1").setSelectedFields("text")
                .setTermStatistics(true)
                .setOffsets(true)
                .setPayloads(true)
                .setFieldStatistics(true)
                .setPositions(true)
                .setRealtime(true)
                .execute()
                .actionGet();

        TermVectorsFields fields = (TermVectorsFields) response.getFields();


        Iterator iterator = fields.iterator();
        while (iterator.hasNext()) {
            String field = iterator.next().toString();
            Terms terms = fields.terms(field);
            TermsEnum termsEnum = terms.iterator();
            while (termsEnum.next() != null) {
                BytesRef term = termsEnum.term();
                PostingsEnum postings = termsEnum.postings(null);

                // 获取倒排信息
                postings.nextPosition();
                System.out.println(postings.getPayload().utf8ToString());

                if (term != null) {
                    System.out.println(term.utf8ToString() + termsEnum.totalTermFreq());

                }

            }
        }
    }
```

