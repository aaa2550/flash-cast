package com.flashcast.dto;

import lombok.Getter;

@Getter
public class PriorityTask implements Runnable, Comparable<Integer> {

    private final int priority; // 优先级，数字越小优先级越高
    private final Runnable runnable;

    public PriorityTask(int priority, Runnable task) {
        this.priority = priority;
        this.runnable = task;
    }

    @Override
    public void run() {
        runnable.run();
    }

    @Override
    public int compareTo(Integer o) {
        return priority - o;
    }
}