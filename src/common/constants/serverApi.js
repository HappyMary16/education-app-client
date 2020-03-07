import config from '../../config';

export const apiRoot = `http://localhost:${config.port}/api`;

export const SIGN_IN = '/auth/signIn';
export const SIGN_UP = '/auth/signUp';

export const GET_INSTITUTES = '/info/institutes';
export const GET_INSTITUTES_WITH_PARAMETERS = '/info/institutes/';
export const GET_DEPARTMENTS = '/info/departments';
export const GET_GROUPS = '/info/studyGroups';

export const GET_SUBJECTS = '/subjects/';
export const POST_SUBJECTS = '/subject/';

export const GET_FILES = '/files/';
export const UPLOAD_MULTIPLE_FILES = '/uploadMultipleFiles/';

export const DOWNLOAD_FILE = '/downloadFile/';

export const ADD_ACCESS = '/addAccess/';

export const ADD_UNIVERSITY_API = '/university/add';
