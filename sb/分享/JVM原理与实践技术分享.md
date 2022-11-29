JVM原理与实践技术分享

- 一、cafe babe
  - 1、Java文件编译的过程
  - 2、class文件

- 二、JVM基本结构

- 三、JVM类加载机制
  - 1、简述java类加载机制?
    - 1、加载
    - 2、连接过程
      - 验证：确保加载的类信息符合JVM规范，没有安全方面的问题。主要验证是否符合Class文件格式规范，并且是否能被当前的虚拟机加载处理。
      - 准备：正式为类变量（static变量）分配内存并设置类变量初始值的阶段，这些内存都将在方法区中进行分配
      - 解析：虚拟机常量池的符号引用替换为字节引用过程
    - 3、初始化
  - 2、class Loader
    - 1、类加载器的分类：
    - 2、双亲委派机制图解：
    - 3、双亲委派机制的意义：
    - 4、两个异常：

- 四、垃圾回收器
  - 1、内存模型
  - 2、 垃圾回收
    - 1、引用类型
      - 强引用：发生 gc 的时候不会被回收。
      - 软引用：有用但不是必须的对象，在发生内存溢出之前会被回收。
      - 弱引用：有用但不是必须的对象，在下一次GC时会被回收。
      - 虚引用（幽灵引用/幻影引用）：无法通过虚引用获得对象，用 PhantomReference 实现虚引用，虚引用的用途是在 gc 时返回一个通知。
    - 2、哪些内存需要回收
      - 垃圾收集器在做垃圾回收的时候，首先需要判定的就是哪些内存是需要被回收的，哪些对象是存活的，是不可以被回收的；哪些对象已经死掉了，需要被回收。一般有两种方法来判断：
      - 新生代、老年代、永久代
      - Minor GC、Major GC、Full GC
      - Minor GC、Major GC、Full GC区别及触发条件
      - 为什么新生代要分Eden和两个 Survivor 区域？
      - Java堆老年代( Old ) 和新生代 ( Young ) 的默认比例？
      - 为什么要这样分代：
    - 3、垃圾回收器他和垃圾算法
      - 1、垃圾回收器
      - 2、垃圾回收算法
        - 1、标记-清除算法：标记无用对象，然后进行清除回收。
        - 2、复制算法
        - 3、标记-整理算法
        - 4、分代收集算法

- 五、JVM常用指令及内存分析

- 六、JVM常见异常分析
  - 一、JVM调优
    - 1、概括：
    - 2、调优步骤
    - 3、Jvm调优典型参数设置
    - 4、gc监控常用参数
    - 5、关注指标
    - 6、理论JVM参数设置
    - 7、oom常见异常

- 七、常见JVM概念区别

- 八、其他

飞书格式有点问题，建议看原件：

暂时无法在飞书文档外展示此内容

# 一、cafe babe

## 1、Java文件编译的过程

1. 程序员编写的.java文件

1. 由javac编译成字节码文件.class：（为什么编译成class文件，因为JVM只认识.class文件）

1. 在由JVM编译成电脑认识的文件 （对于电脑系统来说 文件代表一切） 

## 2、class文件

