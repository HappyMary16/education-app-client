import { RENDER_LESSON, RENDER_LESSONS } from './actions';
import StateLoader from '../../../store/StateLoader';
import { SIGN_OUT } from '../../authorization/actions';

export default function scheduleReducers(
  state = new StateLoader().loadState().scheduleReducers || {},
  action
) {
  switch (action.type) {
    case RENDER_LESSONS:
      return {
        ...state,
        lessons: action.payload.lessons
      };
    case RENDER_LESSON:
      let lessons = state.lessons.filter(
        lesson => lesson.id !== action.payload.lessonId
      );
      if (action.payload.newLesson) {
        lessons.push(action.payload.newLesson);
      }
      return {
        ...state,
        lessons: lessons
      };
    case SIGN_OUT:
      return {};
    default:
      return state;
  }
}
