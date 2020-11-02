**Java Post 请求：加 Cookie**

```java
public static String sendPostCookie(String url, Map<String, String> parameterMap, String encoding, String cookies) {
        HttpClient httpClient = new DefaultHttpClient();

        String content = null;
        try {
            if (url.indexOf("https") != -1) {
                httpClient = wrapClient(httpClient);
            }

            HttpPost httpPost = new HttpPost(url);
            TraceUtils.setClientRequestHeaders(httpPost);
            // 请求超时
            httpClient.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 40000);
            // 读取超时
            httpClient.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, 40000);
            httpClient.getParams().setParameter(AllClientPNames.STRICT_TRANSFER_ENCODING, "utf-8");
            if (StringUtils.isNotBlank(cookies)) {
                httpPost.setHeader("Cookie", cookies);
            }

            if (parameterMap != null && !parameterMap.isEmpty()) {
                if (parameterMap.size() == 1 && parameterMap.get("${data}") != null) {
                    try {
                        httpPost.setEntity(new StringEntity(parameterMap.get("${data}")));
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                } else {

                    List<NameValuePair> params = new ArrayList<NameValuePair>();
                    for (Iterator<Entry<String, String>> it = parameterMap.entrySet().iterator(); it.hasNext(); ) {
                        Entry<String, String> entry = it.next();
                        params.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
                    }
                    try {
                        if (encoding == null) {
                            httpPost.setEntity(new UrlEncodedFormEntity(params));
                        } else {
                            httpPost.setEntity(new UrlEncodedFormEntity(params, encoding));
                        }
                    } catch (UnsupportedEncodingException e) {
                        log.error("Encode the parameter failed!", e);
                    }
                }
            }

            content = httpClient.execute(httpPost, new BasicResponseHandler());
        } catch (Exception e) {
            log.warn(String.format("sendPost exception; url:%s, encoding:%s", url, encoding), e);
            content = null;
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        return content;
    }
```

