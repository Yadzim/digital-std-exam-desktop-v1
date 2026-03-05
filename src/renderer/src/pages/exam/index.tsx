import React, { FC } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Col, Empty, Row, Spin, message } from 'antd';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { useAppDispatch, useAppSelector } from 'store/services';
import useGetAllData, { TypeReturnUseGetAllData } from 'hooks/useGetAllData';
import { IEducationSemesterSubject } from 'models/education';
import { IExam } from 'models/exam';
import { CButton } from 'components/Buttons';
import ExamAgreement from 'pages/exam/components/Agreement';
import { EXAM_ACTIONS } from 'store/exam';
import ConditionalTitle from './components/ConditionalTitle';
import HomeProfile from './components/HomeProfile';
import { TbAlertTriangle, TbArrowRight, TbBuildingCommunity, TbClock, TbDeviceDesktopOff, TbDeviceDesktopPin } from 'react-icons/tb';
import "./styles.scss";
import { FaArrowRight } from 'react-icons/fa';


const StudentExamHomePage: FC = (): JSX.Element => {

    const { t } = useTranslation();

    const history = useHistory();
    const dispatch: any = useAppDispatch();

    const { user } = useAppSelector(state => state.user);

    const { value, writeToUrl } = useUrlQueryParams({});
    const subjects = useGetAllData({ url: `/edu-semestr-subjects?expand=subject&filter=${JSON.stringify({ edu_semestr_id: value.filter.edu_semester_id })}`, perPage: 0 }) as TypeReturnUseGetAllData<IEducationSemesterSubject>;
    const exams = useGetAllData({ url: `/exams?expand=myComputer,examStudent&filter=${JSON.stringify({ edu_semestr_subject_id: value.filter.edu_semester_subject_id, status: 1 })}`, perPage: 0 }) as TypeReturnUseGetAllData<IExam>;


    React.useEffect(() => {
        if (!value.filter.edu_semester_id && user) {
            if (user.eduPlan?.eduSemestrs?.length) {
                const edu_semester_id = user?.eduPlan?.eduSemestrs?.find(e => e.status === 1);
                if (edu_semester_id) {
                    writeToUrl({ name: 'edu_semester_id', value: edu_semester_id.id })
                } else {
                    message.error("Aktiv semestr topilmadi!")
                }
            }
        }
    }, [user])

    React.useEffect(() => {
        if (value.filter.edu_semester_id) {
            subjects.fetch()
        }
    }, [value.filter.edu_semester_id]);


    React.useEffect(() => {
        if (value.filter.edu_semester_subject_id) {
            exams.fetch()
        }
    }, [value.filter.edu_semester_subject_id])

    React.useEffect(() => {
        dispatch(EXAM_ACTIONS.clearFaceId())
    }, []);

    const toExam = (exam_id: number) => {

        const exam = exams.items.find(e => e.id === exam_id);

        if (exam) {
            if (exam.examStudent?.length && exam.examStudent[0].start) {
                history.push(`/exam/info/${exam_id}`);
            } else {
                dispatch(EXAM_ACTIONS.agreementToggle({ isAgreement: exam_id }))
            }

        }
    }

    const goToSubject = () => {
        if (exams.items.length) {
            exams.setState([])
        }
        writeToUrl({ name: "edu_semester_subject_id", value: '' });
        writeToUrl({ name: "subject", value: '' });
    }

    return (
        <div className='c-card'>
            <ExamAgreement exam_id={value.filter?.exam_id} />
            <Row gutter={[24, 12]} className='home-page-wrpper '>
                <Col xl={8} lg={9} md={24} sm={24} xs={24}>
                    <HomeProfile user={user} />
                </Col>
                <Col xl={16} lg={15} md={24} sm={24} xs={24}>
                    <ConditionalTitle user={user} goToSubject={goToSubject} refetch={exams.fetch} loading={exams.loading} />
                    {
                        value.filter.edu_semester_subject_id ?
                            <Spin spinning={exams.loading}>
                                <div style={{ backgroundColor: "#F3F5F7", borderRadius: "16px" }} className='d-flex flex-column p-2 mt-3 gap-2'>
                                    {
                                        exams?.items?.length ?
                                            exams.items.map((examItem) => {
                                                return (
                                                    <div className='c-card text-uppercase-'>
                                                        <div className="d-f justify-content-between flex-wrap gap-3">
                                                            <div>{examItem?.name}</div>
                                                            <div className="">
                                                                {
                                                                    examItem?.myComputer ? !examItem?.myComputer?.is_in_time ? <div className='d-flex flex-column gap-1'>
                                                                        <div className="">
                                                                            <b className='opacity-50' >{t("Imtihon vaqtingiz")}: &nbsp;</b>
                                                                            <TbClock className='opacity-50' size={16} /> {examItem?.myComputer?.date} ({examItem?.myComputer?.start} - {examItem?.myComputer?.end})
                                                                        </div>
                                                                        <div className="waring_contract py-1 px-4 d-f gap-3">
                                                                            <TbAlertTriangle size={17} />{t("Imtihon topshirish vaqti to'g'ri kelmadi!!!")}
                                                                        </div>
                                                                    </div>
                                                                        : !examItem?.myComputer?.is_right_computer ? <div className='d-flex flex-column gap-1'>
                                                                            <div className="">
                                                                                <b className='opacity-50' >{t("Imtihon joyingiz")}: &nbsp;</b>
                                                                                <TbBuildingCommunity className='opacity-50' size={16} /> {examItem?.myComputer?.building} / {examItem?.myComputer?.room} xona -&nbsp;
                                                                                <TbDeviceDesktopPin className='opacity-50' size={16} /> {examItem?.myComputer?.number} {t("kompyuter")}
                                                                            </div>
                                                                            <div className="waring_contract py-1 px-4 d-f gap-3">
                                                                                <TbAlertTriangle size={17} />{t("Sizga bu kompyuter uchun ruxsat berilmagan!!!")}
                                                                            </div>
                                                                        </div>
                                                                            : <div className="d-f flex-wrap gap-1">
                                                                                <NavLink to={`/exam/student/answers/${examItem.id}`}><CButton disabled={!examItem?.examStudent?.length} posicon={<TbArrowRight />}>Javoblar</CButton></NavLink>
                                                                                <CButton colortype='green' posicon={<TbArrowRight />} disabled={examItem.status !== 1} onClick={() => toExam(examItem.id)}>Imtihon topshirish</CButton>
                                                                            </div>
                                                                        : <div className="waring_contract py-2 px-4 d-f gap-3">
                                                                            <TbDeviceDesktopOff size={17} />{t("Sizga bu imtihon uchun kompyuter biriktirilmagan!!!")}
                                                                        </div>
                                                                }
                                                            </div>
                                                        </div>
                                                        {/* <Row gutter={[0, 12]}>
                                                                        <Col xl={14} lg={14} md={24} sm={24} xs={24} className='exam-list'>{examItem.name}</Col>
                                                                        <Col xl={10} lg={10} md={24} sm={24} xs={24} className='text-end'>
                                                                            <NavLink to={`/exam/student/answers/${examItem.id}`}><CButton className='me-2' disabled={!examItem?.examStudent?.length} posicon={<BiRightArrowAlt />}>Javoblar</CButton></NavLink>
                                                                            <CButton colortype='green' posicon={<BiRightArrowAlt />} disabled={examItem.status !== 1} onClick={() => toExam(examItem.id)}>Imtihon topshirish</CButton>
                                                                        </Col>
                                                                    </Row> */}
                                                    </div>
                                                )
                                            }) : <Empty description={t("Sizda ushbu fandan faol imtihonlar mavjud emas")} />
                                    }
                                </div>
                            </Spin>
                            :
                            <Spin spinning={subjects.loading}>
                                <div style={{ backgroundColor: "#F3F5F7", borderRadius: "16px" }} className='d-flex flex-column ps-2 pe-0 py-2 mt-3 gap-2 subjects-scroll-container'>
                                    {
                                        subjects?.items?.length ?
                                            subjects.items.map((e) => {
                                                return (
                                                    <div onClick={() => {
                                                        writeToUrl({ name: "edu_semester_subject_id", value: e?.id });
                                                        writeToUrl({ name: "subject", value: e?.subject?.name });
                                                    }}
                                                        className='c-card text-uppercase subject-list py-2 d-f justify-content-between'
                                                    >
                                                        <span>{e?.subject?.name}</span>
                                                        <div className='d-flex align-items-center gap-2 link-text' style={{textTransform: 'lowercase'}}>
                                                            ko'rish <FaArrowRight />
                                                        </div>
                                                    </div>
                                                )
                                            }) : <Empty description={t("Ma'lumot topilmadi")} />
                                    }
                                </div>
                            </Spin>
                    }
                </Col>
            </Row>
        </div>
    )
}

export default StudentExamHomePage;