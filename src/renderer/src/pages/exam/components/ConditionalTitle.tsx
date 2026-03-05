import React from 'react';
import { Button, Col, Row } from "antd";
import { PageContentTitle } from "components/Title";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { IStudent } from "models/user";
import { useTranslation } from "react-i18next";
import { BiArrowBack } from "react-icons/bi";
import { TbRefresh } from 'react-icons/tb';

type Props = {
    user: IStudent | null,
    goToSubject: () => void,
    refetch: () => void
    loading: boolean
}

const ConditionalTitle: React.FC<Props> = ({ user, goToSubject, refetch, loading }): JSX.Element => {

    const { t } = useTranslation();

    const { value, writeToUrl } = useUrlQueryParams({});

    if (value.filter.edu_semester_subject_id) {

        return (
            <div className='px-1 flex-between gap-3'>
                <div className="d-f">
                    <Button size='small' type='link' className='d-flex align-items-center me-2 text-uppercase'
                        onClick={goToSubject}>
                        <BiArrowBack className='me-2' size={15} />
                        {t("Fanlar")}
                    </Button>
                    <span className='exam-list-title'><strong>{t("Imtihonlar")}</strong> / {String(value.filter_like.subject).replace(/\+/g, ' ')}</span>
                </div>
                {refetch ? <Button size='small' type='link' onClick={refetch} icon={<TbRefresh className={loading ? "loader" : ""} />} >{loading ? t("Yuklanmoqda...") : t("Yangilash")}</Button> : null}
            </div>
        )
    }

    return (
        <Row>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <PageContentTitle title="Fanlar" goBack={false} />
            </Col>
            <Col xl={16} lg={16} md={16} sm={24} xs={24} className="d-flex align-items-center justify-content-end">
                <PageContentTitle title="Semestrlar" goBack={false} />: &nbsp;
                {Array.isArray(user?.eduPlan?.eduSemestrs) && user?.eduPlan?.eduSemestrs.length && user?.eduPlan?.eduSemestrs.map((e) => {
                    return (
                        <button
                            key={e.id}
                            className={value.filter.edu_semester_id === e.id ? 'semester-btn-active' : 'semester-btn-inactive'}
                            onClick={() => writeToUrl({ name: "edu_semester_id", value: e.id })}
                        >{e.semestr_id}</button>
                    )
                })}
            </Col>
        </Row>
    )

}


export default ConditionalTitle;