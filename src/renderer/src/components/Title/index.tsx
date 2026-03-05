import React,{ FC } from "react";
import { FaArrowLeft } from 'react-icons/fa';
import { useHistory } from "react-router-dom";
import "./styles.scss";
import { useTranslation } from "react-i18next";



export const PageContentTitle: FC<{ title: string, goBack?: boolean }> = ({ title, goBack = true }): JSX.Element => {

    const { t } = useTranslation();
    const history = useHistory();

    return (
        <>
            <div className="page-content-title">
                {goBack ? <FaArrowLeft onClick={() => history.goBack()} fontSize={16} /> : null}
                <span>{t(title)}</span>
            </div>
        </>
    )
}
