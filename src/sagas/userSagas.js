import { call, put, takeEvery } from 'redux-saga/effects';
import { endFetching, startFetching } from '../pages/navigation/actions';
import http from '../services/http';
import {
  AVATAR, GROUP_STUDENT_ID, STUDENT_GROUP, STUDENTS_BY_GROUP_ID, STUDENTS_WITHOUT_GROUP,
  TEACHERS,
  USERS
} from '../constants/serverApi';

import { arrayBufferToDataUrl } from '../utils/FileUtil';
import { addError } from '../actions/messageAction';
import {
  ADD_STUDENT_TO_GROUP, DELETE_USER,
  DOWNLOAD_MY_AVATAR, downloadMyAvatar,
  GET_STUDENTS_FRIENDS,
  GET_TEACHERS_FRIENDS, LOAD_STUDENTS_BY_GROUP_ID, LOAD_STUDENTS_WITHOUT_GROUP,
  LOAD_TEACHERS_BY_UNIVERSITY_ID, REMOVE_STUDENT_FROM_GROUP, RENDER_USERS, renderAvatar, renderMyAvatar, renderUser,
  renderUsers, UPDATE_USER, UPLOAD_AVATAR
} from '../actions/userActions';
import { signOut } from '../pages/authorization/actions';
import { AuthService } from '../services/AuthService';

export function* usersWatcher() {
  yield takeEvery(LOAD_TEACHERS_BY_UNIVERSITY_ID, () =>
    getTeachersByUniversityId()
  );
  yield takeEvery(GET_STUDENTS_FRIENDS, getStudentsFriends);
  yield takeEvery(GET_TEACHERS_FRIENDS, getTeachersFriends);
  yield takeEvery(RENDER_USERS, action => downloadAvatars(action));

  yield takeEvery(DOWNLOAD_MY_AVATAR, processDownloadMyAvatar);
  yield takeEvery(UPLOAD_AVATAR, action => uploadAvatar(action));

  yield takeEvery(LOAD_STUDENTS_BY_GROUP_ID, action =>
    getStudentsByGroupId(action)
  );
  yield takeEvery(REMOVE_STUDENT_FROM_GROUP, action =>
    removeStudentFromGroup(action)
  );
  yield takeEvery(
    LOAD_STUDENTS_WITHOUT_GROUP,
    getStudentsWithoutGroupByUniversityId
  );
  yield takeEvery(ADD_STUDENT_TO_GROUP, action => addStudentToGroup(action));

  yield takeEvery(DELETE_USER, deleteUser);
  yield takeEvery(UPDATE_USER, updateUser)
}

function* getTeachersByUniversityId() {
  try {
    yield put(startFetching());

    const response = yield call(http, {
      url: TEACHERS,
      method: 'get'
    });

    if (response && response.status === 200) {
      yield put(renderUsers(response.data));
    } else {
      yield put(addError(response.data));
    }
  } catch (e) {
    yield put(addError(e));
  } finally {
    yield put(endFetching());
  }
}

function* getStudentsFriends() {
  try {
    yield put(startFetching());

    const response = yield call(http, {
      url: USERS,
      method: 'get'
    });

    if (response && response.status === 200) {
      yield put(renderUsers(response.data));
    } else {
      yield put(addError(response.data));
    }
  } catch (e) {
    yield put(addError(e));
  } finally {
    yield put(endFetching());
  }
}


function* getTeachersFriends() {
  try {
    yield put(startFetching());

    const response = yield call(http, {
      url: USERS,
      method: 'get'
    });

    if (response && response.status === 200) {
      yield put(renderUsers(response.data));
    } else {
      yield put(addError(response.data));
    }
  } catch (e) {
    yield put(addError(e));
  } finally {
    yield put(endFetching());
  }
}

function* downloadAvatarForUser(userId) {
  const response = yield call(http, {
    url: AVATAR + userId,
    method: 'get',
    loadFile: true
  });

  if (response && response.status === 200) {
    yield put(renderAvatar(userId, arrayBufferToDataUrl(response.data)));
  } else {
    return { userId };
  }
}


