import React, { FC } from "react";
import { Button } from "antd";
import { SelectStudentTheme } from "config/theme/colors";
import { BiLogOut, BiWifi, BiWifiOff } from "react-icons/bi";
import { TypeInitialStateUi } from "store/ui";
import _logout from "config/_axios/logout";
import logo from "assets/images/tsullogo.svg";
import { useAppSelector } from "store/services";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory } from "react-router-dom";
import { StudentHeaderUi } from "./components/styled";
import IconBtnCmponent from "./components/IconsBtnComponent";
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
                    {/* <NavLink to="/">
                        <div className="d-f align-items-center px-3" style={{ width: 'auto' }} >
                            <div className="sidebar_avatar me-2">
                                <img src={logo} style={{ color: theme.blue }} alt="" width={30} />
                            </div>
                        </div>
                    </NavLink> */}
                    <Button type="link" size="small" className="ms-3" onClick={() => history.push("/")} style={{ color: "#1890FF" }}>{t("ASOSIY SAHIFA")}</Button>
                    {/* <Button type="link" size="small" className="ms-3" onClick={()=> history.push("/webcam")} style={{color:"#1890FF"}}>{t("Auth")}</Button> */}
                </div>
                <div className="d-flex text-end">
                    {/* <IconBtnCmponent icon={ui.isOnline ? <BiWifi color={'#389e0d'} size={20} /> : <BiWifiOff color={'#f5222d'} size={20} />} isBadge={false} /> */}
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