import store from "../store";
import { logout, TypeInitialStateAuth } from "../store/auth";



const isHasAuthRoute = (name: string) => {

    const auth = store.getState().auth as TypeInitialStateAuth;

    if (Array.isArray(auth?.permissions) && auth.permissions.length > 0) {
        return auth.permissions?.includes(name);
    } else {
        store.dispatch(logout())
        // sessionStorage.removeItem("access_token");
        localStorage.removeItem("access_token");
    }
}

export default isHasAuthRoute;