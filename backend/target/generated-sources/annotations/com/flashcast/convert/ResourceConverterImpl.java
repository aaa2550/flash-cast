package com.flashcast.convert;

import com.flashcast.dto.Resource;
import com.flashcast.entity.ResourceDO;
import com.mybatisflex.core.paginate.Page;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-09-19T16:13:06+0800",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.43.0.v20250819-1513, environment: Java 21.0.8 (Eclipse Adoptium)"
)
public class ResourceConverterImpl implements ResourceConverter {

    @Override
    public Resource convertToDTO(ResourceDO obj) {
        if ( obj == null ) {
            return null;
        }

        Resource resource = new Resource();

        resource.setCreateTime( obj.getCreateTime() );
        resource.setDeleted( obj.getDeleted() );
        resource.setId( obj.getId() );
        resource.setName( obj.getName() );
        resource.setPath( obj.getPath() );
        resource.setSize( obj.getSize() );
        resource.setSuffix( obj.getSuffix() );
        resource.setType( obj.getType() );
        resource.setUpdateTime( obj.getUpdateTime() );
        resource.setUserId( obj.getUserId() );

        return resource;
    }

    @Override
    public List<Resource> convertToDTO(List<ResourceDO> list) {
        if ( list == null ) {
            return null;
        }

        List<Resource> list1 = new ArrayList<Resource>( list.size() );
        for ( ResourceDO resourceDO : list ) {
            list1.add( convertToDTO( resourceDO ) );
        }

        return list1;
    }

    @Override
    public Page<Resource> convertToDTO(Page<ResourceDO> page) {
        if ( page == null ) {
            return null;
        }

        Page<Resource> page1 = new Page<Resource>();

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
    public ResourceDO convertToDO(Resource obj) {
        if ( obj == null ) {
            return null;
        }

        ResourceDO resourceDO = new ResourceDO();

        resourceDO.setCreateTime( obj.getCreateTime() );
        resourceDO.setDeleted( obj.getDeleted() );
        resourceDO.setId( obj.getId() );
        resourceDO.setName( obj.getName() );
        resourceDO.setPath( obj.getPath() );
        resourceDO.setSize( obj.getSize() );
        resourceDO.setSuffix( obj.getSuffix() );
        resourceDO.setType( obj.getType() );
        resourceDO.setUpdateTime( obj.getUpdateTime() );
        resourceDO.setUserId( obj.getUserId() );

        return resourceDO;
    }

    @Override
    public List<ResourceDO> convertToDO(List<Resource> list) {
        if ( list == null ) {
            return null;
        }

        List<ResourceDO> list1 = new ArrayList<ResourceDO>( list.size() );
        for ( Resource resource : list ) {
            list1.add( convertToDO( resource ) );
        }

        return list1;
    }
}
