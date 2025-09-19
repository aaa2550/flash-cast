package com.flashcast.convert;

import com.flashcast.dto.CustomUser;
import com.flashcast.dto.User;
import com.flashcast.entity.UserDO;
import com.mybatisflex.core.paginate.Page;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.security.core.GrantedAuthority;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-09-19T14:34:04+0800",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.15 (Microsoft)"
)
public class UserConverterImpl implements UserConverter {

    @Override
    public User convertToDTO(UserDO obj) {
        if ( obj == null ) {
            return null;
        }

        User user = new User();

        user.setId( obj.getId() );
        user.setPhone( obj.getPhone() );
        user.setNickname( obj.getNickname() );
        user.setAvatar( obj.getAvatar() );
        user.setGender( obj.getGender() );
        user.setBirthday( obj.getBirthday() );
        user.setStatus( obj.getStatus() );
        user.setLastLoginTime( obj.getLastLoginTime() );
        user.setCreateTime( obj.getCreateTime() );
        user.setUpdateTime( obj.getUpdateTime() );
        user.setDeleted( obj.getDeleted() );

        return user;
    }

    @Override
    public List<User> convertToDTO(List<UserDO> list) {
        if ( list == null ) {
            return null;
        }

        List<User> list1 = new ArrayList<User>( list.size() );
        for ( UserDO userDO : list ) {
            list1.add( convertToDTO( userDO ) );
        }

        return list1;
    }

    @Override
    public Page<User> convertToDTO(Page<UserDO> page) {
        if ( page == null ) {
            return null;
        }

        Page<User> page1 = new Page<User>();

        if ( page.hasRecords() ) {
            page1.setRecords( convertToDTO( page.getRecords() ) );
        }
        page1.setPageNumber( page.getPageNumber() );
        page1.setPageSize( page.getPageSize() );
        page1.setTotalPage( page.getTotalPage() );
        page1.setTotalRow( page.getTotalRow() );

        return page1;
    }

    @Override
    public UserDO convertToDO(User obj) {
        if ( obj == null ) {
            return null;
        }

        UserDO userDO = new UserDO();

        userDO.setId( obj.getId() );
        userDO.setPhone( obj.getPhone() );
        userDO.setNickname( obj.getNickname() );
        userDO.setAvatar( obj.getAvatar() );
        userDO.setGender( obj.getGender() );
        userDO.setBirthday( obj.getBirthday() );
        userDO.setStatus( obj.getStatus() );
        userDO.setLastLoginTime( obj.getLastLoginTime() );
        userDO.setCreateTime( obj.getCreateTime() );
        userDO.setUpdateTime( obj.getUpdateTime() );
        userDO.setDeleted( obj.getDeleted() );

        return userDO;
    }

    @Override
    public List<UserDO> convertToDO(List<User> list) {
        if ( list == null ) {
            return null;
        }

        List<UserDO> list1 = new ArrayList<UserDO>( list.size() );
        for ( User user : list ) {
            list1.add( convertToDO( user ) );
        }

        return list1;
    }

    @Override
    public CustomUser convertToCustomUser(User obj) {
        if ( obj == null ) {
            return null;
        }

        String password = null;

        password = obj.getPassword();

        String username = null;
        Collection<? extends GrantedAuthority> authorities = null;

        CustomUser customUser = new CustomUser( username, password, authorities );

        customUser.setId( obj.getId() );

        return customUser;
    }
}
