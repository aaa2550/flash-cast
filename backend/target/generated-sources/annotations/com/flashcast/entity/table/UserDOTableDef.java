package com.flashcast.entity.table;

import com.mybatisflex.core.query.QueryColumn;
import com.mybatisflex.core.table.TableDef;

// Auto generate by mybatis-flex, do not modify it.
public class UserDOTableDef extends TableDef {

    public static final UserDOTableDef USER_DO = new UserDOTableDef();

    public final QueryColumn ID = new QueryColumn(this, "id");

    public final QueryColumn PHONE = new QueryColumn(this, "phone");

    public final QueryColumn AVATAR = new QueryColumn(this, "avatar");

    public final QueryColumn GENDER = new QueryColumn(this, "gender");

    public final QueryColumn STATUS = new QueryColumn(this, "status");

    public final QueryColumn DELETED = new QueryColumn(this, "deleted");

    public final QueryColumn BIRTHDAY = new QueryColumn(this, "birthday");

    public final QueryColumn NICKNAME = new QueryColumn(this, "nickname");

    public final QueryColumn CREATE_TIME = new QueryColumn(this, "create_time");

    public final QueryColumn UPDATE_TIME = new QueryColumn(this, "update_time");

    public final QueryColumn LAST_LOGIN_TIME = new QueryColumn(this, "last_login_time");

    /**
     * 所有字段。
     */
    public final QueryColumn ALL_COLUMNS = new QueryColumn(this, "*");

    /**
     * 默认字段，不包含逻辑删除或者 large 等字段。
     */
    public final QueryColumn[] DEFAULT_COLUMNS = new QueryColumn[]{ID, PHONE, AVATAR, GENDER, STATUS, DELETED, BIRTHDAY, NICKNAME, CREATE_TIME, UPDATE_TIME, LAST_LOGIN_TIME};

    public UserDOTableDef() {
        super("", "fc_user");
    }

    private UserDOTableDef(String schema, String name, String alisa) {
        super(schema, name, alisa);
    }

    public UserDOTableDef as(String alias) {
        String key = getNameWithSchema() + "." + alias;
        return getCache(key, k -> new UserDOTableDef("", "fc_user", alias));
    }

}
