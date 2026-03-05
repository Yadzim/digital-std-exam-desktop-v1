
import { FaBars } from "react-icons/fa";
import { SelectStudentTheme } from "config/theme/colors";
import { useDispatch } from "react-redux";
import { manageSidebar } from "store/ui";
import { Std_header_logo } from "./styled";


const StudentHeaderLogo = () => {

    const dispatch = useDispatch();

    const theme = SelectStudentTheme();

    const clickBtn = () => {
        dispatch(manageSidebar({}))
    }

    return (
        <Std_header_logo theme={theme}>
            <span>T S U L  <span style={{ fontSize: "13px" }}> &nbsp;Student</span></span>
            <button onClick={clickBtn}><FaBars /></button>
        </Std_header_logo>
    )


}

export default StudentHeaderLogo;