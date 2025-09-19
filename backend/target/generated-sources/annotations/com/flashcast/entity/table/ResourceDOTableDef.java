package com.flashcast.entity.table;

import com.mybatisflex.core.query.QueryColumn;
import com.mybatisflex.core.table.TableDef;

// Auto generate by mybatis-flex, do not modify it.
public class ResourceDOTableDef extends TableDef {

    public static final ResourceDOTableDef RESOURCE_DO = new ResourceDOTableDef();

    public final QueryColumn ID = new QueryColumn(this, "id");

    public final QueryColumn NAME = new QueryColumn(this, "name");

    public final QueryColumn PATH = new QueryColumn(this, "path");

    public final QueryColumn SIZE = new QueryColumn(this, "size");

    public final QueryColumn TYPE = new QueryColumn(this, "type");

    public final QueryColumn SUFFIX = new QueryColumn(this, "suffix");

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
    public final QueryColumn[] DEFAULT_COLUMNS = new QueryColumn[]{ID, NAME, PATH, SIZE, TYPE, SUFFIX, USER_ID, DELETED, CREATE_TIME, UPDATE_TIME};

    public ResourceDOTableDef() {
        super("", "fc_resource");
    }

    private ResourceDOTableDef(String schema, String name, String alisa) {
        super(schema, name, alisa);
    }

    public ResourceDOTableDef as(String alias) {
        String key = getNameWithSchema() + "." + alias;
        return getCache(key, k -> new ResourceDOTableDef("", "fc_resource", alias));
    }

}
