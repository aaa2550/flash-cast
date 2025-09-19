package com.flashcast.entity.table;

import com.mybatisflex.core.query.QueryColumn;
import com.mybatisflex.core.table.TableDef;

// Auto generate by mybatis-flex, do not modify it.
public class TaskDOTableDef extends TableDef {

    public static final TaskDOTableDef TASK_DO = new TaskDOTableDef();

    public final QueryColumn ID = new QueryColumn(this, "id");

    public final QueryColumn JSON = new QueryColumn(this, "json");

    public final QueryColumn TYPE = new QueryColumn(this, "type");

    public final QueryColumn STATUS = new QueryColumn(this, "status");

    public final QueryColumn USER_ID = new QueryColumn(this, "user_id");

    public final QueryColumn DELETED = new QueryColumn(this, "deleted");

    public final QueryColumn CREATE_TIME = new QueryColumn(this, "create_time");

    public final QueryColumn UPDATE_TIME = new QueryColumn(this, "update_time");

    /**
     * 所有字段。
     */
    public final QueryColumn ALL_COLUMNS = new QueryColumn(this, "*");

    /**
     * 默认字段，不包含逻辑删除或者 large 等字段。
     */
    public final QueryColumn[] DEFAULT_COLUMNS = new QueryColumn[]{ID, JSON, TYPE, STATUS, USER_ID, DELETED, CREATE_TIME, UPDATE_TIME};

    public TaskDOTableDef() {
        super("", "fc_user");
    }

    private TaskDOTableDef(String schema, String name, String alisa) {
        super(schema, name, alisa);
    }

    public TaskDOTableDef as(String alias) {
        String key = getNameWithSchema() + "." + alias;
        return getCache(key, k -> new TaskDOTableDef("", "fc_user", alias));
    }

}