```Plaintext
@Data
public class ClassTest {
    private static final String staticFinalParam = "staticFinalParam";
    private static String staticParam = "staticParam";
    private String param = "param";
}
//部分16进制文件
cafe babe 0000 0034 0049 0a00 1100 3908
0017 0900 0400 3a07 003b 0a00 0400 3c0a
0004 003d 0a00 1100 3e0a 0011 003f 0700
400a 0009 0039 0800 410a 0009 0042 0800
430a 0009 0044 0800 1609 0004 0045 0700
4601 0010 7374 6174 6963 4669 6e61 6c50
6172 616d 0100 124c 6a61 7661 2f6c 616e
672f 5374 7269 6e67 3b01 000d 436f 6e73
7461 6e74 5661 6c75 6508 0012 0100 0b73
7461 7469 6350 6172 616d 0100 0570 6172
616d 0100 063c 696e 6974 3e01 0003 2829
5601 0004 436f 6465 0100 0f4c 696e 654e
756d 6265 7254 6162 6c65 0100 124c 6f63
616c 5661 7269 6162 6c65 5461 626c 6501
0004 7468 6973 0100 264c 636f 6d2f 7869
//javap -v
警告: 二进制文件ClassTest包含com.xiaoz.spring_demo.test.ClassTest
Classfile /Users/yangrenze/Documents/myproject/spring_demo/target/test-classes/com/xiaoz/spring_demo/test/ClassTest.classLast modified 2022-9-5; size 1631 bytesMD5 checksum 07b9c4b5b59dfe10c826380d68c30f51Compiled from "ClassTest.java"
public class com.xiaoz.spring_demo.test.ClassTestminor version: 0major version: 52flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #17.#57        // java/lang/Object."<init>":()V
   #2 = String             #23            // param
   #3 = Fieldref           #4.#58         // com/xiaoz/spring_demo/test/ClassTest.param:Ljava/lang/String;
   #4 = Class              #59            // com/xiaoz/spring_demo/test/ClassTest
   #5 = Methodref          #4.#60         // com/xiaoz/spring_demo/test/ClassTest.canEqual:(Ljava/lang/Object;)Z
   #6 = Methodref          #4.#61         // com/xiaoz/spring_demo/test/ClassTest.getParam:()Ljava/lang/String;
   #7 = Methodref          #17.#62        // java/lang/Object.equals:(Ljava/lang/Object;)Z
   #8 = Methodref          #17.#63        // java/lang/Object.hashCode:()I
   #9 = Class              #64            // java/lang/StringBuilder
  #10 = Methodref          #9.#57         // java/lang/StringBuilder."<init>":()V
  #11 = String             #65            // ClassTest(param=
  #12 = Methodref          #9.#66         // java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
  #13 = String             #67            // )
  #14 = Methodref          #9.#68         // java/lang/StringBuilder.toString:()Ljava/lang/String;
  #15 = String             #22            // staticParam
  #16 = Fieldref           #4.#69         // com/xiaoz/spring_demo/test/ClassTest.staticParam:Ljava/lang/String;
  #17 = Class              #70            // java/lang/Object
  #18 = Utf8               staticFinalParam
  #19 = Utf8               Ljava/lang/String;
  #20 = Utf8               ConstantValue
  #21 = String             #18            // staticFinalParam
  #22 = Utf8               staticParam
  #23 = Utf8               param
  #24 = Utf8               <init>
  #25 = Utf8               ()V
  #26 = Utf8               Code
  #27 = Utf8               LineNumberTable
  #28 = Utf8               LocalVariableTable
  #29 = Utf8               this
  #30 = Utf8               Lcom/xiaoz/spring_demo/test/ClassTest;
  #31 = Utf8               getParam
  #32 = Utf8               ()Ljava/lang/String;
  #33 = Utf8               setParam
  #34 = Utf8               (Ljava/lang/String;)V
  #35 = Utf8               MethodParameters
  #36 = Utf8               equals
  #37 = Utf8               (Ljava/lang/Object;)Z
  #38 = Utf8               o
  #39 = Utf8               Ljava/lang/Object;
  #40 = Utf8               other
  #41 = Utf8               this$param
  #42 = Utf8               other$param
  #43 = Utf8               StackMapTable
  #44 = Class              #59            // com/xiaoz/spring_demo/test/ClassTest
  #45 = Class              #70            // java/lang/Object
  #46 = Utf8               canEqual
  #47 = Utf8               hashCode
  #48 = Utf8               ()I
  #49 = Utf8               PRIME
  #50 = Utf8               I
  #51 = Utf8               result
  #52 = Utf8               $param
  #53 = Utf8               toString
  #54 = Utf8               <clinit>
  #55 = Utf8               SourceFile
  #56 = Utf8               ClassTest.java
  #57 = NameAndType        #24:#25        // "<init>":()V
  #58 = NameAndType        #23:#19        // param:Ljava/lang/String;
  #59 = Utf8               com/xiaoz/spring_demo/test/ClassTest
  #60 = NameAndType        #46:#37        // canEqual:(Ljava/lang/Object;)Z
  #61 = NameAndType        #31:#32        // getParam:()Ljava/lang/String;
  #62 = NameAndType        #36:#37        // equals:(Ljava/lang/Object;)Z
  #63 = NameAndType        #47:#48        // hashCode:()I
  #64 = Utf8               java/lang/StringBuilder
  #65 = Utf8               ClassTest(param=
  #66 = NameAndType        #71:#72        // append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
  #67 = Utf8               )
  #68 = NameAndType        #53:#32        // toString:()Ljava/lang/String;
  #69 = NameAndType        #22:#19        // staticParam:Ljava/lang/String;
  #70 = Utf8               java/lang/Object
  #71 = Utf8               append
  #72 = Utf8               (Ljava/lang/String;)Ljava/lang/StringBuilder;
{public com.xiaoz.spring_demo.test.ClassTest();descriptor: ()Vflags: ACC_PUBLICCode:stack=2, locals=1, args_size=10: aload_01: invokespecial #1                  // Method java/lang/Object."<init>":()V4: aload_05: ldc           #2                  // String param7: putfield      #3                  // Field param:Ljava/lang/String;10: returnLineNumberTable:line 10: 0line 14: 4LocalVariableTable:Start  Length  Slot  Name   Signature0      11     0  this   Lcom/xiaoz/spring_demo/test/ClassTest;public java.lang.String getParam();descriptor: ()Ljava/lang/String;flags: ACC_PUBLICCode:stack=1, locals=1, args_size=10: aload_01: getfield      #3                  // Field param:Ljava/lang/String;4: areturnLineNumberTable:line 14: 0LocalVariableTable:Start  Length  Slot  Name   Signature0       5     0  this   Lcom/xiaoz/spring_demo/test/ClassTest;public void setParam(java.lang.String);descriptor: (Ljava/lang/String;)Vflags: ACC_PUBLICCode:stack=2, locals=2, args_size=20: aload_01: aload_12: putfield      #3                  // Field param:Ljava/lang/String;5: returnLineNumberTable:line 10: 0LocalVariableTable:Start  Length  Slot  Name   Signature0       6     0  this   Lcom/xiaoz/spring_demo/test/ClassTest;0       6     1 param   Ljava/lang/String;MethodParameters:Name                           Flagsparam                          finalpublic boolean equals(java.lang.Object);descriptor: (Ljava/lang/Object;)Zflags: ACC_PUBLICCode:stack=2, locals=5, args_size=20: aload_11: aload_02: if_acmpne     75: iconst_16: ireturn7: aload_18: instanceof    #4                  // class com/xiaoz/spring_demo/test/ClassTest11: ifne          1614: iconst_015: ireturn16: aload_117: checkcast     #4                  // class com/xiaoz/spring_demo/test/ClassTest20: astore_221: aload_222: aload_023: invokevirtual #5                  // Method canEqual:(Ljava/lang/Object;)Z26: ifne          3129: iconst_030: ireturn31: aload_032: invokevirtual #6                  // Method getParam:()Ljava/lang/String;35: astore_336: aload_237: invokevirtual #6                  // Method getParam:()Ljava/lang/String;40: astore        442: aload_343: ifnonnull     5446: aload         448: ifnull        6551: goto          6354: aload_355: aload         457: invokevirtual #7                  // Method java/lang/Object.equals:(Ljava/lang/Object;)Z60: ifne          6563: iconst_064: ireturn65: iconst_166: ireturnLineNumberTable:line 10: 0LocalVariableTable:Start  Length  Slot  Name   Signature0      67     0  this   Lcom/xiaoz/spring_demo/test/ClassTest;0      67     1     o   Ljava/lang/Object;21      46     2 other   Lcom/xiaoz/spring_demo/test/ClassTest;36      31     3 this$param   Ljava/lang/Object;42      25     4 other$param   Ljava/lang/Object;StackMapTable: number_of_entries = 6frame_type = 7 /* same */frame_type = 8 /* same */frame_type = 252 /* append */offset_delta = 14locals = [ class com/xiaoz/spring_demo/test/ClassTest ]frame_type = 253 /* append */offset_delta = 22locals = [ class java/lang/Object, class java/lang/Object ]frame_type = 8 /* same */frame_type = 1 /* same */MethodParameters:Name                           Flagso                              finalprotected boolean canEqual(java.lang.Object);descriptor: (Ljava/lang/Object;)Zflags: ACC_PROTECTEDCode:stack=1, locals=2, args_size=20: aload_11: instanceof    #4                  // class com/xiaoz/spring_demo/test/ClassTest4: ireturnLineNumberTable:line 10: 0LocalVariableTable:Start  Length  Slot  Name   Signature0       5     0  this   Lcom/xiaoz/spring_demo/test/ClassTest;0       5     1 other   Ljava/lang/Object;MethodParameters:Name                           Flagsother                          finalpublic int hashCode();descriptor: ()Iflags: ACC_PUBLICCode:stack=2, locals=4, args_size=10: bipush        592: istore_13: iconst_14: istore_25: aload_06: invokevirtual #6                  // Method getParam:()Ljava/lang/String;9: astore_310: iload_211: bipush        5913: imul14: aload_315: ifnonnull     2318: bipush        4320: goto          2723: aload_324: invokevirtual #8                  // Method java/lang/Object.hashCode:()I27: iadd28: istore_229: iload_230: ireturnLineNumberTable:line 10: 0LocalVariableTable:Start  Length  Slot  Name   Signature0      31     0  this   Lcom/xiaoz/spring_demo/test/ClassTest;3      28     1 PRIME   I5      26     2 result   I10      21     3 $param   Ljava/lang/Object;StackMapTable: number_of_entries = 2frame_type = 255 /* full_frame */offset_delta = 23locals = [ class com/xiaoz/spring_demo/test/ClassTest, int, int, class java/lang/Object ]stack = [ int ]frame_type = 255 /* full_frame */offset_delta = 3locals = [ class com/xiaoz/spring_demo/test/ClassTest, int, int, class java/lang/Object ]stack = [ int, int ]public java.lang.String toString();descriptor: ()Ljava/lang/String;flags: ACC_PUBLICCode:stack=2, locals=1, args_size=10: new           #9                  // class java/lang/StringBuilder3: dup4: invokespecial #10                 // Method java/lang/StringBuilder."<init>":()V7: ldc           #11                 // String ClassTest(param=9: invokevirtual #12                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;12: aload_013: invokevirtual #6                  // Method getParam:()Ljava/lang/String;16: invokevirtual #12                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;19: ldc           #13                 // String )21: invokevirtual #12                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;24: invokevirtual #14                 // Method java/lang/StringBuilder.toString:()Ljava/lang/String;27: areturnLineNumberTable:line 10: 0LocalVariableTable:Start  Length  Slot  Name   Signature0      28     0  this   Lcom/xiaoz/spring_demo/test/ClassTest;static {};descriptor: ()Vflags: ACC_STATICCode:stack=1, locals=0, args_size=00: ldc           #15                 // String staticParam2: putstatic     #16                 // Field staticParam:Ljava/lang/String;5: returnLineNumberTable:line 13: 0
}
SourceFile: "ClassTest.java"
```

