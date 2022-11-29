规则引擎禁发规则流接口（反垃圾actCtrlForStatus接口）

# 一、接口描述

禁发策略检测

# 二、接口依赖

```Plain%20Text
<dependency>

    <groupId>com.xueqiu.snowflake</groupId>

    <artifactId>rules-engine-proto</artifactId>

    <version>0.1.3</version>

</dependency>
```

# 三、接口定义

```ProtoBuf
message StatusInfo{

  int64 userId = 1;                    //uid

  StatusType statusType = 2;           //类型

  int64 time = 3;                      //发布时间

  string content = 4;                  //原始内容

  int64 retweetStatusId = 5;           //转发贴的原贴id

  int64 rootInReplayStatusId = 6;      //评论回复的帖子id

  string sourceCode = 7;               //发帖来源

  string symbolId = 8;

  bool newUser = 9;                    //是否新用户

  bool noFreqLimit = 10;               //是否不限频

  int64 id = 11;                       //帖子(评论)id

  string realIp = 12;                  //真实ip

  int64 inRetweetStatusId = 13;

  bool isEdit = 14;                    //是否编辑

  bool isWeb = 15;                     //是否为web

  string clientVersion = 16;           //客户端版本

  string client = 17;                  //客户端名称

  string ua = 18;

  int64 flags = 19;

  int32 category = 20;

}



message JudgeAuditRequest{

  StatusInfo statusInfo = 1;         //帖子信息

  string flowCode = 2;               //规则流code

  bool debug = 3;                    //是否debug模式

  string contextId = 4;              //上下文id

}



service AntispamService{

  rpc judgeAudit(JudgeAuditRequest) returns(Result) {};

  rpc judgeForbidden(JudgeAuditRequest) returns(Result) {};

}
```

# 四、调用方式

```Java
@GRpcClient(serviceId = "snowflake-rule-engine", interceptors = ClientLogInterceptor.class)

private Channel channel;



//这几个code都可以认为是请求成功

private static final Set<Integer> SUCCEED_CODE = ImmutableSet.of(200, 205, 206, 210);



private StatusResult callRuleJudgeForbidden(String contextId, StatusInfo statusInfo) {

    AntispamServiceGrpc.AntispamServiceBlockingStub antispamServiceBlockingStub = AntispamServiceGrpc.newBlockingStub(channel);

    Antispam.JudgeAuditRequest.Builder request = Antispam.JudgeAuditRequest.newBuilder();

    request.setContextId(contextId);

    Antispam.StatusInfo.Builder statusInfoBuilder = Antispam.StatusInfo.newBuilder();

    statusInfoBuilder.setUserId(statusInfo.getUserId())

            .setStatusType(Common.StatusType.valueOf(statusInfo.getStatusType().name()))

            .setTime(statusInfo.getTime())

            .setContent(statusInfo.getContent())

            .setRetweetStatusId(statusInfo.getRetweetStatusId())

            .setRootInReplayStatusId(statusInfo.getRootInReplayStatusId())

            .setNewUser(statusInfo.isNewUser())

            .setNoFreqLimit(statusInfo.isNoFreqLimit())

            .setId(statusInfo.getId())

            .setInRetweetStatusId(statusInfo.getInRetweetStatusId())

            .setIsEdit(statusInfo.isIsEdit())

            .setIsWeb(statusInfo.isIsWeb())

            .setFlags(statusInfo.getFlags())

            .setCategory(statusInfo.getCategory());



    if (StringUtils.isNotEmpty(statusInfo.getSymbolId())) {

        statusInfoBuilder.setSymbolId(statusInfo.getSymbolId());

    }



    if (StringUtils.isNotEmpty(statusInfo.getSourceCode())) {

        statusInfoBuilder.setSourceCode(statusInfo.getSourceCode());

    }



    if (StringUtils.isNotEmpty(statusInfo.getRealIp())) {

        statusInfoBuilder.setRealIp(statusInfo.getRealIp());

    }



    if (StringUtils.isNotEmpty(statusInfo.getClientVersion())) {

        statusInfoBuilder.setClientVersion(statusInfo.getClientVersion());

    }



    if (StringUtils.isNotEmpty(statusInfo.getClient())) {

        statusInfoBuilder.setClient(statusInfo.getClient());

    }



    if (StringUtils.isNotEmpty(statusInfo.getUa())) {

        statusInfoBuilder.setUa(statusInfo.getUa());

    }



    request.setStatusInfo(statusInfoBuilder.build());

    Common.Result result;

    try {

        result = antispamServiceBlockingStub.judgeForbidden(request.build());

        log.info("call rule engine judgeForbidden succeed, id{}, result:{}", statusInfo.getId(), result);

    }catch (Exception e) {

        log.error("call rule engine judgeForbidden error, status info:{}", statusInfo, e);

        return new StatusResult("0");

    }



    if (result != null && SUCCEED_CODE.contains(result.getCode())) {

        Common.GrpcString code;

        try {

            code = result.getData().unpack(Common.GrpcString.class);

        }catch (Exception e) {

            log.error("judgeForbidden unpack GrpcString error,resp:{}",result);

            return new StatusResult("0");

        }

        return new StatusResult(code.getValue());

    }

    return new StatusResult("0");

}
```