package com.flashcast.util;

import com.flashcast.dto.User;

public class UserContext {

    private final static ThreadLocal<User> THREAD_LOCAL = new InheritableThreadLocal<>();

    public static void set(User user) {
        THREAD_LOCAL.set(user);
    }

    public static User get() {
        return THREAD_LOCAL.get();
    }

    public static void remove() {
        THREAD_LOCAL.remove();
    }

    public static Long getCurrentUserId() {
        return get().getId();
    }
}
