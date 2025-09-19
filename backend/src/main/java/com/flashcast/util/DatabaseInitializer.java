package com.flashcast.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

/**
 * 数据库初始化工具
 * 应用启动时自动执行数据库脚本
 */
@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // 检查用户表是否存在，如果不存在则执行初始化脚本
        try {
            jdbcTemplate.queryForObject("SELECT COUNT(*) FROM fc_user LIMIT 1", Integer.class);
            System.out.println("数据库表已存在，跳过初始化");
        } catch (Exception e) {
            System.out.println("数据库表不存在，开始执行初始化脚本...");
            executeSqlScript();
        }
    }

    private void executeSqlScript() {
        try {
            ClassPathResource resource = new ClassPathResource("db.sql");
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                
                StringBuilder sqlBuilder = new StringBuilder();
                String line;
                
                while ((line = reader.readLine()) != null) {
                    // 跳过注释和空行
                    if (line.trim().isEmpty() || line.trim().startsWith("--")) {
                        continue;
                    }
                    
                    sqlBuilder.append(line).append("\n");
                    
                    // 如果行以分号结尾，执行SQL语句
                    if (line.trim().endsWith(";")) {
                        String sql = sqlBuilder.toString().trim();
                        if (!sql.isEmpty()) {
                            try {
                                jdbcTemplate.execute(sql);
                                System.out.println("执行SQL成功: " + sql.substring(0, Math.min(50, sql.length())) + "...");
                            } catch (Exception ex) {
                                System.err.println("执行SQL失败: " + sql.substring(0, Math.min(50, sql.length())) + "...");
                                System.err.println("错误信息: " + ex.getMessage());
                            }
                        }
                        sqlBuilder = new StringBuilder();
                    }
                }
                
                System.out.println("数据库初始化完成！");
            }
        } catch (Exception e) {
            System.err.println("执行数据库初始化脚本失败: " + e.getMessage());
        }
    }
}