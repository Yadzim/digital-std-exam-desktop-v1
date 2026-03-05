import store from 'store/index';
import { restoreUi } from 'store/ui';



export const save_before_load = () => {
    const ui = store.getState().ui;
    const student_theme = ui.studentTheme

    localStorage.setItem('student_theme', JSON.stringify(student_theme));
}

export const save_after_load = () => {

    const student_theme = JSON.parse(localStorage.getItem('student_theme') || "{}");

    if (student_theme && Object.getOwnPropertyNames(student_theme).length) {
        store.dispatch(restoreUi({ student_theme: student_theme }));
    }

    localStorage.removeItem('student_theme');

}
