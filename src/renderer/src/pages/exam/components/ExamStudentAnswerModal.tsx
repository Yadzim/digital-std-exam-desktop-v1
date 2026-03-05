import React from "react";
import { Checkbox, Col, Divider, Empty, Modal, Row, Spin } from "antd";
import { CButton } from "components/Buttons";
import { _logoutExam } from "config/_axios/logout";
import useGetOneData, { ReturnTypeUseGetOneData } from "hooks/useGetOneData";
import { IExamQuestion } from "models/exam";
import { useTranslation } from "react-i18next";
import { fileCheckFormat } from "../functions.utils";
import { FaExclamationTriangle } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import "../styles.scss";


type PropsTypeExamStudentAnswerModal = {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    exam_question_id: number | undefined,
    isFinished: boolean,
    setIsFinished: React.Dispatch<React.SetStateAction<boolean>>
    exam_id: number
}

const ExamStudentAnswerModal = ({ visible, exam_question_id, setVisible, isFinished, setIsFinished, exam_id }: PropsTypeExamStudentAnswerModal) => {

    const { t } = useTranslation();
    const history = useHistory();

    const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);

    const data = useGetOneData({ url: `/exam-student-answers/${exam_question_id}?expand=question,examStudentAnswerSubQuestion.subQuestion&fields=*,question.question,question.question_file` }) as ReturnTypeUseGetOneData<IExamQuestion>

    React.useEffect(() => {
        if (visible) {
            data.fetch(`/exam-student-answers/${exam_question_id}?expand=question,examStudentAnswerSubQuestion.subQuestion&fields=*,question.question,question.question_file`);
        }
    }, [visible])

    const onClose = () => {

        setVisible(false);
        data.setData({});
        if (isConfirmed) {
            setIsConfirmed(false);
        }
        if (isFinished) {
            setIsFinished(false)
        }
    }


    return (
        <Modal
            open={visible}
            footer={null}
            className="exam-student-answer-ant-modal"
            closeIcon={<span></span>}
        >
            <div className="exam-student-result-modal-box">
                <div className="exam-student-result-modal-body">
                    <div className="result-modal-header pb-2 mb-2">
                        {
                            isFinished ?
                                <div className="time-finish-warning">
                                    <FaExclamationTriangle className="me-2 vertical-align-end" size={30} />
                                    <span>{t("SIZ UCHUN IMTIHON VAQTI TUGAGAN. QUYIDA SAQLANGAN JAVOBLARINGIZ KELTIRILGAN")}.</span>
                                </div> :
                                <span>{t("QUYIDA SIZ YOZGAN VA SAQLAGAN JAVOBLARINGIZ KELTIRILGAN")}.</span>
                        }
                    </div>
                    <div className="result-modal-body">
                        <Spin spinning={data.loading}>
                            {
                                data.data ?
                                    <div className="student_answer_view_page">
                                        <div className="body_question">
                                            <strong>KAZUS</strong>
                                            <span dangerouslySetInnerHTML={{ __html: data.data?.question?.question?.replaceAll("&nbsp;", " ").trim() ?? '' }}></span>
                                            {data.data?.question?.question_file ?
                                                fileCheckFormat(data.data?.question?.question_file) : null}
                                        </div>
                                        {
                                            data.data.examStudentAnswerSubQuestion?.length ?
                                                data.data.examStudentAnswerSubQuestion.map((element, index) => {
                                                    return (
                                                        <div key={element.id} className="sub_question">
                                                            <div className="d-f justify-content-between px-2">
                                                                <span dangerouslySetInnerHTML={{ __html: element.subQuestion?.question?.replaceAll("&nbsp;", " ").trim() ?? '' }}></span>
                                                                {
                                                                    data?.data?.max_ball && element?.subQuestion?.percent ?
                                                                        <span>{t("Maksimal ball")}: <strong>{(Number(data?.data?.max_ball) * Number(element?.subQuestion?.percent)) / 100}</strong></span> : null
                                                                }
                                                            </div>
                                                            <Divider className="my-3" />
                                                            <p className="mt-1 px-2" dangerouslySetInnerHTML={{ __html: element.answer ?? '' }}></p>
                                                        </div>
                                                    )
                                                }) : null
                                        }

                                    </div> : <Empty description={t("Ma'lumot topilmadi")} />
                            }
                        </Spin>
                    </div>
                    <div className="footer">
                        <Row gutter={[12, 12]}>
                            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                                <Checkbox
                                    checked={isConfirmed}
                                    onChange={() => setIsConfirmed(!isConfirmed)}
                                >
                                    <span className="text-uppercase user-select-none" style={{ color: "red" }}>{t("ALL MY ANSWERS ARE COMPLETE AND UNCHANGED")}.</span>
                                </Checkbox>
                            </Col>
                            <Col xl={12} lg={12} md={12} sm={24} xs={24} className="text-end">
                                {
                                    isFinished ?
                                        <CButton colortype="red" className="me-2" onClick={() => { onClose(); history.push(`/exam/info/${exam_id}`) }}>Bekor qilish</CButton> :
                                        <CButton colortype="green" className="me-2" onClick={onClose}>Davom ettirish</CButton>
                                }
                                <CButton colortype="red" disabled={!isConfirmed} onClick={_logoutExam}>Imtihonni yakunlash</CButton>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </Modal>
    )
}


export default ExamStudentAnswerModal;