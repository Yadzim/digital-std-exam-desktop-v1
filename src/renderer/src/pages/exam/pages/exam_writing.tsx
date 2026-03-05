import React from "react";
import { BackTop, Button, Collapse, Form, message, notification, Result, Spin, Tag } from "antd";
import { useTranslation } from "react-i18next";
import SunEditor from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css';
import { CaretRightOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from "store/services";
import { GetExamQuestion } from "../service.requests";
import instance from "config/_axios";
import { useHistory, useRouteMatch, match } from "react-router-dom";
import { editor_buttonList } from "../utils";
import _logout from "config/_axios/logout";
import ExamErrorPage from "../components/ExamErrorPage";
import { changeExamQuestion, fileCheckFormat, replaceFontSize } from "../functions.utils";
import ExamRightbar from "../components/ExamRightbar";
import ExamStudentAnswerModal from "../components/ExamStudentAnswerModal";
import "../styles.scss";
import ActInfoModal from "../components/ActInfoModal";
import ProctoringAlertBanner from "../components/ProctoringAlertBanner";
import moment from "moment";
import { CButton } from "components/Buttons";


const { Panel } = Collapse;
const key = 'updatable';

const ExamWriting = (): JSX.Element => {

    const { t } = useTranslation();
    const [form] = Form.useForm();
    let isMobile = /iPhone|Android/i.test(navigator.userAgent);
    const match: match<any> | null = useRouteMatch("/exam/pass/:exam_id/:password");
    const dispatch: any = useAppDispatch();
    const history = useHistory();
    const auth = useAppSelector(state => state.auth);
    const exam = useAppSelector(state => state.exam);

    const [isFinished, setIsFinished] = React.useState<boolean>(false);
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const [isSubmited, setIsSubmited] = React.useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [isAct, setIsAct] = React.useState(false);

    const [render, setRender] = React.useState(false);

    // const user_id = auth.user?.user_id;
    // console.log(`${user_id}_${match?.params?.exam_id}`);

    // const url = sessionStorage.getItem(`${user_id}_${match?.params?.exam_id}`)

    // exam_questions -> exam question may be multiple. This variable stored tha exam questions.
    // time -> this time includes start, finish, duration and current time of student not exam.
    // exam_question -> this exam question by default includes 0 index value of exam questions. This can be changed to value in another index of exam questions if exam questions multiple.
    // question_count -> this variable means that exam questions multiple or not. If exam questions are multiple this variable includes ids of exam questions else will be empty.
    const { isLoading, time, exam_question, question_count } = useAppSelector(state => state.exam.pass_exam);
    const { isError } = useAppSelector(state => state.exam.exam_errors);




    const replacedText = (originalText: string) => replaceFontSize(originalText, exam.pass_exam.fontSize);




    function generate_key(sub_question_id: number) {

        const user_id = auth.user.user_id;
        const exam_id = match?.params.exam_id;
        // data stored to localStorage by key. Key consists of user_id, exam_id, exam_question_id, sub_question_id and the composition will be in the same order like following.
        const key = `${user_id}_${exam_id}_${exam_question?.id}_${sub_question_id}`;

        const _isKey = !user_id || !exam_id || !exam_question || !sub_question_id

        return _isKey ? null : key
    }


    // write answer to localstorage by generated key and send answers to server getting from localstorage
    const handleChange = React.useCallback((sub_question_id: number, value: string) => {

        const key = generate_key(sub_question_id);

        if (key) {
            // setTimeout(() => onSubmit(sub_question_id), 60000);

            localStorage.setItem(key, value);
        } else {
            message.warning("Ma'lumot shakllantirishda xatolik!")
        }
    }, [exam_question])


    React.useEffect(() => {
        if (!exam_question) {
            dispatch(GetExamQuestion({ password: window.atob(match?.params.password), faceId: "", history, exam_id: match?.params.exam_id, is_protected: !!exam.exam_info.data.is_protected }))
        }
    }, []);

    // Electron: start anti-cheat (proctoring) when exam writing page is shown
    React.useEffect(() => {
        const startProctoring = () => {
            try {
                if ((window as unknown as { electron?: { startProctoring?: () => void } }).electron?.startProctoring) {
                    (window as unknown as { electron: { startProctoring: () => void } }).electron.startProctoring();
                } else if (typeof (window as unknown as { require?: (id: string) => unknown }).require === 'function') {
                    const ipcRenderer = (window as unknown as { require: (id: string) => { send: (ch: string, arg?: unknown) => void } }).require('electron').ipcRenderer;
                    if (ipcRenderer) ipcRenderer.send('start-proctoring');
                }
            } catch (_) {}
        };
        const stopProctoring = () => {
            try {
                if ((window as unknown as { electron?: { stopProctoring?: () => void } }).electron?.stopProctoring) {
                    (window as unknown as { electron: { stopProctoring: () => void } }).electron.stopProctoring();
                } else if (typeof (window as unknown as { require?: (id: string) => unknown }).require === 'function') {
                    const ipcRenderer = (window as unknown as { require: (id: string) => { send: (ch: string) => void } }).require('electron').ipcRenderer;
                    if (ipcRenderer) ipcRenderer.send('stop-test-mode');
                }
            } catch (_) {}
        };
        startProctoring();
        return () => { stopProctoring(); };
    }, []);

    // Stop proctoring when exam is finished
    React.useEffect(() => {
        if (!isFinished) return;
        try {
            if ((window as unknown as { electron?: { stopProctoring?: () => void } }).electron?.stopProctoring) {
                (window as unknown as { electron: { stopProctoring: () => void } }).electron.stopProctoring();
            } else if (typeof (window as unknown as { require?: (id: string) => unknown }).require === 'function') {
                (window as unknown as { require: (id: string) => { ipcRenderer: { send: (ch: string) => void } } }).require('electron').ipcRenderer.send('stop-test-mode');
            }
        } catch (_) {}
    }, [isFinished]);


    function getStudentanswerForChecking() {
        if (exam_question) {
            // checkIsHasStudentAnswer(exam_question.id, generate_key, handleChange)
        }
    }

    const getAnswerLocalStorage = (sub_question_id: number) => {

        const key = generate_key(sub_question_id);

        if (!key) return;

        const value = localStorage.getItem(key);

        if (!value) return

        return value

    }

    const openNotification = () => {
        const key = `open${Date.now()}`;
        // const btn = (
            // <CButton
            //     className=""
            //     onClick={() => {
            //         notification.close(key);
            //         onSubmit(false);
            //     }}
            //     // disabled={isSubmited}
            //     loading={isSubmited}
            // >Saqlash</CButton>
        // );
        notification.open({
            message: 'Javoblaringizni saqlashni unutmang!!!',
            description: <div className="text-secondary">
            Vaqti-vaqti bilan yozgan javoblaringizni saqlab turing.
            <br />
            <div className="notification-progres"></div>
            </div>,
            type: 'warning',
            // btn,
            key,
            style: {
                backgroundColor: '#fffbeb',
                position: "relative",
                borderRadius: '10px'
            },
            duration: 10,
        });
    };



    const onSubmit = async (isFinishedModal: boolean, isAvtoSave?: boolean) => {

        try {


            let answers: Array<{ sub_question_id: number, answer: string }> = []

            exam_question?.question?.subQuestion?.forEach((element) => {

                const key = generate_key(element?.id)

                if (key) {
                    const value = localStorage.getItem(key);

                    if (value) {
                        answers.push({
                            sub_question_id: element?.id,
                            answer: value
                        })
                    }
                }

            })



            if (answers?.length) {
                setIsSubmited(true);

                const formdata = new FormData();

                message.loading({
                    key,
                    // type: 'loading',
                    content: 'Javoblar saqlanmoqda...',
                });

                formdata.append("subQuestionAnswers", JSON.stringify(answers));
                console.log(answers);

                const response = await instance({ url: `exam-student-answers/${exam_question?.id}?expand=examStudent&fields=*,examStudent.act`, method: 'PUT', data: formdata });

                if (response.data.status === 1) {

                    if (response?.data?.data?.examStudent?.act) {
                        setIsAct(true);
                        message.warning({
                            key,
                            // type: 'success',
                            content: "Siz act qilingansiz!",
                            duration: 1,

                        })
                    } else {
                        const startMoment = moment(time?.start, "YYYY-MM-DD HH:mm:ss");
                        const updatedMoment = moment.unix(response?.data?.data?.updated_at);
                        const currentMinute = updatedMoment.diff(startMoment, "minutes");
                        message.success({
                            key,
                            // type: 'success',
                            content: isAvtoSave ? `Javoblar Avto Saqlash orqali saqlandi! (saqlash vaqti: ${currentMinute}-daqiqa)` : "Javoblar muvaffaqiyatli saqlandi !",
                            duration: 1,

                        })
                    }

                    setIsSubmited(false);
                    // message.success("Imtihon javoblari saqlandi!")

                    if (isFinishedModal) {
                        setOpenModal(true);
                    }
                }
            } else {
                message.warning({ key, content: "Javob yozilmagan!", duration: 1 });
                setIsSubmited(false);
            }


        } catch (error: any) {
            if (Array.isArray(error?.response?.data?.errors) && error.response.data.errors.length) {

                (error.response.data.errors as any[]).forEach((errorMessage) => {
                    if (typeof errorMessage !== "string" && typeof errorMessage !== 'number') {
                        if (!errorMessage.status) {
                            message.error({
                                key,
                                // type: 'error',
                                content: "SIZ UCHUN IMTIHON VAQTI TUGAGAN.",
                                duration: 1,
                            }).then(() => {
                                setIsFinished(true);
                            });
                            // history.push(`/exam/info/${exam_question?.exam_id}`);
                        } else {
                        }
                    }
                })

            }
            setIsSubmited(false);
        }
    }

    React.useEffect(() => {
        if (!time?.start) return;
        const interval = setInterval(() => openNotification(), 20 * 60 * 1000);
        return () => clearInterval(interval);
    }, [time?.start]);


    React.useEffect(() => {
        if (!time?.finish) return;

        const finishTime = new Date(time.finish).getTime();
        const nowTime = new Date(time.now).getTime();

        const randomMinutes = Math.floor(Math.random() * (20 - 10 + 1) + 10);
        const randomOffsetMs = randomMinutes * 60 * 1000;

        const triggerTime = finishTime - randomOffsetMs;
        const delay = triggerTime - nowTime;

        if (delay > 0) {
            console.log(`Auto submit scheduled after ${Math.floor(delay / 1000 / 60)} minut`);
            const timer = setTimeout(() => {
                console.log("Auto submitting answers...");
                onSubmit(false, true);
                clearTimeout(timer);
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [time?.finish, time?.now]);



    if (isError) {

        return <ExamErrorPage getStudentanswerForChecking={getStudentanswerForChecking} />
    }

    if (isMobile) {

        return (
            <div className="px-3 py-3">
                <div className="c-card mt-3" style={{ height: "86vh" }}>
                    <Result
                        status="warning"
                        title="Your device not supported !"
                        extra={
                            <Button type="primary" key="console" onClick={() => history.push('/')}>
                                Asosiy sahifaga qaytish
                            </Button>
                        }
                    />
                </div>
            </div>
        )
    }


    return (
        <div translate="no" className="exam_write_page">
            <ProctoringAlertBanner />
            {/* {contextHolder} */}
            <ExamStudentAnswerModal
                visible={openModal}
                setVisible={setOpenModal}
                exam_question_id={exam_question?.id}
                isFinished={isFinished}
                setIsFinished={setIsFinished}
                exam_id={match?.params.exam_id}
            />
            <ActInfoModal open={isAct} setOpen={setIsAct} />
            <div className="exam-writing-box">
                <div className="editor-page">
                    <BackTop style={{ right: 10 }} />
                    <Spin spinning={isLoading}>
                        {
                            exam_question ?
                                <div>
                                    <div>
                                        <div className="c-card">
                                            <div className="d-f justify-content-between">
                                                <strong>{exam_question.question_type}</strong>
                                                <div>
                                                    {
                                                        question_count.length ?
                                                            question_count.map((element, index) => (
                                                                <Button
                                                                    key={element}
                                                                    type={exam_question.id === element ? "primary" : "dashed"}
                                                                    size="small"
                                                                    className="ms-2"
                                                                    onClick={() => changeExamQuestion(element)}>{index + 1} - savol</Button>
                                                            )
                                                            ) : null
                                                    }
                                                </div>
                                            </div>
                                            <hr />
                                            <div dangerouslySetInnerHTML={{ __html: replacedText(exam_question?.question.question?.replaceAll("&nbsp;", " ").trim() ?? '') }} ></div>
                                            {exam_question.question.file ?
                                                fileCheckFormat(exam_question.question.file) : null}
                                        </div>
                                        <Form form={form}>
                                            <Collapse
                                                bordered={false}
                                                defaultActiveKey={['1']}
                                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                                className="site-collapse-custom-collapse px-0 rounded-4"
                                            >
                                                {
                                                    exam_question.question.subQuestion.length ?
                                                        exam_question.question.subQuestion.map((subQuestion, index: number) => {
                                                            return (
                                                                <Panel
                                                                    key={index + 1}
                                                                    header={
                                                                        <div className="">
                                                                            <div className="d-f justify-content-end mb-2">
                                                                                <Tag color="#F3F5F7" className="text-uppercase" style={{ width: "180px", height: '22px', fontWeight: 500, color: '#7B808B', borderRadius: '6px' }}>{t("Maksimal ball")}: {exam_question?.max_ball * (subQuestion?.percent / 100)}</Tag>
                                                                            </div>
                                                                            <div className="exam_sub_question" dangerouslySetInnerHTML={{ __html: replacedText(subQuestion.question?.replaceAll("&nbsp;", " ").trim() ?? '') }} ></div>

                                                                        </div>
                                                                        // <div className="d-f justify-content-between">
                                                                        //     <div className="exam_sub_question" dangerouslySetInnerHTML={{ __html: replacedText(subQuestion.question?.replaceAll("&nbsp;", " ").trim() ?? '') }} ></div>
                                                                        //     &nbsp;&nbsp;<Tag color="#F3F5F7" className="text-uppercase" style={{ width: "180px", height: '22px', fontWeight: 500, color: '#7B808B' }}>{t("Maksimal ball")}: {exam_question?.max_ball * (subQuestion?.percent / 100)}</Tag>
                                                                        // </div>
                                                                    }
                                                                    className="site-collapse-custom-panel editor"
                                                                >
                                                                    <Form.Item key={index + 1} name={`${exam_question.id}_${subQuestion.id}`} >
                                                                        <SunEditor
                                                                            onPaste={(e) => {
                                                                                message.warning("Ko'chirish mumkin emas! Shpargalkadan foydalanish imtihondan chetlatilishga sabab bo'lishi mumkin!")
                                                                                e.preventDefault();
                                                                                return false;
                                                                            }}
                                                                            onDrop={(e) => {
                                                                                e.preventDefault();
                                                                                return false;
                                                                            }}
                                                                            onFocus={() => { navigator?.clipboard?.writeText('')?.catch(() => {}); }}
                                                                            onMouseDown={() => { navigator?.clipboard?.writeText('')?.catch(() => {}); }}
                                                                            height={300 + "px"}
                                                                            placeholder={t("Enter an answer")}
                                                                            onChange={(value) => { handleChange(subQuestion.id, value); setRender(p => !p) }}
                                                                            setContents={getAnswerLocalStorage(subQuestion.id)}
                                                                            setAllPlugins={true}
                                                                            setDefaultStyle="font-family:  Rubik, Helvetica, Arial, serif; font-size: 16px;"
                                                                            lang="ru"
                                                                            setOptions={{
                                                                                charCounter: true,
                                                                                charCounterLabel: "Belgilar soni: ",
                                                                                fontSize: [12, 14, 16, 18, 20, 24, 32],
                                                                                // paragraphStyles: ["dsfsd"],
                                                                                defaultStyle: 'fonst-size:22px',
                                                                                fontSizeUnit: "px",
                                                                                mathFontSize: [{ text: '18', value: '18', default: true }],
                                                                                // codeMirror: 'CodeMirror',
                                                                                katex: 'window.katex',
                                                                                buttonList: editor_buttonList,
                                                                                // font: [
                                                                                //     "Arial",
                                                                                //     "Times New Roman",
                                                                                //     "Helvetica",
                                                                                //     "Calibri",
                                                                                //     "Georgia",
                                                                                //     "Impact",
                                                                                //     "Tahoma",
                                                                                //     "Rubik, Helvetica, Arial, serif"
                                                                                // ],
                                                                            }} />
                                                                    </Form.Item>
                                                                    <p>{t("So'zlar soni")}: {getAnswerLocalStorage(subQuestion.id)?.replace(/<[^>]*>/g, "")?.trim()?.split(" ")?.filter(e => e && e !== "&nbsp;" && e !== "&nbsp;&nbsp;")?.length}</p>
                                                                </Panel>
                                                            )
                                                        }) : <span>{t("Savollar topilmadi")} !</span>
                                                }
                                            </Collapse>
                                        </Form>
                                    </div>
                                </div> : null
                        }
                    </Spin>
                </div>
                <div className="rightbar-box">
                    <ExamRightbar
                        exam_question={exam_question}
                        time={time}
                        fontSize={exam.pass_exam.fontSize}
                        setOpenModal={setOpenModal}
                        onSubmit={onSubmit}
                        isSubmited={isSubmited}
                    />
                </div>
            </div>

        </div >
    )
}




export default ExamWriting;








// this follwing code for saving answers multiple or single answers
// const onSubmit = async (_sub_question_id?: number) => {

//     try {

//         const formdata = new FormData();

//         let answers: Array<{ sub_question_id: number, answer: string }> = []

//         if (_sub_question_id) {
//             const key = generate_key(_sub_question_id)
//             if (key) {
//                 const value = localStorage.getItem(key);
//                 if (value) {
//                     answers.push({
//                         sub_question_id: _sub_question_id,
//                         answer: value
//                     })
//                 }
//             }
//         } else {

//             exam_question?.question.subQuestion.forEach((element) => {

//                 const key = generate_key(element.id)

//                 if (key) {
//                     const value = localStorage.getItem(key);

//                     if (value) {
//                         answers.push({
//                             sub_question_id: element.id,
//                             answer: value
//                         })
//                     }
//                 }

//             })

//         }

//         if (answers.length) {

//             messageApi.open({
//                 key,
//                 type: 'loading',
//                 content: 'Javoblar saqlanmoqda...',
//             });
//             setIsSubmited(true);
//             formdata.append("subQuestionAnswers", JSON.stringify(answers));
//             const response = await instance({ url: `exam-student-answers/${exam_question?.id}`, method: 'PUT', data: formdata });

//             if (response.data.status === 1) {
//                 if (!_sub_question_id) {
//                     messageApi.open({
//                         key,
//                         type: 'success',
//                         content: "Imtihon javoblari saqlandi!",
//                         duration: 2,

//                     }).then(() => setIsSubmited(false));
//                 }
//                 setOpenModal(true)
//             }
//         } else {
//             message.warning("Javob yozilmagan!");
//             setIsSubmited(false);
//         }


//     } catch (error: any) {
//         if (Array.isArray(error?.response?.data?.errors) && error.response.data.errors.length) {

//             (error.response.data.errors as any[]).forEach((errorMessage) => {
//                 if (typeof errorMessage !== "string" && typeof errorMessage !== 'number') {
//                     if (!errorMessage.status) {
//                         messageApi.open({
//                             key,
//                             type: 'error',
//                             content: "SIZ UCHUN IMTIHON VAQTI TUGAGAN.",
//                             duration: 1,
//                         }).then(() => {
//                             setOpenModal(true);
//                             setIsFinished(true);
//                         });
//                     } else {
//                     }
//                 }
//             })

//         }
//         setIsSubmited(false)
//     }
// }
