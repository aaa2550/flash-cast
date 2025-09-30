package com.flashcast.config;

import com.flashcast.common.ProxyRunnable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Configuration
public class ThreadPoolConfig {

    @Bean
    public ThreadPoolExecutor taskThreadPoolExecutor() {

        PriorityBlockingQueue<Runnable> priorityBlockingQueue = new PriorityBlockingQueue<>();

        ThreadFactory threadFactory = new ThreadFactory() {
            private int count = 1;

            @Override
            public Thread newThread(Runnable runnable) {
                Thread thread = new Thread(new ProxyRunnable(runnable));
                thread.setDaemon(true);
                thread.setName("task-executor-" + count);
                count++;
                return thread;
            }
        };
        return new ThreadPoolExecutor(2, 2, 10L, TimeUnit.SECONDS, priorityBlockingQueue, threadFactory);
    }

}