总结：JVM的作用，类的装载执行和内存管理

# 二、JVM基本结构

- JVM包含两个子系统和两个组件:
  - 两个子系统为Class loader(类装载)、Execution engine(执行引擎)；
  - 两个组件为Runtime data area(运行时数据区)、Native Interface(本地接口)。

- Class loader(类装载)：根据给定的全限定名类名(如：java.lang.Object)来装载class文件到Runtime data area中的method area。

- Execution engine（执行引擎）：执行classes中的指令。

- Native Interface(本地接口)：与native libraries交互，是其它编程语言交互的接口。

- Runtime data area(运行时数据区域)：这就是我们常说的JVM的内存。

- 本地方法栈（Native Method Stack）：与虚拟机栈的作用是一样的，只不过虚拟机栈是服务 Java 方法的，而本地方法栈是为虚拟机调用 Native 方法服务的；
  - Native 关键字修饰的方法是看不到的，Native 方法的源码大部分都是 C和C++ 的代码

- Java 堆（Java Heap）：Java 虚拟机中内存最大的一块，是被所有线程共享的，几乎所有的对象实例都在这里分配内存；

- 方法区（Methed Area）：用于存储已被虚拟机加载的类信息、常量、静态变量引用、即时编译后的代码等数据。

# 三、JVM类加载机制

## 1、简述java类加载机制?

虚拟机把描述类的数据从Class文件加载到内存，并对数据进行校验，解析和初始化，最终形成可以被虚拟机直接使用的java类型。

### 1、加载

加载指的是将类的class文件读入到内存，并将这些静态数据转换成方法区中的运行时数据结构，并在堆中生成一个代表这个类的java.lang.Class对象，作为方法区类数据的访问入口，这个过程需要类加载器参与。

Java类加载器由JVM提供，是所有程序运行的基础，JVM提供的这些类加载器通常被称为系统类加载器。除此之外，开发者可以通过继承ClassLoader基类来创建自己的类加载器。

类加载器，可以从不同来源加载类的二进制数据，比如：本地Class文件、Jar包Class文件、网络Class文件等等等。

类加载的最终产物就是位于堆中的Class对象（注意不是目标类对象），该对象封装了类在方法区中的数据结构，并且向用户提供了访问方法区数据结构的接口，即Java反射的接口

### 2、连接过程

当类被加载之后，系统为之生成一个对应的Class对象，接着将会进入连接阶段，连接阶段负责把类的二进制数据合并到JRE中（意思就是将java类的二进制代码合并到JVM的运行状态之中）。类连接又可分为如下3个阶段。

#### 验证：确保加载的类信息符合JVM规范，没有安全方面的问题。主要验证是否符合Class文件格式规范，并且是否能被当前的虚拟机加载处理。

#### 准备：正式为类变量（static变量）分配内存并设置类变量初始值的阶段，这些内存都将在方法区中进行分配

#### 解析：虚拟机常量池的符号引用替换为字节引用过程

### 3、初始化

初始化阶段是执行类构造器<clinit>() 方法的过程。类构造器<clinit>()方法是由编译器自动收藏类中的所有类变量的赋值动作和静态语句块(static块)中的语句合并产生，代码从上往下执行。

当初始化一个类的时候，如果发现其父类还没有进行过初始化，则需要先触发其父类的初始化

虚拟机会保证一个类的<clinit>() 方法在多线程环境中被正确加锁和同步

## 2、class Loader

### 1、类加载器的分类：

①启动类加载器(BootStrap)； ②扩展类加载器(Extension)； ③应用程序类加载器(Application)；④自定义类加载器(Custom).

### 2、双亲委派机制图解：

### 3、双亲委派机制的意义：

