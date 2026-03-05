import React, { FC, useEffect, useState } from "react";
import { SelectStudentTheme } from "config/theme/colors";
import { useAppSelector } from "store/services";
import { useDispatch } from "react-redux";
import { manageSidebarCustom } from "store/ui";
import StudentHeader from "./header";
import { StdContent } from "./components/styled";
import StudentContent from "./content";
import "./components/styles.scss";

const Layout: FC<any> = (props): JSX.Element => {

    let isMobile = /iPhone|Android/i.test(navigator.userAgent);
    const _sidebar = useAppSelector(state => state.ui.sidebar);
    const [isSetting, setIsSetting] = useState<boolean>(false);
    const theme = SelectStudentTheme();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isMobile) dispatch(manageSidebarCustom({ sidebarType: 'xs' }));
    }, [])

    return (
        <div className="student_profile" style={{ backgroundColor: "#F3F7FF" }}>
            {
                <div className="wrapper">
                    <div className="d-flex sidebar_content">
                        <StudentHeader isSetting={isSetting} setIsSetting={setIsSetting} />
                        <StdContent theme={theme} sidebar={_sidebar}>
                            <StudentContent isSetting={isSetting} setIsSetting={setIsSetting} isMobile={isMobile}>{props.children}</StudentContent>
                        </StdContent>
                    </div>
                </div>
            }
        </div>
    )
}


export default React.memo(Layout);