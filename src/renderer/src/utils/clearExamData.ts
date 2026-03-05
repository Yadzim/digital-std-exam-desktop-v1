import store from "store";




export function clearExamData() {

    for (let key in localStorage) {

        const user_id = store.getState().auth.user.user_id;

        if (user_id) {
            if (!["i18lang", "access_token"].includes(key) && !key.startsWith(user_id)) {
                localStorage.removeItem(key);
            }
        }
    }

}