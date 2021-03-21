import { connect } from 'react-redux';
import React, { Component } from 'react';
import { StudentListItem } from './StudentListItem';
import ListGroup from 'react-bootstrap/ListGroup';
import { EmptyPage } from '../../common/components/EmptyPage';
import { loadStudentsByTeacherId } from '../../../actions/userActions';

class StudentsList extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(loadStudentsByTeacherId());
  }

  render() {
    const { teachers, isFetching } = this.props;

    return (
      <ListGroup variant={'flush'}>
        <EmptyPage list={teachers} isFetching={isFetching} />
        {teachers &&
          teachers.map(teacher => (
            <StudentListItem key={teacher.id} student={teacher} />
          ))}
      </ListGroup>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.authReducers.user,
    teachers: state.userReducers.users,
    isFetching: state.loadingProcess.isFetching
  };
};

export default connect(mapStateToProps)(StudentsList);
