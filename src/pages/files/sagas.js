import { call, put, takeEvery } from 'redux-saga/effects';
import {
  DOWNLOAD_FILES,
  GET_ALL_FILES,
  getFiles,
  LOAD_SUBJECTS,
  LOAD_SUBJECTS_BY_WITHOUT_FILES,
  renderFiles,
  renderSubjects
} from './actions';
import http from '../../services/http';
import { FILES, SUBJECTS } from '../../constants/serverApi';
import { endFetching, startFetching } from '../../common/actions';

export function* fileOperationWatcher() {
  yield takeEvery(GET_ALL_FILES, () => downloadFiles());
  yield takeEvery(LOAD_SUBJECTS, () => loadSubjects());
  yield takeEvery(LOAD_SUBJECTS_BY_WITHOUT_FILES, action => loadSubjectsWithoutFiles(action));
  yield takeEvery(DOWNLOAD_FILES, action => downloadFile(action));
}

function* downloadFiles() {
  try {
    yield put(startFetching());

    const response = yield call(http, {
      url: FILES,
      method: 'get',
      isFile: true
    });

    if (response) {
      yield put(renderFiles(response));
    }
  } catch (e) {
    //TODO process errors
  } finally {
    yield put(endFetching());
  }
}

function* loadSubjects() {
  yield call(loadSubjectsWithoutFiles);
  yield put(getFiles());
}

function* loadSubjectsWithoutFiles() {
  try {
    yield put(startFetching());
    const response = yield call(http, {
      url: SUBJECTS,
      method: 'get'
    });

    if (response) {
      yield put(renderSubjects(response));
    }
  } catch (e) {
    alert(e + ' loadSubjectsWithoutFiles');
  } finally {
    yield put(endFetching());
  }
}

function* downloadFile(action) {
  const { fileId, fileName, loading } = action;

  let response = yield call(http, {
    url: FILES + fileId,
    method: 'get',
    loadFile: true
  });

  let blob = new Blob([response.data], {
    type: response.headers['content-type']
  });
  let url = URL.createObjectURL(blob);

  if (loading) {
    saveFile(url, fileName);
  } else {
    openFile(url);
  }
}

function openFile(url) {
  let newWindow = window.open('/files/loading');
  newWindow.onload = () => {
    newWindow.location = url;
  };
}

function saveFile(url, fileName) {
  let a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
}
