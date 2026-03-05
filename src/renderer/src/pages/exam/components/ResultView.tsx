import { Button, Col, Empty, Popconfirm, Row, Spin, Typography } from "antd";
import _logout, { _logoutExam } from "config/_axios/logout";
import { FILE_URL } from "config/utils";
import { IExamQuestion } from "models/exam";
import { useTranslation } from "react-i18next";
import { BiX } from "react-icons/bi";
import { Card, CardBody } from "reactstrap";




const { Text } = Typography;

const ResultView = ({ data, isLoading }: { data: IExamQuestion | undefined, isLoading: boolean }) => {
    const { t } = useTranslation();

    return (
        <Spin spinning={isLoading}>
            <Card>
                <CardBody>
                    {
                        data ?
                            <div className="student_answer_view_page">
                                <div className="body_question">
                                    <strong>{t("Savol")}</strong>
                                    <span dangerouslySetInnerHTML={{ __html: data?.question.question?.replaceAll("&nbsp;", " ").trim() ?? '' }}></span>
                                </div>
                                {data?.file ? <div className="bg-light p-3">
                                    <Card className="p-3" >
                                        <p>{t("Javob fayli")}:</p>
                                        <iframe src={FILE_URL + data?.file} width="100%" height={'800px'}></iframe>
                                    </Card>
                                </div> : null}
                                {
                                    data.examStudentAnswerSubQuestion?.length ?
                                        data.examStudentAnswerSubQuestion.map((element, index) => {
                                            return (
                                                <div key={element.id} className="sub_question">
                                                    <div className="index_question">{index + 1}</div>
                                                    <span dangerouslySetInnerHTML={{ __html: element.subQuestion?.question?.replaceAll("&nbsp;", " ").trim() ?? '' }}></span>
                                                    <p className="mt-3" dangerouslySetInnerHTML={{ __html: element.answer ?? '' }}></p>
                                                </div>
                                            )
                                        }) : null
                                }

                            </div> : <Empty description={t("Ma'lumot topilmadi")} />
                    }
                    <Row className="mt-3">
                        <Col xl={16}>
                            <Text type="danger">{t("Ko'rsatilgan 'IMTIHONNI YAKUNLASH' tugmasini bosish orqali siz imtihonni tugatasiz")}</Text>
                        </Col>
                        <Col xl={8} className="text-end">
                            <Popconfirm
                                placement="top"
                                title={<span className="d-block" >{t("Imtihonni yakunlaysizmi?")}</span>}
                                onConfirm={() => _logoutExam()}
                                okText={t("YAKUNLASH")}
                                cancelText={t("BEKOR QILISH")}
                                style={{ width: "100%" }}
                            >
                                <Button type="primary" className="px-5" danger>{t("IMTIHONNI YAKUNLASH")}</Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Spin>
    )


}






export default ResultView;