[TOC]

# 创建 stream



## 1. 通过 Collection 系列集合提供 stream() 或者 parallelStream()

## 2. 通过 Arrays.stream() 获取数组流

```java
String[] strArray = new String[]{"a", "b", "c"};
stream = Arrays.stream(strArray);
```



## 3. 通过 Stream.of() 

```java
Stream<String> stream = Stream.of("a", "b", "c");

String[] strArray = new String[]{"a", "b", "c"};
stream = Stream.of(strArray);  

// 数值流
IntStream.of(new int[]{1, 2, 3});
IntStream.range(1, 3);
IntStream.rangeClosed(1, 3);
```

## 4. 创建无限流

### 迭代

### 生成



# 中间操作

### 查找与匹配

#### allMatch

```java
List<Person> persons = new ArrayList<>();
persons.add(new Person("name1", 10));
persons.add(new Person("name2", 21));
persons.add(new Person("name3", 34));
persons.add(new Person("name4", 6));
persons.add(new Person("name5", 55));

// 只要有一个不匹配，就放返回：false
boolean r = persons.stream().allMatch(p -> p.getAge() > 18);
```

#### anyMatch

```java
// 只要有一个匹配，就放返回：true
boolean r = persons.stream().allMatch(p -> p.getAge() > 18);
```

#### noneMatch

```java
// 所有都不匹配，就放返回：true
boolean r = persons.stream().allMatch(p -> p.getAge() > 18);
```

#### findFirst

#### findAny

#### count

#### max

#### min

# 终止操作

#### 收集

