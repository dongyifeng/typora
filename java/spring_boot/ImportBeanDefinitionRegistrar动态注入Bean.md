# Spring Boot通过ImportBeanDefinitionRegistrar动态注入Bean

Spring Boot中大量使用 ImportBeanDefinitionRegistrar 来实现Bean的动态注入。它是Spring中一个强大的扩展接口。



Spring官方通过ImportBeanDefinitionRegistrar实现了@Component、@Service等注解的动态注入机制。

很多三方框架集成Spring的时候，都会通过该接口，实现扫描指定的类，然后注册到spring容器中。 比如Mybatis中的Mapper接口，springCloud中的FeignClient接口，都是通过该接口实现的自定义注册逻辑。



基本步骤：

- 实现ImportBeanDefinitionRegistrar接口；
- 通过registerBeanDefinitions实现具体的类初始化；
- 在@Configuration注解的配置类上使用@Import导入实现类；



**简单示例**：自定义注解：实现 @Component 的功能

pop.xml

```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.5</version>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
        </dependency>
    </dependencies>
```

## core

自定义注解：实现 @Component 的功能

```java
// 自定义注解：实现 @Component 的功能
@Documented
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER})
public @interface Recall {
}
```



实现自定义注解：注入spring 容器

```java
// 实现自定义注解：注入spring 容器
public class RecallAutoConfigureRegistrar implements ImportBeanDefinitionRegistrar, ResourceLoaderAware {
    private ResourceLoader resourceLoader;
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        // 借助 ClassPathBeanDefinitionScanner 类的实现类来扫描获取需要注册的 Bean
        RecallBeanDefinitionScanner scanner = new RecallBeanDefinitionScanner(registry, false);
        scanner.setResourceLoader(resourceLoader);
        scanner.registerFilters();
        scanner.addIncludeFilter(new AnnotationTypeFilter(Recall.class));
        // 被标注类的命名空间
        scanner.doScan("dyf.demo");
    }

    // 通过 ResourceLoaderAware 接口的 setResourceLoader 方法获得到了 ResourceLoader 对象
    @Override
    public void setResourceLoader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }
}
```



扫描被 @Recall 的注解的类

```java
// 扫描被 @Recall 的注解的类
public class RecallBeanDefinitionScanner extends ClassPathBeanDefinitionScanner {
    public RecallBeanDefinitionScanner(BeanDefinitionRegistry registry, boolean useDefaultFilters) {
        super(registry, useDefaultFilters);
    }

    // 指定了 addIncludeFilter 方法的参数为包含 Recall 的AnnotationTypeFilter
    // 也可以通过 excludeFilters 指定不加载的类型
    protected void registerFilters() {
        addIncludeFilter(new AnnotationTypeFilter(Recall.class));
    }

    @Override
    protected Set<BeanDefinitionHolder> doScan(String... basePackages) {
        return super.doScan(basePackages);
    }
}
```



## demo

通过 @Import引入自定义的Registrar

```java
// 通过 @Import引入自定义的Registrar
@Configuration
@Import(RecallAutoConfigureRegistrar.class)
public class SpringConfig {
}
```



使用自定义注解

```java
// 通过自定义 @Recall 将 UserRecall 注入spring 容器
@Recall
public class UserRecall {

}
```



springBoot 启动测试

```java
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

public class Main {

    public static void main(String[] args) {
        ConfigurableApplicationContext run = SpringApplication.run(SpringConfig.class, args);
        UserRecall bean = run.getBean(UserRecall.class);
        System.out.println(bean.getClass());
    }
}
```