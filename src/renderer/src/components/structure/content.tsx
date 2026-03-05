import React, { FC } from 'react';
import { SelectStudentTheme } from 'config/theme/colors';
import { useAppSelector } from 'store/services';
import { StudentContentWrapper } from './components/styled';

const StudentContent: FC<{ children: any, isMobile: boolean, isSetting: boolean, setIsSetting: (isSetting: boolean) => void }> = ({ children, isMobile, isSetting, setIsSetting }) => {

    const ui = useAppSelector(state => state.ui);
    const theme = SelectStudentTheme();
    const _sidebar = useAppSelector(state => state.ui.sidebar);

    return (
        <StudentContentWrapper isMobile={isMobile} theme={theme} ui={ui} sidebar={_sidebar}>
            {children}
        </StudentContentWrapper>
    )
}


export default StudentContent;