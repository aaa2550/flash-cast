package com.flashcast.auth.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户实体类
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Schema(description = "用户信息")
@TableName("fc_user")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    @Schema(description = "用户ID", example = "1")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 手机号（唯一）
     */
    @Schema(description = "手机号", example = "13888888888")
    @TableField("phone")
    private String phone;

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称", example = "用户8888")
    @TableField("nickname")
    private String nickname;

    /**
     * 头像URL
     */
    @Schema(description = "头像URL", example = "https://example.com/avatar.jpg")
    @TableField("avatar")
    private String avatar;

    /**
     * 性别：0-未知，1-男，2-女
     */
    @Schema(description = "性别", example = "1", allowableValues = {"0", "1", "2"})
    @TableField("gender")
    private Integer gender;

    /**
     * 生日
     */
    @Schema(description = "生日", example = "1990-01-01")
    @TableField("birthday")
    private String birthday;

    /**
     * 个人简介
     */
    @Schema(description = "个人简介", example = "这是一个个人简介")
    @TableField("bio")
    private String bio;

    /**
     * 账号状态：0-正常，1-禁用
     */
    @Schema(description = "账号状态", example = "0", allowableValues = {"0", "1"})
    @TableField("status")
    private Integer status;

    /**
     * 最后登录时间
     */
    @Schema(description = "最后登录时间", example = "2025-09-18 12:00:00")
    @TableField("last_login_time")
    private LocalDateTime lastLoginTime;

    /**
     * 创建时间
     */
    @Schema(description = "创建时间", example = "2025-09-18 12:00:00")
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @Schema(description = "更新时间", example = "2025-09-18 12:00:00")
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除标志：0-未删除，1-已删除
     */
    @Schema(description = "删除标志", example = "0", allowableValues = {"0", "1"})
    @TableField("deleted")
    @TableLogic
    private Integer deleted;

    // 构造函数
    public User() {
        this.status = 0;
        this.deleted = 0;
        this.gender = 0;
    }

    public User(String phone, String nickname) {
        this();
        this.phone = phone;
        this.nickname = nickname;
    }

    // Getter and Setter methods
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Integer getGender() {
        return gender;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public LocalDateTime getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(LocalDateTime lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getDeleted() {
        return deleted;
    }

    public void setDeleted(Integer deleted) {
        this.deleted = deleted;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", phone='" + phone + '\'' +
                ", nickname='" + nickname + '\'' +
                ", avatar='" + avatar + '\'' +
                ", gender=" + gender +
                ", birthday='" + birthday + '\'' +
                ", bio='" + bio + '\'' +
                ", status=" + status +
                ", lastLoginTime=" + lastLoginTime +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                ", deleted=" + deleted +
                '}';
    }
}