（1）防止类的重复加载： 防止内存中出现多份同样的字节码。试想，如果没有双亲委派机制模型而是由各个类加载器自行加载的话，如果用户编写了一个java.lang.Object的同名类并放在ClassPath中，多个类加载器都会去加载这个类到内存中，系统中将会出现多个不同的Object类，那么类之间的比较结果及类的唯一性将无法保证。

（2）保证程序安全，防止核心API被篡改： 由于所有的用户类都会先通过BootStrap ClassLoder（启动类加载器）查看里面有没有该类资源，有则直接安装或者加载，从而保证了底层的类一定是预先加载的，这样可以对虚拟机的安全得到了很好的保证。

### 4、两个异常：

（1）ClassNotFoundException（加载时找不到类）；NoClassDefFoundError（运行时找不到类）

（2）解决办法：

①可能是您用了不该用的类名，比如说自定义的类，您使用了Java类库中本来就有的类名了，这样类加载器是不会加载您自定义的类的；

②假如您是在框架中报这个异常的话，那么可能是加载的路径和注解不对，或者是您没有将类放在它应该所在的位置（有的类只有在对的位置，才会被JVM加载到）

# 四、垃圾回收器

## 1、内存模型

- 在 Java 中，堆被划分成两个不同的区域：新生代 ( Young )、老年代 ( Old )。而新生代 ( Young ) 又被划分为三个区域：Eden、From Survivor、To Survivor。这样划分的目的是为了使 JVM 能够更好的管理堆内存中的对象，包括内存的分配以及回收。

- 新生代中一般保存新出现的对象，所以每次垃圾收集时都发现大批对象死去，只有少量对象存活，便采用了复制算法，只需要付出少量存活对象的复制成本就可以完成收集。

- 老年代中一般保存存活了很久的对象，他们存活率高、没有额外空间对它进行分配担保，就必须采用“标记-清理”或者“标记-整理”算法。

- 永久代就是JVM的方法区。在这里都是放着一些被虚拟机加载的类信息，静态变量，常量等数据。这个区中的东西比老年代和新生代更不容易回收。

## 2、 垃圾回收

### 1、引用类型

#### 强引用：发生 gc 的时候不会被回收。

#### 软引用：有用但不是必须的对象，在发生内存溢出之前会被回收。

#### 弱引用：有用但不是必须的对象，在下一次GC时会被回收。

#### 虚引用（幽灵引用/幻影引用）：无法通过虚引用获得对象，用 PhantomReference 实现虚引用，虚引用的用途是在 gc 时返回一个通知。

### 2、哪些内存需要回收

- ##### 垃圾收集器在做垃圾回收的时候，首先需要判定的就是哪些内存是需要被回收的，哪些对象是存活的，是不可以被回收的；哪些对象已经死掉了，需要被回收。一般有两种方法来判断：

- - 引用计数器法：为每个对象创建一个引用计数，有对象引用时计数器 +1，引用被释放时计数 -1，当计数器为 0 时就可以被回收。它有一个缺点不能解决循环引用的问题；（这个已经淘汰了）
  - 可达性分析算法：从 GC Roots 开始向下搜索，搜索所走过的路径称为引用链。当一个对象到 GC Roots 没有任何引用链相连时，则证明此对象是可以被回收的。（市场上用的非常非常广泛）

- ##### 新生代、老年代、永久代

- - 在 Java 中，堆被划分成两个不同的区域：新生代 ( Young )、老年代 ( Old )。而新生代 ( Young ) 又被划分为三个区域：Eden、From Survivor、To Survivor。这样划分的目的是为了使 JVM 能够更好的管理堆内存中的对象，包括内存的分配以及回收。
  - 新生代中一般保存新出现的对象，所以每次垃圾收集时都发现大批对象死去，只有少量对象存活，便采用了复制算法，只需要付出少量存活对象的复制成本就可以完成收集。
  - 老年代中一般保存存活了很久的对象，他们存活率高、没有额外空间对它进行分配担保，就必须采用“标记-清理”或者“标记-整理”算法。
  - 永久代就是JVM的方法区。在这里都是放着一些被虚拟机加载的类信息，静态变量，常量等数据。这个区中的东西比老年代和新生代更不容易回收。

- ##### Minor GC、Major GC、Full GC

- - Minor GC是新生代GC，指的是发生在新生代的垃圾收集动作。由于java对象大都是朝生夕死的，所以Minor GC非常频繁，一般回收速度也比较快。（一般采用复制算法回收垃圾）
  - Major GC是老年代GC，指的是发生在老年代的GC，通常执行Major GC会连着Minor GC一起执行。Major GC的速度要比Minor GC慢的多。（可采用标记清楚法和标记整理法）
  - Full GC是清理整个堆空间，包括年轻代和老年代

- ##### Minor GC、Major GC、Full GC区别及触发条件

- - Minor GC 触发条件一般为：eden区满时，触发MinorGC。即申请一个对象时，发现eden区不够用，则触发一次MinorGC。新创建的对象大小 > Eden所剩空间时触发Minor GC
  - Major GC和Full GC 触发条件一般为：
    - Major GC通常是跟fullGC是等价的，每次晋升到老年代的对象平均大小>老年代剩余空间，MinorGC后存活的对象超过了老年代剩余空间
    - 永久代空间不足
    - 执行System.gc()
    - CMS GC异常
    - 堆内存分配很大的对象

- ##### 为什么新生代要分Eden和两个 Survivor 区域？

- - 如果没有Survivor，Eden区每进行一次Minor GC，存活的对象就会被送到老年代。老年代很快被填满，触发Major GC.老年代的内存空间远大于新生代，进行一次Full GC消耗的时间比Minor GC长得多,所以需要分为Eden和Survivor。
  - Survivor的存在意义，就是减少被送到老年代的对象，进而减少Full GC的发生，Survivor的预筛选保证，只有经历15次Minor GC还能在新生代中存活的对象，才会被送到老年代。
  - 设置两个Survivor区最大的好处就是解决了碎片化，刚刚新建的对象在Eden中，经历一次Minor GC，Eden中的存活对象就会被移动到第一块survivor space S0，Eden被清空；等Eden区再满了，就再触发一次Minor GC，Eden和S0中的存活对象又会被复制送入第二块survivor space S1（这个过程非常重要，因为这种复制算法保证了S1中来自S0和Eden两部分的存活对象占用连续的内存空间，避免了碎片化的发生）

- ##### Java堆老年代( Old ) 和新生代 ( Young ) 的默认比例？

