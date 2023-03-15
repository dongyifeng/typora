---
typora-root-url: ../../../typora
---

[TOC]



新生代：老年代 = 1：2

Eden 空间和另外两个 Survivor 空间缺省占比的比例是：8:1:1



- <font color=red>吞吐量：运行用户代码的时间占总运行时间的比例</font>
  - 总运行时间 = 程序的运行时间 + 内存回收的时间
- 垃圾收集开销：吞吐量的补数，垃圾收集所用时间占总运行时间的比例。
- <font color=red size=4>**暂停时间：执行垃圾收集时，程序的工作线程被暂停的时间。**</font>
- 收集频率：相对于应用程序的执行，收集操作发生的频率。
- <font color=red>内存占用：Java 堆区所占的内存大小</font>
- 快速：一个对象从诞生到被回收所经历的时间。



$吞吐量 = \frac{运行用户代码时间}{运行用户代码时间 \\+ GC 时间}$

<font color=green>吞吐量优先</font>，意味着在单位时间内，STW 的时间最短。

<font color=green>低延迟优先</font>，意味着<font color=red>每次</font> GC 的 STW 的时间最短。



<img src="/images/java/WX20230112-184921@2x.png" style="zoom:30%;" />



- Serial 回收器：串行回收
  - 新生代：复制算法（新生代）
  - Serial Old：采用标记-压缩算法
  - <img src="/images/java/WX20230112-210036@2x.png" style="zoom:20%;" />
- ParNew GC：相关于 Serial 多线程版。
  - <img src="/images/java/WX20230112-212501@2x.png" style="zoom:20%;" />
- Parallel Scavenge：吞吐量优先<font color=green>**可控制吞吐量（Throughput）**</font>
  - 新生代：复制算法（新生代）
  - 老年代：采用标记-压缩算法
  - 使用场景：高吞吐量则可以高效率地利用 CPU 时间，尽快完成程序的运算任务，主要<font color=green>适合在后台运算而不需要太多交互的任务。</font>例如：<font color=orange>批处理、订单处理、工资支付、科学计算等</font>
  - <font color=green>-XX:GCTimeRatio</font>：垃圾收集时间占总时间的比例（用于衡量吞吐量的大小）=$\frac{1}{N+1}$
    - 取值范围（0,100），默认值：99，也就说垃圾回收时间不超过 1%。
    - GCTimeRatio 的值越大垃圾收集时间占总时间的比例越小，吞吐量越大。
    - <font color=red>控制吞吐量</font>





# JVM 调优原则

