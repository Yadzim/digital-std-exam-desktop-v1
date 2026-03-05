import React, { useEffect, useRef, useState } from "react";
import { Button, Empty, message, Rate, Spin, Tooltip } from "antd";
import instance from "config/_axios";
import { useRouteMatch, match } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import { useAppDispatch, useAppSelector } from "store/services";
import { asyncN } from "utils/notifications";
import { EXAM_ACTIONS } from "store/exam";
import { useTranslation } from "react-i18next";
import { tommss } from "utils/functions";


const ExamSurvey = () => {

    const { t } = useTranslation();
    const dispatch: any = useAppDispatch();
    const { exam_survey_questions, data, isLoading: isLoadingGetQuestion } = useAppSelector(state => state.exam.exam_info);
    const user_data = useAppSelector(state => state.user);


    const match: match<any> | null = useRouteMatch("/exam/info/:exam_id");

    const [answers, setAnswers] = React.useState<Record<string, number | undefined>>({});
    const [isLoading, setIsLoading] = useState(false);

    const [timer, setTimer] = useState<number>(1 * 20);
    const interval = useRef<any>(null);

    useEffect(() => {
        _interval();

        return () => {
            _clearInterval();
        }
    }, []);

    const _interval = () => {
        interval.current = setInterval(() => {
            setTimer(p => {
                if (p <= 0) {
                    _clearInterval();
                    return p
                } else {
                    return --p
                }
            });
        }, 1000)
    };

    const _clearInterval = () => {
        clearInterval(interval.current);
    }

    const handleChange = (survey_question_id: number, ball: number | undefined) => {
        setAnswers(prevState => ({
            ...prevState,
            [survey_question_id]: ball
        }))
    }


    function isHasAnswer() {

        if (!exam_survey_questions?.length) return false;

        return Object.getOwnPropertyNames(answers).length === exam_survey_questions.length;

    }


    const onSubmit = async () => {
        try {
            setIsLoading(true);

            if (isHasAnswer()) {
                const formData = new FormData();

                formData.append("answers", JSON.stringify(answers));
                formData.append("exam_id", String(match?.params?.exam_id));

                const response = await instance({ url: '/survey-answers', method: 'POST', data: formData });

                if (response.data.status === 1) {
                    dispatch(EXAM_ACTIONS.setSurveyStatus())
                    message.success("Ma'lumot qo'shildi");
                } else {
                    message.error("Xatolik kelib chiqdi")
                }
            } else {
                message.warning("Quydagi savollarning barchasiga javob berish zarur.");
            }


        } catch (error: any) {
            asyncN("error", "create", error?.response ? error?.response?.data?.message : error?.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (Array.isArray(exam_survey_questions) && !exam_survey_questions.length) {
        return (
            <Card>
                <CardBody className="py-5">
                    <Empty description={<>Ma'lumot topilmadi</>} />
                </CardBody>
            </Card>
        )
    }

    return (
        <div className="user-select-none">
            <Card>
                <CardBody>
                    <div className="survey_box">
                        <div className="d-f gap-2 my-2 fs-5"><b className="text-black-50" >{("Subject")}:</b><span>{data?.subject?.name}</span></div>

                        <div className="warning mb-4">
                            {
                                user_data.user && user_data.user.edu_lang_id === 3 ?
                                    <>
                                        <strong>Уважаемый студент.</strong><br /> Этот опрос проводится в конце каждого семестра и никак не влияет на итоговый результат экзамена.
                                        Все итоговые контрольные  работы автоматически шифруются и анонимно отправляются на кафедры для проверки.
                                    </> :
                                    <>
                                        <strong>Hurmatli talaba.</strong><br /> Mazkur so'rovnoma har semestr oxirida o'tkazilib, yakuniy imtihon natijasiga umuman ta'sir ko'rsatmaydi.
                                        Barcha yakuniy ishlar avtomatik ravishda shifrlanib, kafedraga tekshirish uchun anonim shaklda yuboriladi.<br />
                                    </>
                            }
                        </div>
                        <Spin spinning={isLoadingGetQuestion}>
                            {
                                exam_survey_questions ? exam_survey_questions?.map((element, index) => {
                                    return (
                                        <div key={element.id} className="list_item">
                                            <span>{index + 1}. {element.question}</span><br />
                                            <Rate count={element.max} value={answers[element.id]} onChange={(ball) => handleChange(element.id, ball)} />
                                        </div>
                                    )
                                })
                                    : isLoadingGetQuestion ? <div className="py-5"></div> : <Empty description={<>So'rovnoma ma'lumotlari topilmadi</>} />
                            }
                        </Spin>
                    </div>
                    <hr />
                    <div className="d-f justify-content-end gap-5">
                        <div className="d-f gap-3">
                            <h4 className="m-0 p-0 text-primary" >{tommss(timer)}</h4>
                            {
                                //<LuLoader2 size={22} className={timer ? "loader" : ""} color={timer ? "red" : "green"} />
                            }
                        </div>
                        <Tooltip
                            placement="topRight"
                            title={!timer ? undefined : t("Yuqoridagi so'rovnomani e'tibor bilan o'qib chiqib to'ldiring. Ushbu vaqt yakunlangandan so'ng SAQLASH tugmasi faol bo'ladi")}
                        >
                            <div>
                                {/* <CButton disabled={!!timer || Object.getOwnPropertyNames(answers).length !== exam_survey_questions?.length} onClick={onSubmit}>Saqlash</CButton> */}
                                <Button loading={isLoading} className="rounded-2 px-4" disabled={!!timer || Object.getOwnPropertyNames(answers).length !== exam_survey_questions?.length} onClick={onSubmit}>Saqlash</Button>
                            </div>
                        </Tooltip>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}



export default ExamSurvey;