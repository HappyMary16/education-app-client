import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteLesson, findLessonsByGroupId } from '../../../../actions/scheduleActions';
import { Button, Col, Row } from 'react-bootstrap';
import i18n from '../../../../locales/i18n';
import Select from 'react-select';
import { selectorColors } from '../../../../styles/styles';
import { getGroupById } from '../../../../utils/StructureUtils';
import { DeleteLessonDialog } from '../../../admin/deleteLesson/DeleteLessonDialog';
import { getLessonsByGroup } from '../../../../utils/ScheduleUtil';
import { loadGroupsByUniversityId } from '../../../../actions/groupActions';
import { Schedule } from '../components/Schedule';
import { ADD_LESSON } from '../../../../constants/links';
import { history } from '../../../../store/Store';
import { withGroupId } from '../../../../utils/RouterUtils';

class GroupSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupId: props.groupId,
      isEditMode: false,
      deleteDialog: false,
      lessonToDelete: {}
    };

    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.endEditing = this.endEditing.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.openDeleteLessonDialog = this.openDeleteLessonDialog.bind(this);
    this.closeDeleteLessonDialog = this.closeDeleteLessonDialog.bind(this);
    this.deleteLesson = this.deleteLesson.bind(this);
  }

  componentDidMount() {
    const { dispatch, groupId, universityId } = this.props;
    dispatch(loadGroupsByUniversityId(universityId));

    groupId && dispatch(findLessonsByGroupId(groupId));
  }

  handleGroupChange(groupId) {
    const { dispatch } = this.props;
    groupId &&
    this.setState({
      groupId: groupId
    });
    groupId && dispatch(findLessonsByGroupId(groupId));
  }

  endEditing() {
    this.setState({ isEditMode: false });
  }

  startEdit() {
    this.setState({ isEditMode: true });
  }

  openDeleteLessonDialog(lesson) {
    this.setState({
      deleteDialog: true,
      lessonToDelete: lesson
    });
  }

  closeDeleteLessonDialog() {
    this.setState({
      deleteDialog: false
    });
  }

  deleteLesson(groups) {
    const { dispatch } = this.props;
    const { lessonToDelete } = this.state;

    dispatch(deleteLesson(lessonToDelete, groups));
  }

  render() {
    const { groups, lessons, user } = this.props;
    const { groupId, isEditMode, deleteDialog, lessonToDelete } = this.state;

    return (
      <div>
        {isEditMode && deleteDialog && (
          <DeleteLessonDialog
            open={deleteDialog}
            lesson={lessonToDelete}
            handleClose={this.closeDeleteLessonDialog}
            handleDelete={this.deleteLesson}
          />
        )}
        <Row spacing={2}>
          <Col sm={12} md={6}>
            <Select
              placeholder={i18n.t('select_group')}
              theme={selectorColors}
              // isMulti
              onChange={e => this.handleGroupChange(e.value)}
              options={groups}
              defaultValue={getGroupById(groups, groupId)}
              className='selector'
            />
          </Col>
          <Col sm={12} md={3}>
            <Button
              block
              variant={'purple'}
              onClick={
                isEditMode ? () => this.endEditing() : () => this.startEdit()
              }
            >
              {i18n.t(isEditMode ? 'save' : 'edit')}
            </Button>
          </Col>
          <Col sm={12} md={3}>
            <Button
              block
              variant={'purple'}
              onClick={() => history.push(ADD_LESSON)}
            >
              {i18n.t('add_lesson')}
            </Button>
          </Col>
        </Row>
        {groupId && lessons && (
          <Schedule
            lessons={getLessonsByGroup(lessons, groups, groupId)}
            user={user}
            isMine
            isEditMode={isEditMode}
            deleteLesson={this.openDeleteLessonDialog}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.authReducers.user,
    universityId: state.authReducers.user.universityId,
    groups: Object.values(state.groupReducers.groups),
    lessons: state.scheduleReducers.lessons
  };
};

export default withGroupId(connect(mapStateToProps)(GroupSchedule));
