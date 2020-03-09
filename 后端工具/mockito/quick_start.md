官网：http://site.mockito.org/

**依赖**

```xml
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.mockito/mockito-all -->
        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-all</artifactId>
            <version>1.10.19</version>
            <scope>test</scope>
        </dependency>
```

**登录业务**

```java
public class AccountDao {
    public Account findAccount(String userName, String password) {
        throw new UnsupportedOperationException();
    }
}

public class AccountLoginController {
    private AccountDao accountDao;
    public AccountLoginController(AccountDao accountDao) {
        this.accountDao = accountDao;
    }
    public String login(HttpServletRequest request) {
        final String username = request.getParameter("username");
        final String password = request.getParameter("password");
        try
        {
            final Account account = accountDao.findAccount(username, password);
            if (account == null) {
                return "/login";
            } else {
                return "/index.jsp";
            }
        }catch (Exception e){
            return "/505";
        }
    }
}
```

**单元测试**

```java
@RunWith(MockitoJUnitRunner.class)
public class AccountLoginControllerTest {
    private AccountDao accountDao;
    private HttpServletRequest request;
    private AccountLoginController accountLoginController;

    @Before
    public void setUp() {
        this.accountDao = Mockito.mock(AccountDao.class);
        this.request = Mockito.mock(HttpServletRequest.class);
        this.accountLoginController = new AccountLoginController(accountDao);
    }

    @Test
    public void testLoginSuccess() {
        Account account = new Account();
        // 模拟方法
        Mockito.when(request.getParameter("username")).thenReturn("alex");
        Mockito.when(request.getParameter("password")).thenReturn("123456");
        Mockito.when(accountDao.findAccount(Matchers.anyString(), Matchers.anyString())).thenReturn(account);

//        Assert.assertEquals(accountLoginController.login(request),"/505");
        Assert.assertEquals(accountLoginController.login(request), "/index.jsp");
    }
}
```