function* downloadAvatars(action) {
  for (let i = 0; i < action.payload.users.length; i++) {
    const user = action.payload.users[i];
    downloadAvatarForUser(user.id);
  }
}

function* processDownloadMyAvatar() {
  const response = yield call(http, {
    url: AVATAR,
    method: 'get',
    loadFile: true
  });

  if (response && response.status !== 204) {
    yield put(renderMyAvatar(arrayBufferToDataUrl(response.data)));
  } else {
    return {};
  }
}

function* uploadAvatar(action) {
  try {
    yield put(startFetching());

    const { avatar } = action.payload;
    const formData = new FormData();

    formData.append('file', avatar, 'avatar.png');

    let response = yield call(http, {
      url: AVATAR,
      method: 'post',
      data: formData,
      isFile: true
    });

    if (response && response.status === 200) {
      yield put(downloadMyAvatar());
    }
  } catch (e) {
    yield put(addError(e));
  } finally {
    yield put(endFetching());
  }
}

function* getStudentsByGroupId(action) {
  try {
    yield put(startFetching());
    const { groupId } = action.payload;

    if (groupId) {
      const response = yield call(http, {
        url: STUDENTS_BY_GROUP_ID + groupId,
        method: 'get'
      });

      if (response && response.status === 200) {
        yield put(renderUsers(response.data));
      } else {
        yield put(addError(response.data));
      }
    }
  } catch (e) {
    yield put(addError(e));
  } finally {
    yield put(endFetching());
  }
}

function* removeStudentFromGroup(action) {
  try {
    yield put(startFetching());
    const { studentId } = action.payload;

    const response = yield call(http, {
      url: GROUP_STUDENT_ID + studentId,
      method: 'delete'
    });

    if (response && response.status === 200) {
      yield put(renderUser(response.data));
    } else {
      yield put(addError(response.data));
    }
  } catch (e) {
    yield put(addError(e));
  } finally {
    yield put(endFetching());
  }
}

function* getStudentsWithoutGroupByUniversityId() {
  try {
    yield put(startFetching());

    const response = yield call(http, {
      url: STUDENTS_WITHOUT_GROUP,
      method: 'get'
    });

    if (response && response.status === 200) {
      yield put(renderUsers(response.data));
    } else {
      yield put(addError(response.data));
    }
  } catch (e) {
    yield put(addError(e));
  } finally {
    yield put(endFetching());
  }
}

function* addStudentToGroup(action) {
  try {
    yield put(startFetching());
    const { studentIds, groupId } = action.payload;

    if (studentIds && groupId) {
      const response = yield call(http, {
        url: STUDENT_GROUP,
        method: 'put',
        data: {
          studentsIds: studentIds,
          groupId: groupId
        }
      });

      if (response && response.status === 200) {
        yield put(renderUsers(response.data));
      } else {
        yield put(addError(response.data));
      }
    }
  } catch (e) {
    yield put(addError(e));
  } finally {
    yield put(endFetching());
  }
}

function* deleteUser() {
  try {
    yield put(startFetching());

    const response = yield call(http, {
      url: USERS,
      method: 'delete'
    });

    if (response && response.status === 204) {
      new AuthService().logout();
      yield put(signOut());
    } else {
      yield put(addError(response.data));
    }

  } catch (e) {
    yield put(addError(e));
  } finally {
    yield put(endFetching());
  }
}

function* updateUser(action) {
  try {
    yield put(startFetching());

    console.log("dgsgfd")
    const { university,
      institute,
      department,
      group,
      firstName,
      lastname,
      surname,
      email } = action.payload;
    console.log(action.payload)
    const response = yield call(http, {
      url: USERS,
      method: 'put',
      data: {
        firstName: firstName,
        lastname: lastname,
        surname: surname,
        email: email,
        universityId: university && university.value,
        instituteId: institute && institute.value,
        departmentId: department && department.value,
        groupId: group && group.value
      }
    });
    console.log("dgsgfd")
    if (response && response.status === 204) {
      yield put(signOut());
    } else {
      yield put(addError(response.data));
    }

  } catch (e) {
    yield put(addError(e));
  } finally {
    yield put(endFetching());
  }
}