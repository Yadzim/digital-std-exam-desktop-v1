import React from "react";
import { Affix, Button, Col, Divider, Empty, Row, Spin, Tag } from "antd";
import _logout, { _logoutExam } from "config/_axios/logout";
import { IExamStudentAnswer } from "models/exam";
import { useRouteMatch, match } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import { useAppSelector } from "store/services";
import { fileCheckFormat } from "../functions.utils";
import useGetAllData, { TypeReturnUseGetAllData } from "hooks/useGetAllData";
import { PageContentTitle } from "components/Title";
import { useTranslation } from "react-i18next";


const ExamQuestionAnswersView = () => {

    const match: match<any> | null = useRouteMatch("/exam/student/answers/:exam_id");
    const user_me = useAppSelector(state => state.user.user);
    const { t } = useTranslation();

    const [answerIndex, setAnswerIndex] = React.useState<number>(0);

    const { items, loading, fetch } = useGetAllData({
        url: `/exam-student-answers?expand=question.subject,examStudentAnswerSubQuestion.subQuestion&fields=*,question.question,question.question_file,question.subject.name&filter=${JSON.stringify({ exam_id: match?.params?.exam_id, student_id: user_me?.id })}`, params: { 'per-page': 0 }
    }) as TypeReturnUseGetAllData<IExamStudentAnswer>


    React.useEffect(() => {
        if (user_me?.id) {
            fetch();
        }
    }, [user_me])


    return (
        <Spin spinning={loading}>
            <div className="c-card">
                <Affix offsetTop={60}>
                    <Row className="w-100 bg-white py-2" style={{ background: "white" }} >
                        <Col xl={12}>
                            <PageContentTitle title={items[answerIndex]?.question?.subject?.name} />
                        </Col>
                        <Col xl={12} className="text-end">
                            {
                                items && items.length > 1 ?
                                    items.map((element, index) => (
                                        <Button
                                            type={answerIndex === index ? "primary" : "dashed"}
                                            size="small"
                                            className="ms-2"
                                            onClick={() => { setAnswerIndex(index) }}
                                        >{index + 1}-savol</Button>
                                    )) : null
                            }
                        </Col>
                        {/* <Col span={24}><hr /></Col> */}

                    </Row>
                </Affix>
                <Divider className="my-2" />
                {
                    items[answerIndex] ?
                        <div className="student_answer_view_page">
                            <div className="body_question">
                                <strong className="mb-2 d-block">KAZUS</strong>
                                <span dangerouslySetInnerHTML={{ __html: items[answerIndex]?.question.question?.replaceAll("&nbsp;", " ").trim() ?? '' }}></span>
                                {items[answerIndex]?.question?.question_file ?
                                    fileCheckFormat(items[answerIndex].question.question_file ?? '') : null}
                            </div>
                            {
                                items[answerIndex].examStudentAnswerSubQuestion?.length ?
                                    items[answerIndex].examStudentAnswerSubQuestion.map((element, index) => {
                                        return (
                                            <div key={element.id} className="sub_question">
                                                <div className="d-f justify-content-end mb-2">
                                                    {
                                                        items[answerIndex]?.max_ball && element?.subQuestion?.percent ?
                                                            <Tag color="#F3F5F7" className="text-uppercase" style={{ width: "180px", height: '22px', fontWeight: 500, color: '#7B808B', borderRadius: '6px' }}>{t("Maksimal ball")}: {(Number(items[answerIndex]?.max_ball) * Number(element?.subQuestion?.percent)) / 100}</Tag> : null
                                                    }

                                                </div>
                                                <div className="d-f justify-content-between px-3">
                                                    <span dangerouslySetInnerHTML={{ __html: element.subQuestion?.question?.replaceAll("&nbsp;", " ").trim() ?? '' }}></span>
                                                    {
                                                        // items[answerIndex]?.max_ball && element?.subQuestion?.percent ?
                                                        //     <span>{t("Maksimal ball")}: <strong>{(Number(items[answerIndex]?.max_ball) * Number(element?.subQuestion?.percent)) / 100}</strong></span> : null
                                                    }
                                                </div>
                                                <Divider className="my-2" />
                                                <p className="px-3" dangerouslySetInnerHTML={{ __html: element.answer ?? `<span class="text-danger">Javob yozilmagan</span>` }}></p>
                                            </div>
                                        )
                                    }) : null
                            }

                        </div> : <Empty description={t("Ma'lumot topilmadi")} />
                }
            </div>
        </Spin>
    )


}






export default ExamQuestionAnswersView;