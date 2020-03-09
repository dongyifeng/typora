[TOC]

# Futures

Guava提供了 FutureCallback 用于对Future的返回结果进行处理。FutureCallback 中实现了两个方法:
● onSuccess(V),在Future成功的时候执行，根据Future结果来判断。
● onFailure(Throwable)，在Future失败的时候执行，根据Future结果来判断。

FutureCallback 通过 Futures 添加回调。

Futures 常用工具：

| 方法                                                         | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| transformAsync(ListenableFuture*, AsyncFunction<I, O>, Executor*) | 返回一个新的ListenableFuture，该ListenableFuture 返回的result是由传入的AsyncFunction 参数指派到传入的 ListenableFuture中 |
| transformAsync(ListenableFuture*, AsyncFunction<I, O>,)*     | 返回一个新的ListenableFuture ，该ListenableFuture 返回的result是由传入的AsyncFunction 参数指派到传入的 ListenableFuture中 |
| allAsList(Iterable<ListenableFuture)                         | 返回一个ListenableFuture ，该ListenableFuture 返回的result是一个List，List中的值是每个ListenableFuture的返回值，假如传入的其中之一fails或者cancel，这个Future fails 或者canceled |
| successfulAsList(Iterable<ListenableFuture)                  | 返回一个ListenableFuture ，该Future的结果包含所有成功的Future，按照原来的顺序，当其中之一Failed或者cancel，则用null替代 |



# ListenableFuture

  ListenableFuture 继承了 Future，它允许注册回调方法(callbacks)，在运算（多线程执行）完成的时候进行调用，或者在运算（多线程执行）完成后立即执行。

    ListenableFuture 中的基础方法是addListener(Runnable, Executor)，该方法会在多线程运算完的时候，指定的Runnable参数传入的对象会被指定的Executor执行。

​         对应JDK中的 ExecutorService.submit(Callable) 提交多线程异步运算的方式，Guava 提供了ListeningExecutorService 接口，该接口返回 ListenableFuture 而相应的 ExecutorService 返回普通的 Future。将 ExecutorService 转为 ListeningExecutorService，可以使用MoreExecutors.listeningDecorator(ExecutorService)进行装饰。

ListenableFuture的实现：

```java
import com.google.common.collect.Lists;
import com.google.common.util.concurrent.*;

import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors; 

    private void FutureTest3() throws Exception {
        ListeningExecutorService executor = MoreExecutors.listeningDecorator(Executors.newSingleThreadExecutor());
        ListenableFuture<String> future = executor.submit(new Callable<String>() {
            @Override
            public String call() throws Exception {
                return "ghi";
            }
        });

        // 添加回调
        Futures.addCallback(future, new FutureCallback<String>() {
            @Override
            public void onSuccess(String result) {
                System.out.println(result);
            }

            @Override
            public void onFailure(Throwable t) {
                t.printStackTrace();
            }
        });

        if (!executor.isShutdown()) {
            executor.shutdown();
        }
    }

```