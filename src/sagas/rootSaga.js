import { all, call, put } from 'redux-saga/effects';
import { authorizationWatcher } from './authSagas';
import { lectureHallWatcher } from './lectureHallSagas';
import { groupWatcher } from './groupSagas';
import { departmentWatcher } from './departmentSagas';
import { instituteWatcher } from './instituteSagas';
import { scheduleWatcher } from './scheduleSagas';
import { usersWatcher } from './userSagas';
import { structureWatcher } from './structureSagas';
import { endFetching, startFetching } from '../actions/navigationActions';
import { authService } from '../services/authService';
import http from '../services/http';
import { addError } from '../actions/messageAction';
import { fileOperationWatcher } from './fileSagas';
import { signOut } from '../actions/authActions';

export default function* rootSaga() {
  yield all([
    authorizationWatcher(),
    fileOperationWatcher(),
    scheduleWatcher(),
    usersWatcher(),
    lectureHallWatcher(),
    groupWatcher(),
    departmentWatcher(),
    instituteWatcher(),
    structureWatcher()
  ]);
}

export function* processHttpCall({
  method,
  url,
  data,
  params,
  isFile,
  loadFile,
  onUploadProgress,
  ignoreNotFound
}) {

  try {
    yield put(startFetching());

    const response = yield call(http, {
      method,
      url,
      data,
      params,
      isFile,
      loadFile,
      onUploadProgress
    });

    if (!!response) {
      if (ignoreNotFound && response.status === 404) {
        return;
      }

      if (response.status === 401) {
        yield put(signOut());
        authService.logout();
        return;
      }

      if (response.status >= 100 && response.status < 400) {
        return response.data || true;
      }

      yield put(addError(response));
    }
  } catch (e) {
    yield put(addError(e));
  } finally {
    yield put(endFetching());
  }
}