- - 默认的，新生代 ( Young ) 与老年代 ( Old ) 的比例的值为 1:2 ( 该值可以通过参数 –XX:NewRatio 来指定 )，即：新生代 ( Young ) = 1/3 的堆空间大小。老年代 ( Old ) = 2/3 的堆空间大小。
  - 其中，新生代 ( Young ) 被细分为 Eden 和 两个 Survivor 区域，Edem 和俩个Survivor 区域比例是 = 8 : 1 : 1 ( 可以通过参数 –XX:SurvivorRatio 来设定 )，
  - 但是JVM 每次只会使用 Eden 和其中的一块 Survivor 区域来为对象服务，所以无论什么时候，总是有一块 Survivor 区域是空闲着的。

- ##### 为什么要这样分代：

- - 其实主要原因就是可以根据各个年代的特点进行对象分区存储，更便于回收，采用最适当的收集算法：
  - 新生代中，每次垃圾收集时都发现大批对象死去，只有少量对象存活，便采用了复制算法，只需要付出少量存活对象的复制成本就可以完成收集。
  - 而老年代中因为对象存活率高、没有额外空间对它进行分配担保，就必须采用“标记-清理”或者“标记-整理”算法。新生代又分为Eden和Survivor （From与To，这里简称一个区）两个区。加上老年代就这三个区。数据会首先分配到Eden区当中（当然也有特殊情况，如果是大对象那么会直接放入到老年代（大对象是指需要大量连续内存空间的java对象）。当Eden没有足够空间的时候就会触发jvm发起一次Minor GC，。如果对象经过一次Minor-GC还存活，并且又能被Survivor空间接受，那么将被移动到Survivor空间当中。并将其年龄设为1，对象在Survivor每熬过一次Minor GC，年龄就加1，当年龄达到一定的程度（默认为15）时，就会被晋升到老年代中了，当然晋升老年代的年龄是可以设置的。

### 3、垃圾回收器他和垃圾算法

#### 1、垃圾回收器

垃圾收集器是垃圾回收算法（标记清楚法、标记整理法、复制算法、分代算法）的具体实现，不同垃圾收集器、不同版本的JVM所提供的垃圾收集器可能会有很在差别。

如果说垃圾收集算法是内存回收的方法论，那么垃圾收集器就是内存回收的具体实现。下图展示了7种作用于不同分代的收集器，其中用于回收新生代的收集器包括Serial、PraNew、Parallel Scavenge，回收老年代的收集器包括Serial Old、Parallel Old、CMS，还有用于回收整个Java堆的G1收集器。不同收集器之间的连线表示它们可以搭配使用。

1. Serial收集器（复制算法): 新生代单线程收集器，标记和清理都是单线程，优点是简单高效；

1. ParNew收集器 (复制算法): 新生代收并行集器，实际上是Serial收集器的多线程版本，在多核CPU环境下有着比Serial更好的表现；

1. Parallel Scavenge收集器 (复制算法): 新生代并行收集器，追求高吞吐量，高效利用 CPU。吞吐量 = 用户线程时间/(用户线程时间+GC线程时间)，高吞吐量可以高效率的利用CPU时间，尽快完成程序的运算任务，适合后台应用等对交互相应要求不高的场景；

1. Serial Old收集器 (标记-整理算法): 老年代单线程收集器，Serial收集器的老年代版本；

1. Parallel Old收集器 (标记-整理算法)： 老年代并行收集器，吞吐量优先，Parallel Scavenge收集器的老年代版本；

1. CMS(Concurrent Mark Sweep)收集器（标记-清除算法）： 老年代并行收集器，以获取最短回收停顿时间为目标的收集器，具有高并发、低停顿的特点，追求最短GC回收停顿时间。

1. G1(Garbage First)收集器 ( 标记整理 + 复制算法来回收垃圾 )： Java堆并行收集器，G1收集器是JDK1.7提供的一个新收集器，G1收集器基于“标记-整理”算法实现，也就是说不会产生内存碎片。此外，G1收集器不同于之前的收集器的一个重要特点是：G1回收的范围是整个Java堆(包括新生代，老年代)，而前六种收集器回收的范围仅限于新生代或老年代。

对象什么时候可以被垃圾器回收：

当对象对当前使用这个对象的应用程序变得不可触及的时候，这个对象就可以被回收了。 垃圾回收不会发生在永久代，如果永久代满了或者是超过了临界值，会触发完全垃圾回收(Full GC)。如果你仔细查看垃圾收集器的输出信息，就会发现永久代也是被回收的。这就是为什么正确的永久代大小对避免Full GC是非常重要的原因。

#### 2、垃圾回收算法

- JVM 垃圾回收算法
  - 标记-清除算法：标记无用对象，然后进行清除回收。缺点：效率不高，无法清除垃圾碎片。
  - 复制算法：按照容量划分二个大小相等的内存区域，当一块用完的时候将活着的对象复制到另一块上，然后再把已使用的内存空间一次清理掉。缺点：内存使用率不高，只有原来的一半。
  - 标记-整理算法：标记无用对象，让所有存活的对象都向一端移动，然后直接清除掉端边界以外的内存。
  - 分代算法：根据对象存活周期的不同将内存划分为几块，一般是新生代和老年代，新生代基本采用复制算法，老年代采用标记整理算法。

##### 1、标记-清除算法：标记无用对象，然后进行清除回收。

标记-清除算法（Mark-Sweep）是一种常见的基础垃圾收集算法，它将垃圾收集分为两个阶段：

1. 标记阶段：标记出可以回收的对象。

1. 清除阶段：回收被标记的对象所占用的空间。

标记-清除算法之所以是基础的，是因为后面讲到的垃圾收集算法都是在此算法的基础上进行改进的。

优点：实现简单，不需要对象进行移动。

缺点：标记、清除过程效率低，产生大量不连续的内存碎片，提高了垃圾回收的频率。

标记-清除算法的执行的过程如下图所示 

##### 2、复制算法

为了解决标记-清除算法的效率不高的问题，产生了复制算法。它把内存空间划为两个相等的区域，每次只使用其中一个区域。垃圾收集时，遍历当前使用的区域，把存活对象复制到另外一个区域中，最后将当前使用的区域的可回收的对象进行回收。

优点：按顺序分配内存即可，实现简单、运行高效，不用考虑内存碎片。

缺点：可用的内存大小缩小为原来的一半，对象存活率高时会频繁进行复制。

