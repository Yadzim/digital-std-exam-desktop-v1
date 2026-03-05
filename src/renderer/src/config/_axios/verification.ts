import SignIn from "pages/login/signIn";
import store from "store";


const verification = async () => {
    try {

        const token = localStorage.getItem('access_token')

        if (token) {
            store.dispatch(SignIn({ type: 'verification'}))
            sessionStorage.removeItem("page_reloading")
        }

    } catch (error) {

    }
}

export default verification;