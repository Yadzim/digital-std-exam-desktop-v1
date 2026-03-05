import React from 'react';
import { Drawer, Modal } from "antd";
import { FaExclamationCircle, FaExclamationTriangle } from "react-icons/fa";
import { CButton } from "components/Buttons";
import moment from "moment";
import { IExamQuestion } from "models/exam";
import { useAppDispatch, useAppSelector } from "store/services";
import { EXAM_ACTIONS } from "store/exam";
import { useTranslation } from "react-i18next";
import StudentAvatarCard from "components/structure/components/Avatar";
import { NavLink } from 'react-router-dom';
import ProctoringEventsBar from "./ProctoringEventsBar";
import ExamFaceProctoring from "./ExamFaceProctoring";

type PropsTypeExamRightbar = {
    exam_question: IExamQuestion | null,
    time: any,
    fontSize: number,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    onSubmit: (isFinishedModal: boolean) => void,
    isSubmited: boolean
}

const ExamRightbar = ({ exam_question, time, fontSize, setOpenModal, onSubmit, isSubmited }: PropsTypeExamRightbar): JSX.Element => {

    const dispatch: any = useAppDispatch();
    const { data } = useAppSelector(state => state.exam.exam_info);

    const { t, i18n } = useTranslation();

    const handleFinish = () => {
        Modal.confirm({
            title: <div className="d-f"><FaExclamationCircle size={22} color='#FF0000' />&nbsp;&nbsp;{t("Imtihonni yakunlash")}</div>,
            icon: null,
            content: t("Haqiqatdan ham imtihonni yakunlamoqchimisiz?"),
            okText: t('Yakunlash'),
            cancelText: t('Imtihonga qaytish'),
            onOk: () => { setOpenModal(true) },
            autoFocusButton: "cancel",
            okButtonProps: {
                loading: isSubmited,
                danger: true,
                className: "rounded"
            },
            cancelButtonProps: {
                className: "rounded"
            }
        });
    };

    return (
        <div className="user-select-none">
            <Drawer
                placement="right"
                closable={false}
                open={true}
                getContainer={false}
                width={260}
                style={{ position: 'fixed', top: '60px', zIndex: 1 }}
            >
                <StudentAvatarCard isMobile={false} />
                <div className="warning_exam_pass">
                    <strong><FaExclamationTriangle size={14} className="mb-1" />&nbsp;&nbsp;{t("E'tibor qarating")}!</strong><br />
                    <span>
                        {
                            i18n.language === 'uz' ?
                                "Imtihon bilan bog'liq muammoli vaziyatlar haqida imtihon xonasini tark etmasdan ogohlantiring. Imtihonni yakunlaganingizdan so'ng yozgan javoblaringizni tekshiring." :
                                "Обращайтесь о проблемах, связанных с экзаменом, не выходя из экзаменационной аудитории. После завершения экзамена проверьте свои ответы."
                        }
                    </span>
                </div>
                <div className="exam_pass_info">
                    <p style={{ fontSize: "13px" }} className="text-uppercase">{t("Imtihon haqida ma'lumot")}</p>
                    <div className="date_box_exam_pass">
                        <span>{t("Fan")}: </span><b>{data?.subject?.name}</b><br />
                        {/* <span>{t("Savol turi")}: </span><b>{exam_question?.question_type}</b><br />
                        <span>{t("Savollar soni")}: </span><b>{Object.keys(JSON.parse(exam_question?.exam?.question_count_by_type_with_ball ?? "{}")).length}</b><br /> */}
                        <span>{t("Maksimal ball")}: </span><b>{exam_question?.max_ball}</b><br />
                        <span>{t("Boshlash vaqti")}: </span><b>{moment(time?.start).format("DD-MM-YYYY HH:mm:ss")}</b><br />
                        <span>{t("Tugash vaqti")}: </span><b>{moment(time?.finish).format("DD-MM-YYYY HH:mm:ss")}</b><br />
                        <span>{t("Davomiyligi")}: </span><b>{moment.utc(Number(time?.duration) * 1000).format("HH:mm:ss")}</b>
                    </div>
                </div>
                <hr />
                <div className="d-f justify-content-between text-uppercase">
                    <span>{t("Matn o'lchami")}</span>
                    <button className='rounded-2' onClick={() => dispatch(EXAM_ACTIONS.toggleFontSize({ type: 'increment' }))} disabled={fontSize > 14}>A+</button>
                    <button className='rounded-2' onClick={() => dispatch(EXAM_ACTIONS.toggleFontSize({ type: 'decrement' }))} disabled={fontSize <= 0} >A-</button>
                </div>
                <hr />
                <div className="d-f justify-content-between mt-4">
                    <CButton
                        className="w-50 me-2"
                        onClick={() => onSubmit(false)}
                        // disabled={isSubmited}
                        loading={isSubmited}
                    >Saqlash</CButton>
                    <CButton
                        className="w-50"
                        colortype="red"
                        disabled={isSubmited}
                        onClick={handleFinish}
                    >Yakunlash</CButton>
                </div>
                <NavLink to={`/exam/student/answers/${exam_question?.exam_id}`} className="d-block mt-3" >
                    <CButton className='w-100' >Saqlangan javoblar</CButton>
                </NavLink>
                <ExamFaceProctoring />
                <ProctoringEventsBar />
            </Drawer>
        </div>
    )
}

export default ExamRightbar;