复制算法的执行过程如下图所示 

##### 3、标记-整理算法

在新生代中可以使用复制算法，但是在老年代就不能选择复制算法了，因为老年代的对象存活率会较高，这样会有较多的复制操作，导致效率变低。标记-清除算法可以应用在老年代中，但是它效率不高，在内存回收后容易产生大量内存碎片。因此就出现了一种标记-整理算法（Mark-Compact）算法，与标记-整理算法不同的是，在标记可回收的对象后将所有存活的对象压缩到内存的一端，使他们紧凑的排列在一起，然后对端边界以外的内存进行回收。回收后，已用和未用的内存都各自一边。

优点：解决了标记-清理算法存在的内存碎片问题。

缺点：仍需要进行局部对象移动，一定程度上降低了效率。

标记-整理算法的执行过程如下图所示 

##### 4、分代收集算法

当前商业虚拟机都采用 分代收集的垃圾收集算法。分代收集算法，顾名思义是根据对象的存活周期将内存划分为几块。一般包括年轻代、老年代和 永久代.

# 五、JVM常用指令及内存分析

- [官方文档](https://docs.oracle.com/en/java/javase/18/docs/specs/man/index.html)

- [jps,jstat](https://blog.csdn.net/amazinga/article/details/118353983)

- [jmap、jinfo、jstack、jcmd](https://blog.csdn.net/amazinga/article/details/118359036)

- jps（JavaVirtual Machine Process Status Tool）: 查看系统中运行的java线程的pid和实例。

- jstat（Java Virtual Machine statistics monitoring tool）允许用户查看目标 Java 进程的类加载、即时编译以及垃圾回收相关的信息。它常用于检测垃圾回收问题以及内存泄漏问题。
  - jstat -gc /pid/ /time/

- Jmap：可以查看内存信息情况的汇总，包含的实例个数以及占用内存大小
  - jprofiter

- jcmd:则是一把瑞士军刀，可以用来实现前面除了jstat之外所有命令的功能。

- jstack:将打印目标 Java 进程中各个线程的栈轨迹、线程状态、锁状况等信息。它还将自动检测死锁。
  - https://fastthread.io/
  - top -Hp pid | printf '%x\n'
  - Throughput
  - Latency

# 六、JVM常见异常分析

### 一、JVM调优

##### 1、概括：

1. JVM实践调优主要步骤

1. 分析GC日志

1. 堆内存与元空间优化

1. 线程堆栈优化

1. 堆内存内部优化：新生代和老年代比例

1. 垃圾回收器优化

##### 2、调优步骤

- 第一步：监控分析GC日志

- 第二步：判断JVM问题：
  - 如果各项参数设置合理，系统没有超时日志出现，GC频率不高，GC耗时不高，那么没有必要进行GC优化
  - 如果GC时间超过1-3秒，或者频繁GC，则必须优化。

- 第三步：确定调优目标
  - 调优一般是从满足程序的内存使用需求开始，之后是时间延迟要求，最后才是吞吐量要求，要基于这个步骤来不断优化，每一个步骤都是进行下一步的基础，不可逆行之。

- 第四步：调整参数

- 第五步：对比调优前后差距

- 第六步：重复： 1 、 2 、 3 、 4 、 5 步骤找到最佳JVM参数设置

- 第七步：应用JVM到应用服务器：找到最合适的参数，将这些参数应用到所有服务器，并进行后续跟踪。

##### 3、Jvm调优典型参数设置

-Xms堆内存的最小值：

默认情况下，当堆中可用内存小于40%时，堆内存会开始增加，一直增加到-Xmx的大小。

-Xmx堆内存的最大值： 默认值是总内存/64（且小于1G）

默认情况下，当堆中可用内存大于70%时，堆内存会开始减少，一直减小到-Xms的大小；

-Xmn新生代内存的最大值：

1.包括Eden区和两个Survivor区的总和 2.配置写法如：-Xmn1024k，-Xmn1024m，-Xmn1g

-Xss每个线程的栈内存：

默认1M，一般来说是不需要改。线程栈越小意味着可以创建的线程数越多

整个堆的大小 = 年轻代大小 + 年老代大小，堆的大小不包含元空间大小，如果增大了年轻代，年老代相应就会减小，官方默认的配置为年老代大小/年轻代大小=2/1左右； 建议在开发测试环境可以用Xms和Xmx分别设置最小值最大值，但是在线上生产环境，Xms和Xmx设置的值必须一样，防止抖动；

##### 4、gc监控常用参数

- -XX:+PrintGCDetails 开启GC日志创建更详细的GC日志 ，默认情况下，GC日志是关闭的

- -XX:+PrintGCTimeStamps，-XX:+PrintGCDateStamps 开启GC时间提示

- -XX:+PrintHeapAtGC 打印堆的GC日志

- -Xloggc:./logs/gc.log 指定GC日志路径

开启时间便于我们更精确地判断几次GC操作之间的时两个参数的区别 时间戳是相对于 0 （依据JVM启动的时间）的值，而日期戳（date stamp）是实际的日期字符串 由于日期戳需要进行格式化，所以它的效率可能会受轻微的影响，不过这种操作并不频繁， 它造成的影响也很难被我们感知。

##### 5、关注指标

1. Throughput：吞吐量（用户线程时间）/(用户线程时间+gc时间)

1. Latency：延迟时间

总之核心目标是降低fullGC的频率，降低单次GC的耗时

##### 6、理论JVM参数设置

1. 堆内存：参数-Xms和-Xmx，建议扩大至3-4倍FullGC后的老年代空间占用。（使其正常状态下ou为30%-50%）

1. 元空间：参数-XX:MetaspaceSize=N，设置元空间大小为128MB;（比稳定后的metasize稍大）

1. 新生代：参数-Xmn，建议扩大至1-1.5倍FullGC之后的老年代空间占用

1. xss:默认1M。Max Of Thread = (机器本身可用内存 -(JVM分配的堆内存+JVM元数据区)) / Xss值

1. G1:
   1. -XX:UseG1GC
   2. -XX:G1HeapRegionSize=size region区域大小
   3. -XX:MaxGCPauseMillis=time 延迟time目标
   4. -XX:InitiatingHeapOccupancyPercent=n 设置触发标记周期的 Java 堆占用率阈值。默认占用率是整个 Java 堆的 45%。

##### 7、oom常见异常

https://zhuanlan.zhihu.com/p/192839736

# 七、常见JVM概念区别

1. G1回收器：https://juejin.cn/post/7087702205897113636

1. ccs压缩类空间:在Java8以前，有一个选项是UseCompressedOops。所谓OOPS是指“ordinary object pointers“，就是原始指针。Java Runtime可以用这个指针直接访问指针对应的内存，做相应的操作（比如发起GC时做copy and sweep）。那么Compressed是啥意思？64bit的JVM出现后，OOPS的尺寸也变成了64bit，比之前的大了一倍。这会引入性能损耗——占的内存double了，并且同尺寸的CPU Cache要少存一倍的OOPS。于是就有了UseCompressedOops这个选项。打开后，OOPS变成了32bit。但32bit的base是8，所以能引用的空间是32GB——这远大于目前经常给jvm进程内存分配的空间。一般建议不要给JVM太大的内存，因为Heap太大，GC停顿实在是太久了。所以很多开发者喜欢在大内存机器上开多个JVM进程，每个给比如最大8G以下的内存。从JDK6_u23开始UseCompressedOops被默认打开了。因此既能享受64bit带来的好处，又避免了64bit带来的性能损耗。当然，如果你有机会使用超过32G的堆内存，记得把这个选项关了。到了Java8，永久代被干掉了，有了“meta space”的概念，存储jvm中的元数据，包括byte code，class等信息。Java8在UseCompressedOops之外，额外增加了一个新选项叫做UseCompressedClassPointer。这个选项打开后，class信息中的指针也用32bit的Compressed版本。而这些指针指向的空间被称作“Compressed Class Space”。默认大小是1G，但可以通过“CompressedClassSpaceSize”调整。如果你的java程序引用了太多的包，有可能会造成这个空间不够用，于是会看到java.lang.OutOfMemoryError: Compressed class space这时，一般调大CompreseedClassSpaceSize就可以了。

1. 方法区：https://blog.csdn.net/qq_43684005/article/details/119615972

1. [方法区，元空间，永久代](https://blog.csdn.net/a1489540461/article/details/120968113)

1. [hotspot/JRockit 等虚拟机区别、JIT/AOT概念等](https://blog.csdn.net/gzseehope/article/details/109678237)

1. [class常量池，运行时常量池，字符串常量池](http://tangxman.github.io/2015/07/27/the-difference-of-java-string-pool/)

# 八、生产各项目gc分析

| app   | gc分析报告                                                   | 内存使用                                                     | jvm参数                                                      | 检查结果                                     | 建议                                                  |
| ----- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------------------- | ----------------------------------------------------- |
| sug   | ![](/Users/dongyifeng/dongyf/git/typora/images/sb/493e9b4c-d7f8-4aca-a91c-0531fb3357e3.png) | ![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=NDZhMDM4NDc2ZTM5ZGYwNmQxMDgyYjRiZDdkMTk0MWJfanA1TmVaR2JxcEdBVnpSOElQNlVFZHg5djlPUHJWVUtfVG9rZW46Ym94Y25UNDU5QzlONVlXTVhDSVJqTDRnSFFiXzE2NjkxODQ4MjM6MTY2OTE4ODQyM19WNA)![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=YmVhMWJkNzJlMTc2ZWNiNzQyMzA2YWEzNGY4MTQzMmRfdFdsQVJmSzhOOTZyWlVPNEthUHRrdmc1Y203NnkzajdfVG9rZW46Ym94Y25BVHJHbUZ2NWlFTFFieUR2ZTdIN05nXzE2NjkxODQ4MjM6MTY2OTE4ODQyM19WNA) | Non-default VM flags: -XX:CICompilerCount=18 -XX:ConcGCThreads=11 -XX:G1HeapRegionSize=2097152 -XX:InitialHeapSize=6442450944 -XX:MarkStackSize=4194304 -XX:MaxHeapSize=6442450944 -XX:MaxNewSize=3145728000 -XX:MinHeapDeltaBytes=2097152 -XX:NewSize=3145728000 -XX:+PrintGC -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseFastUnorderedTimeStamps -XX:+UseG1GCCommand line:  -Dfile.encoding=UTF8 -Djava.net.preferIPv4Stack=true -Xmx6144m -Xms6144m -Xmn3000m -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -XX:+UseG1GC -Xloggc:./logs/gclogs/gc.log.20220815_163113 -Denv=production -Dsuggest=/data/deploy/search-suggest-server/bin/suggest_v3 -DhotSuggest=/data/deploy/search-suggest-server/bin/hot_suggest_v3 -Dsynonyms= -DconfSynonyms= -Dsubstitute= -DconfSubstitute= -Dlog.home=./logs -Dis.log.on=true -Dlog4j2.formatMsgNoLokups=true -Djava.net.preferIPv4Stack=true -Dfile.encoding=UTF-8 -Dxueqiu.env=production -Dxueqiu.service=search-suggest-server -Dxueqiu.ip=10.10.167.133 | 整体吞吐量超过99%，延迟时间最大不超过1s,健康 | 增大metaspace初始空间为128M，减少应用启动时的内存抖动 |
| query | ![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=NzA5NWUyNjRiMDQzMjFiZGQ5ZTlkZTU4ZGE3YzA0MzdfcXU2UWZFZHBrNDFaRGR3SEVxWTBNTXMwSzZBc3JtWmpfVG9rZW46Ym94Y25jYng2OG1ob01CVklZZGhXVEtxNHNmXzE2NjkxODQ4MjM6MTY2OTE4ODQyM19WNA) | ![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=MTdjMTYwNDhjZGNhYmQxNDQ0YzEwMjQwYTU5NDZkNjdfZVpOSEYzWkRiZDZ5Y00wMWJNaFF5eWY0YkFkbUVWZUlfVG9rZW46Ym94Y25RaGQ0Z09xV05xUElsSXBPMnZySzViXzE2NjkxODQ4MjM6MTY2OTE4ODQyM19WNA)![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=MzU1YjYzODIzNzE1ODIyZmJjZGNmYjY2OTE2ZWNjYjZfUVVpTlNKbFpTdUpnSExXb2VLc1ZITWVpY1FZOVNKSEZfVG9rZW46Ym94Y255N1VPNDdyOGM5ckplaFJkOFdYdERjXzE2NjkxODQ4MjM6MTY2OTE4ODQyM19WNA)![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=NTljOTM0NWVlM2ZhODllZmQwMjkwODhlMDNkODBhMTJfaUhGdFQyNGhPemw1dWt3elVyYXBNa01RZ0Y3Smc4UHZfVG9rZW46Ym94Y25IZ21QRmdnZFZGeGdvUWhjM1M5UHJnXzE2NjkxODQ4MjM6MTY2OTE4ODQyM19WNA) | JVM version is 25.202-b08Non-default VM flags: -XX:CICompilerCount=18 -XX:ConcGCThreads=11 -XX:G1HeapRegionSize=2097152 -XX:InitialHeapSize=6442450944 -XX:MarkStackSize=4194304 -XX:MaxHeapSize=6442450944 -XX:MaxNewSize=3145728000 -XX:MinHeapDeltaBytes=2097152 -XX:NewSize=3145728000 -XX:+PrintGC -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseFastUnorderedTimeStamps -XX:+UseG1GCCommand line:  -Dfile.encoding=UTF8 -Djava.net.preferIPv4Stack=true -Xmx6144m -Xms6144m -Xmn3000m -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -XX:+UseG1GC -Xloggc:./logs/gclogs/gc.log.20220907_170429 -Denv=production -Dsuggest=/data/deploy/search-query/bin/suggest_v3 -Dsynonyms=/data/deploy/search-query/bin/synonyms -DconfSynonyms=/data/deploy/search-query/conf/data/synonyms.txt -Dsubstitute=/data/deploy/search-query/bin/substitute -DconfSubstitute=/data/deploy/search-query/conf/data/substitute.txt -Dlog.home=./logs -Dis.log.on=true -Dlog4j2.formatMsgNoLokups=true -Djava.net.preferIPv4Stack=true -Dfile.encoding=UTF-8 -Dxueqiu.env=production -Dxueqiu.service=search-query -Dxueqiu.ip=10.10.168.3 | 整体吞吐量超过99%，延迟时间不超过1s,健康     |                                                       |
| sort  | ![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=YTUwMTYzODJhY2U0OGNlNzQ1NTAxMTU4NDk4YmFlY2NfUGdYSWs1Z3ZoUTRQb3ZMY3ZMSHduY0hRMW9LRmV4ZXhfVG9rZW46Ym94Y25KdGFlOGVOZVAxYlI1dkU4OUJNMGJjXzE2NjkxODQ4MjM6MTY2OTE4ODQyM19WNA) | ![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=MzYwYTYyY2NjNjhlY2IyNjgwMDg2MTZmMmUzNDRkYzVfcnE0MWtSN0xvTXBxU3U4N3ZDS0JpUmRlaEIwOWl1OTRfVG9rZW46Ym94Y240QldLNExHUU1tU3VNVkhHZjFka1FiXzE2NjkxODQ4MjM6MTY2OTE4ODQyM19WNA) | JVM version is 25.241-b07Non-default VM flags: -XX:CICompilerCount=18 -XX:ConcGCThreads=11 -XX:G1HeapRegionSize=2097152 -XX:InitialHeapSize=4294967296 -XX:MarkStackSize=4194304 -XX:MaxHeapSize=4294967296 -XX:MaxNewSize=1572864000 -XX:MinHeapDeltaBytes=2097152 -XX:NewSize=1572864000 -XX:+PrintGC -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseFastUnorderedTimeStamps -XX:+UseG1GCCommand line:  -Dfile.encoding=UTF8 -Djava.net.preferIPv4Stack=true -Xmx4096m -Xms4096m -Xmn1500m -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -XX:+UseG1GC -Xloggc:./logs/gclogs/gc.log.20220908_170316 -Denv=production -DmodelA=/data/deploy/search-sort/bin/xgboostModel -DmodelB=/data/deploy/search-sort/bin/xgboostModelB -DconfModelA=/data/deploy/search-sort/conf/model/xgboostModel.txt -DconfModelB=/data/deploy/search-sort/conf/model/xgboostModelB.txt -Dlog.home=./logs -Dis.log.on=true -Dlog4j2.formatMsgNoLokups=true -Djava.net.preferIPv4Stack=true -Dfile.encoding=UTF-8 -Dxueqiu.env=production -Dxueqiu.service=search-sort -Dxueqiu.ip=10.10.165.145 | 整体吞吐量超过99%，延迟时间不超过1s,健康     |                                                       |
| index | ![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=MjgwYzE5YzRkMTc5MzQ1NzIwN2NkMzM2NjE3ZmE5NDBfNVVEV3l4T2Q5RGhTYmdwUXA1aWdqTVRpdUJYVnltNjBfVG9rZW46Ym94Y25wTlMyZkJXMFhBZ1owbkJXR21vemxQXzE2NjkxODQ4MjM6MTY2OTE4ODQyM19WNA) | ![img](https://xueqiu.feishu.cn/space/api/box/stream/download/asynccode/?code=MjM5MWVmODIwNzEyODFlYWVhMjMyMjE4Zjk5NjU5ZDBfVW9NQkR6QTRSYzVGT3BGamFFSVVGak1HUnQ5UmRVTnVfVG9rZW46Ym94Y25CVkRYcXNnYUR5NzhlaFp3bXV5dmxoXzE2NjkxODQ4MjM6MTY2OTE4ODQyM19WNA) | VM version is 25.202-b08Non-default VM flags: -XX:CICompilerCount=15 -XX:ConcGCThreads=8 -XX:G1HeapRegionSize=2097152 -XX:InitialHeapSize=4294967296 -XX:MarkStackSize=4194304 -XX:MaxHeapSize=4294967296 -XX:MaxNewSize=1572864000 -XX:MinHeapDeltaBytes=2097152 -XX:NewSize=1572864000 -XX:+PrintGC -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseFastUnorderedTimeStamps -XX:+UseG1GCCommand line:  -Dfile.encoding=UTF8 -Djava.net.preferIPv4Stack=true -Xmx4096m -Xms4096m -Xmn1500m -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -XX:+UseG1GC -Xloggc:./logs/gclogs/gc.log.20220906_163627 -Denv=production -Dlog.home=./logs -Dis.log.on=true -Dlog4j2.formatMsgNoLokups=true -Djava.net.preferIPv4Stack=true -Dfile.encoding=UTF-8 -Dxueqiu.env=production -Dxueqiu.service=search-index -Dxueqiu.ip=10.10.33.41 | 整体吞吐量超过99%，延迟时间不超过1s,健康     |                                                       |