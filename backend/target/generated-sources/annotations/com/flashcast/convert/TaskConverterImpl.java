package com.flashcast.convert;

import com.flashcast.dto.Task;
import com.flashcast.entity.TaskDO;
import com.mybatisflex.core.paginate.Page;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-09-19T16:13:06+0800",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.43.0.v20250819-1513, environment: Java 21.0.8 (Eclipse Adoptium)"
)
public class TaskConverterImpl implements TaskConverter {

    @Override
    public Task convertToDTO(TaskDO obj) {
        if ( obj == null ) {
            return null;
        }

        Task task = new Task();

        task.setCreateTime( obj.getCreateTime() );
        task.setDeleted( obj.getDeleted() );
        task.setId( obj.getId() );
        task.setJson( obj.getJson() );
        task.setStatus( obj.getStatus() );
        task.setType( obj.getType() );
        task.setUpdateTime( obj.getUpdateTime() );
        task.setUserId( obj.getUserId() );

        return task;
    }

    @Override
    public List<Task> convertToDTO(List<TaskDO> list) {
        if ( list == null ) {
            return null;
        }

        List<Task> list1 = new ArrayList<Task>( list.size() );
        for ( TaskDO taskDO : list ) {
            list1.add( convertToDTO( taskDO ) );
        }

        return list1;
    }

    @Override
    public Page<Task> convertToDTO(Page<TaskDO> page) {
        if ( page == null ) {
            return null;
        }

        Page<Task> page1 = new Page<Task>();

        page1.setPageNumber( page.getPageNumber() );
        page1.setPageSize( page.getPageSize() );
        if ( page.hasRecords() ) {
            page1.setRecords( convertToDTO( page.getRecords() ) );
        }
        page1.setTotalPage( page.getTotalPage() );
        page1.setTotalRow( page.getTotalRow() );

        return page1;
    }

    @Override
    public TaskDO convertToDO(Task obj) {
        if ( obj == null ) {
            return null;
        }

        TaskDO taskDO = new TaskDO();

        taskDO.setCreateTime( obj.getCreateTime() );
        taskDO.setDeleted( obj.getDeleted() );
        taskDO.setId( obj.getId() );
        taskDO.setJson( obj.getJson() );
        taskDO.setStatus( obj.getStatus() );
        taskDO.setType( obj.getType() );
        taskDO.setUpdateTime( obj.getUpdateTime() );
        taskDO.setUserId( obj.getUserId() );

        return taskDO;
    }

    @Override
    public List<TaskDO> convertToDO(List<Task> list) {
        if ( list == null ) {
            return null;
        }

        List<TaskDO> list1 = new ArrayList<TaskDO>( list.size() );
        for ( Task task : list ) {
            list1.add( convertToDO( task ) );
        }

        return list1;
    }
}
