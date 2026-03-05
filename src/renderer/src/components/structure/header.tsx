import React, { FC } from "react";
import { Button } from "antd";
import { SelectStudentTheme } from "config/theme/colors";
import { BiLogOut, BiWifi, BiWifiOff } from "react-icons/bi";
import { TypeInitialStateUi } from "store/ui";
import _logout from "config/_axios/logout";
import { useAppSelector } from "store/services";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { StudentHeaderUi } from "./components/styled";
import LanguageBtn from "./components/Language";
import "./components/styles.scss";

const StudentHeader: FC<{ isSetting: boolean, setIsSetting: (isSetting: boolean) => void }> = ({ isSetting, setIsSetting }): JSX.Element => {

    const ui: TypeInitialStateUi = useAppSelector(state => state.ui) as TypeInitialStateUi;
    const { t } = useTranslation();
    const theme = SelectStudentTheme()
    const history = useHistory();

    return (
        <StudentHeaderUi theme={theme} >
            <div className="std_header">
                <div className="d-flex justify-content-between align-items-center">
                    <Button type="link" size="small" className="ms-3" onClick={() => history.push("/")} style={{ color: "#1890FF" }}>{t("ASOSIY SAHIFA")}</Button>
                </div>
                <div className="d-flex text-end">
                    {
                        ui.isOnline ? <div className="d-flex align-items-center gap-2 px-2 mx-2" style={{ background: '#F7F9FB', color: '#389e0d' }}><BiWifi size={20} /> Online</div>
                            :
                            <div className="d-flex align-items-center gap-2 px-2 mx-2" style={{ background: '#F7F9FB', color: '#f5222d' }}><BiWifiOff size={20} /> Offline</div>
                    }
                    <LanguageBtn />
                    <Button onClick={_logout} icon={<BiLogOut color={theme.blue} className="me-1" style={{ transform: "rotate(-180deg)" }} size={20} />} className="d-flex align-items-center mx-2" style={{ height: 30, borderRadius: '0.25rem' }} >{t("Chiqish")}</Button>
                </div>
            </div>
        </StudentHeaderUi >
    )
}


export default StudentHeader;