1. 大多数的 java 应用不需要 GC 调优
2. 大部分需要 GC 调优的的，不是参数问题，是代码问题 [ 通过top -h 、[jmap](https://www.zhihu.com/search?q=jmap&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A"2560449750"})等一系列工具进行定位问题，然后进行 代码块优化 ]
3. 在实际使用中，分析 GC 情况优化代码比优化 GC 参数要多得多;
4. GC 调优是最后的手段（对服务器配置的最后一次“压榨”）



# JVM 优化思路

1. 业务预估：根据预期的并发量、平均每个任务的内存需求大小，然后评估需要几台机器来承载，每台机器需要什么样的配置。
2. 容量预估：根据系统的任务处理速度，然后合理分配Eden、Surivior区大小，老年代的内存大小。
3. 回收器选型：响应优先的系统，建议采用 ParNew + CMS 回收器；吞吐优先、多核大内存(heap size ≥ 8G)服务，建议采用 G1 回收器。
4. 优化思路：让短命对象在 YGC 阶段就被回收（同时回收后的存活对象<Survivor区域50%，可控制保留在新生代），长命对象尽早进入老年代，不要在新生代来回复制；尽量减少Full GC的频率，避免FGC系统的影响。
5. 到目前为止，总结到的调优的过程主要基于上线前的测试验证阶段，所以我们尽量在上线之前，就将机器的JVM参数设置到最优！



# 新上系统 JVM 容量调优？

- 计算业务系统每秒钟创建的对象会佔用多大的内存空间，然后计算集群下的每个系统每秒的内存佔用空间（对象创建速度）

- 设置一个机器配置，估算新生代的空间，比较不同新生代大小之下，多久触发一次MinorGC。

- 为了避免频繁GC，就可以重新估算需要多少机器配置，部署多少台机器，给JVM多大内存空间，新生代多大空间。

- 根据这套配置，基本可以推算出整个系统的运行模型，每秒创建多少对象，1s以后成为垃圾，系统运行多久新生代会触发一次GC，频率多高。

例子

- 假设每天100w次登陆请求，登陆峰值在早上，预估峰值时期每秒100次登陆请求。

- 假设部署 3台服务器，每台机器每秒处理 30 次登陆请求，假设一个登陆请求需要处理 1 秒钟，JVM新生代里每秒就要生成 30 个登陆对象，1s之后请求完毕这些对象成为了垃圾。

- 一个登陆请求对象假设 <font color=red>20 个字段</font>，一个对象估算 <font color=red>500 字节</font>，30 个请求佔用大约 <font color=red>15 KB</font>，考虑到RPC和 DB操作，网络通信、写库、写缓存一顿操作下来，可以扩大到<font color=red> 20-50倍</font>，大约1s产生<font color=red>几百k 到 1M</font>数据。

- 假设 2C4G 机器部署，分配 2G 堆内存，新生代则只有几百M，按照<font color=red>1s 产生 1M</font>的垃圾产生速度，<font color=red>几百秒</font>就会触发一次YGC了。

- 假设4C8G机器部署，分配 4G 堆内存，新生代分配 1.3 G（默认配比），如此需要二十多分钟才会触发一次 YGC。



可以粗略的推断出来峰值 QPS 30 的登录系统，按照 4C 8G的 3 实例集群配置，分配 4G 堆内存、2G 新生代的 JVM，可以保障系统的一个正常负载。



# 如何对各个分区的比例、大小进行规划

是让短期存活的对象尽量都留在 survivor 里，不要进入老年代，这样在 YGC 的时候这些对象都会被回收，不会进到老年代从而导致full  gc。



JVM最重要最<font color=red>核心的参数</font>是去评估内存和分配，第一步需要指定堆内存的大小，这个是系统上线必须要做的，<font color=red>-Xms 初始堆大小，-Xmx 最大堆大小</font>，后台Java服务中一般都指定为系统内存的一半，过大会佔用服务器的系统资源，过小则无法发挥JVM的最佳性能。

需要指定 -Xmn新生代的大小，这个参数非常关键，灵活度很大，但是要根据业务场景来定，

- 针对于<font color=red>无状态或者轻状态服务</font>（现在最常见的业务系统如Web应用）来说，一般新生代甚至可以给到<font color=red>堆内存的 3/4 大小</font>；
- 而对于<font color=red>有状态服务</font>（常见如IM服务、网关接入层等系统）新生代可以按照<font color=red>默认比例 1/3 来设置</font>。服务有状态，则意味著会有更多的本地缓存和会话状态信息常驻内存，应为要给老年代设置更大的空间来存放这些对象。



新生代：老年代 = 1：2

Eden 空间和另外两个 Survivor 空间缺省占比的比例是：8:1:1



# GC 算法？

**标记清除算法**：

- <font color=green>**标记：**</font> Collector 从引用根节点开始遍历，<font color=red>标记所有被引用的对象</font>。一般是在对象的 Header 中记录为可达对象。
- <font color=green>**清除：**</font>Collector 对堆内存从头到尾进行线性的遍历，如果发现某个对象在其 Header 中没有标记为可达对象，则将其回收。

<img src="/images/java/WX20221229-153121@2x.png" style="zoom:20%;" /

**缺点**

- 这种方式清理出来的空闲内存是不连续的，产生内存碎片。系统运行时间长了以后，无法再大量分配<font color=green>连续的内存空间</font>，会导致<font color=green>更加频繁地出发 GC</font> 操作。
- 效率不高
- 在进行 GC 的时候，需要停止整个应用程序，导致用户体验差



**标记复制算法**：

**背景：**为了解决标记-清除算法在垃圾收集效率方面的缺陷。

将活着的<font color=red>内存空间分为两份</font>，每次只使用其中一块，在垃圾回收时将正在使用的内存中的存活对象复制到未被使用的内存块中，之后清除正在使用的内存块中的所有对象，交换两个内存的角色，最后完成垃圾回收。



**优点**

- 没有标记和清除过程，实现简单，运行高效。
- 复制过去以后保证空间的连续性，不会出现内存“碎片”问题。

**缺点**

- 需要两倍的内存空间。
- 对于 G1 这种分拆成为大量 region 的 GC，复制而不是移动，意味着 GC 需要维护 region 之间的对象引用关系，不管是内存占用或者时间开销也是不小

场景：

- YGC：如果系统中的<font color=green>垃圾对象很多，复制算法需要复制的对象数量不是太大</font>，这种场景适合复制算法，比如 YGC 的 s0 和 s1

<img src="/images/java/WX20221229-155014@2x.png" style="zoom:30%;" />



**标记整理算法**：

**执行过程**

- 第一阶段和标记清楚算法一样，从根节点开始标记所有被引用的对象。
- 第二阶段将所有的<font color=green>存活对象压缩到内存的一端</font>，按顺序排放。之后，清理边界外所有的空间。

<img src="/images/java/WX20221229-173945@2x.png" style="zoom:30%;" />



# 分代收集算法

分代收集算法将<font color=green>不同生命周期的对象采用不同的收集方式，以便提高回收效率。</font>

- 年轻代（Young Gen）
  - 年轻代特点：<font color=orange>区域相对老年代较小，对象生命周期短、存活率低，回收频繁。</font>
  - 年轻代使用<font color=red>复制算法</font>回收整理，<font color=red>速度最快，没有内存碎片</font>。复制算法的效率只和当前存活对象大小有关，因此很适合用于年轻代的回收。而复制算法内存利用率不高的问题，通过 hotspot 中的两个 survivor 的设计得到缓解。
- 老年代（Tenured Gen）
  - 老年代特点：<font color=orange>区域较大，对生生命周期长、存活率高，回收不及年轻代频繁。</font>
  - 这种情况存在大量存活率高的对象，复制算法明显变得不合适。一般由<font color=red>标记-清除算法或者标记-整理算法</font>混合实现
    - Mark 阶段的开销与存活对象的数量成正比
    - Sweep 阶段的开销与所管理区域的大小成正相关
    - Compact 阶段的开销与存活对象的数量成正比

<img src="/images/java/screenshot-20221228-194623.png" style="zoom:20%;" />

# CMS

- 低延迟

<font color=green>这款收集器时 HotSpot 第一款真正意义上的并发收集器，它第一次实现了让垃圾收集器与用户线程同时工作。</font>

<font color=red>**标记-清除算法**</font>

**CMS 的工作原理**

- 初始标记（Initial-Mark）阶段：这个阶段是 “Stop-the-World”。这个阶段的主要任务：<font color=red>仅仅标记出 GC Roots 能直接关联到的对象。</font>一旦标记完成后，就会恢复之前被暂停的所有应用线程。由于直接关联对象比较少，所以这里的<font color=red>速度非常快。</font>确定垃圾回收需要扫描对象的根节点。
- 并发标记（Concurrent-Mark）阶段：从 GC Roots 的<font color=red>直接关联对象开始遍历整个对象图的过程，</font>这个过程<font color=red>耗时较长</font>但是<font color=red>不需要停顿用户线程</font>，可以与垃圾收集线程一起并发运行。
- 重新标记（Remark）阶段：由于在并发标记阶段中，程序的工作线程会和垃圾收集线程同时运行或者交叉运行，因此为了<font color=red>修正并发标记期间，因用户程序继续运行而导致标记产生变动的那一部分对象的标记记录</font>，这个阶段的停顿时间通常会比初始标记阶段稍长一些，但也远比并发标记阶段的时间短。
- 并发清除（Concurrent-Sweep）阶段：此阶段<font color=red>清理删除掉标记阶段判断为已经死亡的对象，释放内存空间。</font>由于不需要移动存活对象，所以这个阶段也是可以与用户线程同时并发的。（为了此阶段能与用户线程并发执行，因而不能使用标记-压缩算法，标记-压缩算法改变了对象的内存地址，会导致用户线程执行异常。）

<img src="/images/java/WX20230113-154325@2x.png" style="zoom:50%;" />

**CMS 的优点**

- 并发收集
- 低延迟



**CMS 的弊端**

- 由于使用标记-清除算法导致<font color=green>会产生内存碎片，</font>用户线程可用的空间不足。在无法分配大对象的情况下，不得不提前触发 Full GC。
- <font color=green>CMS 收集器对 CPU 资源非常敏感。</font>在并发阶段，它虽然不会导致用户停顿，但是会因为占用了一部分线程而导致应用程序变慢，总吞吐量会降低。
- <font color=green>CSM 收集器无法处理浮动垃圾。</font>可能出现“Concurrent Mode Failure” 失败而导致另一次 Full GC 的产生。在并发标记阶段由于程序的工作线程和垃圾收集线程时同时运行或者交叉运行的，那么在<font color=green>并发标记阶段如果产生新的垃圾对象，CMS 将无法对这些垃圾对象进行标记，最终会导致这些新产生的垃圾对象没有被及时回收</font>，从而只能在下一次执行 GC 时释放这些之前未被收回的内存空间。 



# G1

<font color=red>G1 设定的目标是在延迟可控的情况下获得尽可能高的吞吐量，所以才担当器 “全功能收集器” 的重任与期望。</font>



<img src="/images/java/WX20230114-165353@2x.png" style="zoom:20%;" />

G1 GC 的垃圾回收过程主要包括如下三个环节：

1. 年轻代（Young GC）：触发条件：<font color=red>Eden 区用尽时</font>
2. 老年代并发标记过程（Concurrent Marking）:触发条件：<font color=red>堆内存使用达到一定阈值（默认值 45%）</font>
3. 混合回收（Mixed GC）：标记完成后，所有的垃圾对象，不管是新生代还是老年代统统回收。触发条件：<font color=red>标记完成马上开始混合回收过程</font>
4. 兜底回收方案：如果需要，单线程、独占式、高强度的 Full GC 还是继续存在的。它针对 GC 的评估失败提供一种失败保护机制，即强力回收。



**触发条件不一样：**

**年轻代：**<font color=blue>Eden 区用尽时开始年轻代回收过程；</font> G1 的年轻代收集阶段是一个<font color=blue>并行</font>的<font color=blue>独占式</font>收集器。在年轻代回收期，G1 GC 暂停所有应用程序线程，启动多线程执行年轻代回收。然后<font color=blue>从年轻代区间移动存活对象到 Survivor Region 或者 老年代 Region，也有可能是两个区间都会涉及。</font>



当堆内存使用达到一定阈值（默认值 45%）时，开始<font color=red>老年代并发标记过程</font>。



标记完成马上开始<font color=red>混合回收过程</font>。对于混合回收期，G1 GC 从老年 Region 移动存活对象到空闲 Region，这个空闲 Region 也就成为了老年代的一部分。和年轻代不同，老年代的 G1 回收器和其他 GC 不同，<font color=blue>G1 的老年代回收器不需要整个老年代被回收，一次只需要扫描/回收一小部分老年代的 Region 就可以了。</font>同时，这个老年代 Region 是和年轻代一起被回收的。

<img src="/images/java/WX20230101-130019@2x.png" style="zoom:20%;" />



**Young GC 过程如下**

- <font color=red>**第一阶段：扫描根**</font>（GC Roots）
  - 根是指 static 变量指向的对象，正在执行的方法调用链条上的局部变量等。根引用连同 Rset 记录的外部引用作为扫描存活对象的入口。
- <font color=red>**第二阶段：更新 Rset**</font>
  - 处理 dirty car queue 中的 card，更新 RSet。此阶段完成后，<font color=blue>RSet 可以准确的反映老年代对所在的内存分段中对象的引用。</font>
- <font color=red>**第三阶段：处理 Rset**</font>
  - 识别被老年代对象指向的 Eden 中的对象，这些被指向的 Eden 中的对象被认为是存活的对象。
- <font color=red>**第四阶段：复制对象（垃圾回收：复制算法执行）**</font>
  - 此阶段，对象树被遍历，<font color=red>Eden 区</font>内存段中存活的对象会被复制到 <font color=red>Survivor</font> 区中空的内存分段，Survivor 区内存段中存活的对象如果年龄未达到阈值，<font color=red>年龄会加 1</font>，达到阈值会被复制到 Old 区中空的内存分段。如果 Survivor 空间不够，Eden 空间的部分数据会<font color=red>直接晋升到老年代空间</font>
- <font color=red>**第五阶段：处理引用 **</font>
  - 处理 Soft、Weak、Phantom、Final、JNI Weak  等引用。最终 Eden 空间的数据为空，GC 停止工作，而目标内存中的对象都是连续存储的，没有碎片，所以复制过程可以达到内存整理的效果，减少碎片。



类似 CMS 的并发标记

### G1 回收过程：并发标记过程

- <font color=red>**1. 初始标记阶段：**</font>标记从根节点（GC Roots）<font color=red>直接可达的对象</font>。这个阶段是 <font color=red>STW</font> 的，并且会触发一次年轻代 GC。
- <font color=red>**2. 根区域扫描（Root Region Scanning）：**</font> G1 GC 扫描 Survivor 区直接可达的老年代区域对象，并标记被引用的对象。这一过程必须在 Young GC 之前完成（因为 Young GC 会调整 Survivor 的数据）。
- <font color=red>**3. 并发标记（Concurrent Marking）：**</font>在整个堆中进行并发标记（和应用程序并发执行），此过程可能被 Young GC 中断。在并发标记阶段，<font color=blue>若发现区域中的所有对象都是垃圾，那这个区域被立即回收。</font>同时，并发标记过程中，会计算每个区域的对象活性（区域存活对象的比例）。
- <font color=red>**4. 再次标记（Remark）：**</font>由于应用程序持续进行，需要修正上一次的标记结果。是 STW 的。G1中采用采用了比 CMS 更快的初始快照算法：snapshot-at-the-beginning（SATB）。
- <font color=red>**5. 独占清理（cleanup,STW）：**计算</font>各个区域的存活对象和 GC 回收比例，<font color=red>并进行排序</font>，识别可以混合回收的区域。为下阶段做铺垫。是 STW 的。
  - 这个阶段并<font color=red>不会实际上去做垃圾的收集。</font>
- <font color=red>**6. 并发清理阶段：**</font>识别并清理完全空闲的区域。



### G1 回收过程：混合回收

- 并发标记结束以后，百分之百为垃圾的老年代 Region 已经被回收了，部分为垃圾的 Region 被计算出来。
- <font color=blue>混合回收的算法和年轻代的算法完全一样，只是回收集多了老年代的 Region。</font>
- <font color=blue>垃圾内存分段比例越高的 Region，越会被先回收。</font> 



参考：

- 并发标记结束以后，百分之百为垃圾的老年代 Region 已经被回收了，部分为垃圾的 Region 被计算出来。默认情况下，这些老年代的 Region 会分 8 次（可以通过 XX:G1MixedGCCountTarget 设置）被回收。
- 混合回收的回收集（Collection Set） 包括八分之一的老年代 Region，Eden 区 Region，Survivor 区 Region。<font color=blue>混合回收的算法和年轻代的算法完全一样，只是回收集多了老年代的 Region。</font>
- 由于老年代中的 Region 默认分 8 次回收，G1 会优先回收垃圾多的 Region。<font color=blue>垃圾内存分段比例越高的 Region，越会被先回收。</font> 并且有一个阈值会决定 Region 是否被回收，-XX:G1MixedGCLiveThresholdPercent，默认为 65%，意思是垃圾内 Region 比例要到达 65% 才会被回收。如果垃圾占比太低，意味着存活的对象占比高，在复制的时候会花费更多的时间。
- 混合回收并不一定要进行 8 次。有一个阈值 -XX:G1HeapWastePercent，默认值为 10%，意思是允许整个堆内存中 10% 的空间被浪费，意味着如果发现可以回收的垃圾占堆内存的比例低于 10%，则不在进行混合回收。因为 GC 会花费很多的时间但是回收到的内存却很少。



### G1 回收过程：Full GC

G1 被设计的初衷就是要：避免 Full GC 的出现。

导致 G1 进行 Full GC 的原因：

1. Evacuation 的时候没有足够的 to-space 来存放晋升的对象。
2. 并发处理过程完成之前空间耗尽。



### G1 回收器优化建议

年轻代大小

- 避免使用 -Xmn 或 -XX:NewRatio 等相关选项显式设置年轻代大小，因为固定年轻代的大小会覆盖暂停时间目标。



暂停时间目标不要太过严苛

- G1 GC 的吞吐量目标是 90% 的应用程序时间和 10% 的垃圾回收时间。
- 评估 G1 GC  的吞吐量时，暂停时间目标不要太严苛。目标太严苛表示你愿意承受更多的垃圾回收次数，会直接影响到吞吐量。





# 逃逸分析

<font color=red>**如果经过逃逸分析（Escape Analysis）后发现，一个对象并没有逃逸出方法的话，那么就可能被优化成栈上分配。**</font>

逃逸分析的基本行为就是分析对象动态作用域

- <font color=green>当一个对象在方法中定义后</font>，对象只在方法内部使用，则认为没有发生逃逸。
- <font color=green>当一个对象在方法中定义后</font>，它被外部方法引用，则认为发生了逃逸。例如：作为调用参数传递到其他方法中。

没有放生逃逸的对象，则可以分配到栈上，随着方法执行的结束，栈空间就被移除。栈有自动过期（出栈）机制。栈帧线程私有，如果对象没有逃逸，那么它的作用域就在栈帧内部，不可能共享，可以随着栈帧而生，随着栈帧而亡。



对于没有逃逸对象进行代码优化

1. <font color=red>栈上分配。</font>将对分配转化为栈分配
2. <font color=red>同步省略。</font>如果发现一个对象只能被一个线程访问到，那么对于这个对象的操作可以不考虑同步了。
3. <font color=red>分离对象或标量替换。</font>有的对象可能不需要作为一个连续的内存结构存在，也可以被访问到，那么对象的部分（或者全部）可以不存储在内存，而是存储 Java 栈中。



**逃逸分析小结：逃逸分析并不成熟**

<font color=red>无法保证逃逸分析的性能消耗一定能高于他的消耗。虽然经过逃逸分析可以做标量替换、栈上分配、和锁消除。但是逃逸分析自身也是需要进行一系列复杂的分析的，这其实也是一个相对耗时的过程。 </font>



一个极端的例子，就是经过逃逸分析之后，发现没有一个对象是不逃逸的。那这个逃逸分析的过程就白白浪费掉了。

虽然这项技术并不十分成熟，但是它也是<font color=red>即时编译器优化技术中一个十分重要的手段。</font>

注意到有一些观点，认为通过逃逸分析，JVM会在栈上分配那些不会逃逸的对象，这在理论上是可行的，但是取决于JVM设计者的选择。据我所知，Oracle Hotspot JVM中并未这么做，这一点在逃逸分析相关的文档里已经说明，所以可以明确<font color=red>所有的对象实例都是创建在堆上。</font>



# OOM 排查过程

1. 通过 `jstat -gcutil 进程编号  间隔时间  次数` 命令查看线上 JVM 的情况。作为初步判断

​			S0、S1、伊甸园、老年代占比是否健康，YGC 次数和 FGC 次数。

​				有 OOM 大部分是 老年代几乎占满。FGC 次数非常多。这说明：老年代中存在大量无法回收的对象，最后老年代被撑满，内存溢出。

<img src="/images/tmp/WX20230308-173916.png" style="zoom:33%;" />

2. 使用 Arthas 工具：也是看个大概

Java -jar arthas-boot.jar 		



![](/images/tmp/WX20230308-175142.png)

输入命令：dashboard 

<img src="/images/tmp/WX20230308-175334.png" style="zoom:33%;" />



3. jmap -dump file_name ：下载 JVM 内存快照。

4. 利用 visualvm 工具，对 dump 文件离线分析。

   1. 发现类的实例偏高：instances
   2. HashMap\$Node 和 ConcurrentHashMap\$Node  这两个实例对象比其他实例多出一个数量级。可能有问题。

   

<img src="/images/tmp/WX20230308-180159.png" style="zoom:33%;" />



​	<img src="/images/tmp/WX20230308-180505.png" style="zoom:33%;" />

右键-> Open in new Tab

<img src="/images/tmp/WX20230308-180555.png" style="zoom:33%;" />

新窗口

<img src="/images/tmp/WX20230308-180624.png" style="zoom:33%;" />

选择一个实例，点击的 GC Root，查看引用链。由于 GC Root 的关联导致实例无法被回收。

![](/images/tmp/WX20230308-180732.png)



引用链

<img src="/images/tmp/WX20230308-180844.png" style="zoom:33%;" />



右键 --> select in Threads 

<img src="/images/tmp/WX20230308-181024.png" style="zoom:33%;" />

这样就找到了问题的具体地址：

分析：这些非常多的实例都与 连接有关，是不是使用连接后，没有关闭导致的？



<img src="/images/tmp/WX20230308-181119.png" style="zoom:33%;" />



这个类是第三方 jar 中的类：这里就是第三方 jar 关闭连接的地方。

<img src="/images/tmp/WX20230308-181531.png" style="zoom:33%;" />



业务代码：获取 ossClient 没有释放连接。

<img src="/images/tmp/WX20230308-181659.png" style="zoom:33%;" />



可以在本地验证：启动程序查看是否 HashMap\$Node 和 ConcurrentHashMap\$Node  实例是否增加。加上连接关闭，情况能否好转。



https://www.bilibili.com/video/BV1yQ4y1y7CE/?spm_id_from=333.788&vd_source=33cf6df70b8d525d3f3f293e32d3815d



Arthas 能解决的问题：

1. 这个类从哪个 jar 包加载的？为什么会报各种类相关的 Exception？
2. 我改的代码为什么没有执行到？难道是我没 commit？分支搞错了？
3. 遇到问题无法在线上 debug，难道只能通过加日志再重新发布吗？
4. 线上遇到某个用户的数据处理有问题，但线上同样无法 debug，线下无法重现！
5. 是否有一个全局视角来查看系统的运行状况？
6. 有什么办法可以监控到 JVM 的实时运行状态？
7. 怎么快速定位应用的热点，生成火焰图？
8. 怎样直接从 JVM 内查找某个类的实例？

下载 arthas-boot.jar

```shell
curl -O https://arthas.aliyun.com/arthas-boot.jar
```



https://arthas.aliyun.com/doc/