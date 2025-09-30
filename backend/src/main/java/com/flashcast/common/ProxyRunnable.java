package com.flashcast.common;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;

@Slf4j
public class ProxyRunnable implements Runnable {

    private Runnable runnable;
    private String traceId;

    public ProxyRunnable(Runnable runnable) {
        this.runnable = runnable;
        traceId = MDC.get(Constants.MDC_TRACE_ID);
    }

    @Override
    public void run() {
        try {
            MDC.put(Constants.MDC_TRACE_ID, traceId);
            runnable.run();
        } catch (Throwable e) {
            log.error("thread execute error.", e);
            throw e;
        } finally {
            MDC.remove(Constants.MDC_TRACE_ID);
        }
    }

}
