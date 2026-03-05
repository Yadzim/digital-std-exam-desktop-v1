import React from 'react';
import { Badge } from "antd";
import { SelectStudentTheme } from "config/theme/colors";
import { FC, ReactElement } from "react";
import { IconType } from "react-icons/lib";
import { BtnStyleHeader } from "./styled";

const IconBtnCmponent: FC<{ icon: ReactElement<IconType>, isBadge: boolean }> = ({ icon, isBadge }): JSX.Element => {

    const theme = SelectStudentTheme();

    return (
        <BtnStyleHeader theme={theme} >
            { isBadge ? <Badge dot>{icon}</Badge> : <>{icon}</> }
        </BtnStyleHeader>
    )
}

export default IconBtnCmponent;