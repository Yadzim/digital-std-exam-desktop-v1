import React, { ChangeEvent, KeyboardEvent } from "react";
import { Button, Col, Input, message, Row, Spin, Typography } from "antd";
import { useRouteMatch, match } from "react-router";
import { useAppDispatch, useAppSelector } from "store/services";
import { GetExamInfo, GetExamQuestion } from "../service.requests";
import { NavLink, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import ExamAgreement from "../components/Agreement";
import ExamSurvey from "../components/ExamSurvey";
import { PageContentTitle } from "components/Title";
import { TbBook2, TbClock, TbFaceId, TbLicense, TbListDetails, TbAlertTriangle, TbAlertCircle } from "react-icons/tb";
import QRCodeModal from "components/QRCodeModal";
import AuthFaceID from "pages/webcam";
import "../styles.scss";
import useCheckFaceID from "pages/webcam/useCheckFaceID";



const ExamInfo = () => {

    const match: match<any> | null = useRouteMatch("/exam/info/:exam_id");
    const dispatch: any = useAppDispatch();
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const { isLoading, data } = useAppSelector(state => state.exam.exam_info);
    const { isLoading: isLoadingGetQuestion } = useAppSelector(state => state.exam.pass_exam);
    const { user } = useAppSelector(state => state.user);
    // const { url, urlBase64 } = useAppSelector(state => state.exam.faceId);

    const { isAuth, checkFaceIDTimeLimit, openModal } = useCheckFaceID();

    const [password, setPassword] = React.useState<string>('');

    React.useEffect(() => {
        dispatch(GetExamInfo({ exam_id: match?.params.exam_id }));
    }, [i18n.language])

    function getQuestions() {
        if (((password && data.is_protected) || !data.is_protected) && data.hasAccess === 0) {

            // for (let index = 0; index < 200; index++) {
            // dispatch(GetExamQuestion({ password, faceId: urlBase64 ?? "", history, exam_id: match?.params.exam_id, is_protected: !!data.is_protected }))

            const isFaceTimeLimit = checkFaceIDTimeLimit();

            if (isFaceTimeLimit) {
                dispatch(GetExamQuestion({ password, faceId: "", history, exam_id: match?.params.exam_id, is_protected: !!data.is_protected }))
            }
            // }
        } else {
            if (!password) {
                message.warning("Imtihon topshirish uchun parol topilmadi!");
            } else {
                message.warning("Imtihon topshirish uchun ruxsat yo'q!");
            }
        }
    }


    if (!Boolean(data.surveyStatus)) {
        return <ExamSurvey />;
    }

    return (
        <Spin spinning={isLoading}>
            <ExamAgreement exam_id={1} />
            <AuthFaceID isProtected={!!data.is_protected} examId={data?.id ?? 0} />
            {/* <Modal
                open={!urlBase64 && !!data.is_protected}
                width={800}
                centered
                footer={null}
                title={null}
            >
                <TbArrowLeft size={20} color="#464646" className="cursor-pointer " onClick={() => { history.goBack() }} />
                <WebcamAuthStap />
            </Modal> */}
            <QRCodeModal id={user?.id} />
            <div className={`c-card mx-auto ${data.is_protected ? "w-100" : "max-lg-w-100 lg-w-50 "}`} >
                <PageContentTitle title={"Imtihon haqida ma'lumot"} />
                {
                    user?.is_contract ?
                        <>
                            <div className="waring_contract py-3 px-4 mt-3 d-flex gap-3">
                                <div className="">
                                    <TbAlertCircle size={24} color="#FF0000" />
                                </div>
                                <div>
                                    <strong>
                                        {t("Diqqat!!!")}
                                    </strong>
                                    <p className="m-0" >
                                        {t("Hurmatli talaba 01.05.2025 yilga qadar to'lov kontrakt shartnoma summasining 2/4 (50 %) miqdori yoki undan ko`p qismini to‘lashingiz zarur, aks holda 01.05.2025 yildan keyingi yakuniy imtihonlarga kiritilmaysiz va ushbu fanlardan sababsiz imtihon qoldirilgan talaba sifatida intensiv kurslarga qoldirilasiz.")}
                                    </p>
                                </div>
                            </div>
                        </>
                        : null
                }
                <Row gutter={[12, 12]} className="mt-4">
                    <Col sm={24} lg={12} xl={data.is_protected ? 12 : 24}>
                        <div className="exam_info_data">
                            <p>
                                <span><TbBook2 size={17} />{t("Fan nomi")}</span>
                                <span><strong>{data.subject?.name}</strong></span>
                            </p>
                            <p>
                                <span><TbLicense className="me-2" size={16} />{t("Imtihon")}</span>
                                <span><strong>{data.name}</strong></span>
                            </p>
                            <p>
                                <span><TbListDetails size={17} />{t("Imtihon ma'lumotlari")}</span>
                                <span>{t("Savollar soni")}: <strong>{Object.keys(JSON.parse(data?.question_count_by_type_with_ball ?? "{}")).length}</strong></span>
                                <span>{t("Maksimal ball")}: <strong>{data.max_ball}</strong></span>
                                <span>{t("Davomiyligi")}: <strong>{data?.duration ? moment.utc(data?.duration * 1000).format("HH:mm") : t("Mavjud emas")}</strong></span>
                            </p>
                            <p>
                                <span><TbClock size={17} />{t("Imtihon vaqti")}</span>
                                <span>{t("Boshlanish vaqti")}: <strong>{data?.start ?? t("Mavjud emas")}</strong></span>
                                <span>{t("Tugash vaqti")}: <strong>{data?.finish ?? t("Mavjud emas")}</strong></span>
                            </p>
                        </div>
                    </Col>
                    <Col sm={24} lg={12} xl={data.is_protected ? 12 : 24}>
                        {
                            data.hasAccess === 0 ?
                                data.is_protected ? <div className="d-flex justify-content-end">
                                    <div className="exam_password_box">
                                        <span className="text-uppercase">{t("Imtihon himoyalangan! Parolni kiriting")}.</span>
                                        <Row gutter={[12, 12]} className="mt-5">
                                            <Col xs={18} md={12} lg={16}>
                                                <Input.Password
                                                    placeholder={t("Kodni kiriting")}
                                                    type="password"
                                                    className="text-uppercase rounded-2"
                                                    autoComplete="off"
                                                    value={password}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>) => { setPassword(event.target.value) }}
                                                    onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                                                        if (event.key === "Enter" && password) {
                                                            getQuestions()
                                                        }
                                                    }} />
                                            </Col>
                                            <Col xs={6} lg={8} xl={6}>
                                                <Button type="primary" className="w-100 text-uppercase rounded-2" disabled={!password} loading={isLoadingGetQuestion} onClick={getQuestions} >{t("Yuborish")}</Button>
                                            </Col>
                                            <Col span={24}>
                                                <div className="flex-between mt-2">
                                                    <Button className="rounded-2" size="small" type="primary" onClick={() => { openModal() }} ><TbFaceId size={15} /> &nbsp; {t("Yuzni qayta tasdiqlash")}</Button>
                                                    <NavLink to={`/exam/student/answers/${data.id}`} className="d-block">{t("Imtihon uchun yozilgan javoblar")}</NavLink>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                    : <Row gutter={[24, 12]} className="exam_password_box">
                                        <Col xl={12}>
                                            <NavLink to={`/exam/student/answers/${data.id}`} className="mt-2 d-block">{t("Imtihon uchun yozilgan javoblar")}</NavLink>
                                        </Col>
                                        <Col xl={12}>
                                            <Button type="primary" className="w-100 text-uppercase rounded-2" onClick={getQuestions} >{t("Imtihonga kirish")}</Button>
                                        </Col>
                                    </Row>
                                : <div className="exma_info_warning text-center">
                                    <TbAlertTriangle size={60} color="#FC1313" />
                                    <p>Imtihon topshirish cheklangan!</p>
                                    {
                                        data.studentSubjectRestrict?.description ?
                                            <span><Typography.Text type="warning">Izoh: </Typography.Text> {data.studentSubjectRestrict?.description}</span> : null
                                    }
                                </div>
                        }
                    </Col>
                </Row>
            </div>
        </Spin >
    )

}





export default ExamInfo;