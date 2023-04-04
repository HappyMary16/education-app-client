import {useSelector} from 'react-redux';
import React from 'react';
import {EmptyPage} from '../../../common/components/EmptyPage';
import {ListGroup} from 'react-bootstrap';
import {AdminListItem} from '../components/AdminListItem';
import {ADMIN} from '../../../../constants/userRoles';
import {useFetchUserQuery} from "../../../../store/auth/authApiSlice";
import {selectApiLoading} from "../../../../App";
import {useFetchUsersQuery, useUnAssignUserRoleMutation} from "../../../../store/user/userApiSlice";

export default function AdminsList() {

  const [unAssignRole] = useUnAssignUserRoleMutation();

  const userId = useFetchUserQuery().data?.id;
  const {data: users} = useFetchUsersQuery({role: ADMIN});

  const isFetching = useSelector(state => state.navigationReducers.isFetching);
  const isNewFetching = useSelector(selectApiLoading);

  function deleteAdminFunc(userId) {
    unAssignRole({userId, role: ADMIN});
  }

  return (
    <ListGroup variant={'flush'}>
      <EmptyPage list={users} isFetching={isFetching || isNewFetching}/>
      {users &&
        users.map(user => (
          <AdminListItem key={user.id}
                         user={user}
                         deleteAdminFunc={deleteAdminFunc}
                         isDeletePresent={user.id !== userId}/>
        ))}
    </ListGroup>
  );
}