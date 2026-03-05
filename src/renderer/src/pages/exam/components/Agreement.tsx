import { Checkbox, Modal } from "antd";
import { CButton } from "components/Buttons";
import i18next from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { EXAM_ACTIONS } from "store/exam";
import { useAppDispatch, useAppSelector } from "store/services";




const ExamAgreement = ({ exam_id }: { exam_id: number | undefined }) => {

    const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false)
    const exam_info = useAppSelector(state => state.exam.exam_info);
    const dispatch: any = useAppDispatch();
    const history = useHistory();

    const { t } = useTranslation();


    const toExamLogin = () => {
        if (exam_info.isAgreement) {
            history.push(`/exam/info/${exam_info.isAgreement}`);
            dispatch(EXAM_ACTIONS.agreementToggle({ isAgreement: null }))
        }
    }


    return (
        <div>
            <Modal
                open={Boolean(exam_info.isAgreement)}
                className="w-75"
                footer={null}
                closeIcon={<span></span>}
            >
                <div className="confirm_exam_conditions">
                    {
                        i18next.language === 'uz' ?
                            <>
                                <h4>Quydagilar bilan tanishib chiqib imtihonni boshlashingiz mumkin</h4>
                                <div className="agreement-text my-3">
                                    <div className="ag-title">TAQIQLANADI VA DALOLATNOMA TUZILISHIGA SABAB BO'LADIGAN XOLATLAR</div>
                                    <ul>
                                        <li>Imtihonga smartfon, smartsoat, eshitish moslamalari, shpargalkalar, kitoblar va boshqa ko'chirishga imkon beruvchi vositalarni olib kirish <span className="mark-text">TAQIQLANADI</span></li>
                                        <li>Imtihon vaqtida baland ovozda gapirish, boshqa talabalar bilan gaplashish, o'rniga o'rni kirish yoki ko'chirtirish <span className="mark-text">TAQIQLANADI</span></li>
                                        <li>Imtihon vaqtida nazoratchining ruxsatisiz o'rnidan turish yoki belgilangan joyini o'zgartirish <span className="mark-text">TAQIQLANADI</span></li>
                                    </ul>
                                    <div className="ag-title">Ogohlantirildim</div>
                                    <ul>
                                        <li>Javoblarni har birini o'zining belgilangan joyiga <span className="mark-text">YOZISH SHART</span> odatda kazus savollari 3 yoki undan ko'p bo'ladi. Bitta javobga barcha javoblar yozib qo'yilsa maksimal shu kazus savoliga belgilangan ball berilishi mumkin</li>
                                        <li>Har bir talaba uchun imtihonda 2 ta vaqt mavjud tugash vaqti va davomiyligi. Ushbu belgilangan vaqtlardan ixtiyoriy birining muddati buzilsa yozma ish <span className="mark-text">SAQLANMAYDI</span></li>
                                        <li>Yozma ishni o'z vaqtida yakunlash va yozish jarayonida saqlash tugmasini bosish</li>
                                        <li>Imtihon yakunlangandan so'ng yozma ish saqlanganligini tekshirish</li>
                                        <li>Imtihon vaqtida yuzaga kelgan texnik nosozlik bo'yicha nazoratchiga murojaat qilish va holatni rasmiylashtirish <span className="mark-text">(MUROJAATNI IMTIHON XONADAN CHIQMAGAN HOLDA RASMIYLASHTIRISH SHART)</span></li>
                                        <li>Imtihon(lar) tugagandan so'ng o'z shaxsiy sahifangizdan chiqib ketish shart</li>
                                    </ul>
                                    Imtihon yakunlangandan so'ng imtihon vaqtida yuz bergan texnik nosozlik, jumladan ish saqlanmaganligi, adashib bir kazus savoliga barcha javoblarni yozib qo'yilganligi va boshqa har qanday murojaat ko'rib chiqilmaydi.
                                </div>
                            </> :
                            <>
                                <h4>Перед началом экзамена ознакомьтесь с правилами!</h4>
                                <div className="agreement-text my-3">
                                    <div className="ag-title">ЗАПРЕЩАЮЩИЕ ПОЛОЖЕНИЯ И УСЛОВИЯ СОСТАВЛЕНИЯ АКТА ОБ УДАЛЕНИИ С ЭКЗАМЕНА</div>
                                    <ul>
                                        <li><span className="mark-text">ЗАПРЕЩАЕТСЯ</span> приносить на экзамен смартфоны, смартчасы, наушники, шпаргалки, книги и другие средства и устройства.</li>
                                        <li><span className="mark-text">ЗАПРЕЩАЕТСЯ</span> во время экзамена говорить громко, разговаривать с другими студентами, позволять списывать свой материал, а также сдавать экзамен вместо другого студента.</li>
                                        <li><span className="mark-text">ЗАПРЕЩАЕТСЯ</span> вставать или пересаживаться во время экзамена без разрешения наблюдателя.</li>
                                    </ul>
                                    <div className="ag-title">Я УВЕДОМЛЕН </div>
                                    <ul>
                                        <li>Каждый ответ <span className="mark-text">ДОЛЖЕН БЫТЬ ВПИСАН</span> в определённое для ответа место. Обычно вопросов-казусов 3 или более. Если Вы все ответы впишите в один ответ, максимальный балл будет проставлен только за один казус.</li>
                                        <li>Для каждого студента определено время окончания и время продолжительности экзамена. При нарушении одного из этих фиксированных сроков письменная работа <span className="mark-text">НЕ БУДЕТ СОХРАНЕНА.</span></li>
                                        <li>Необходимо сохранять ответы в процессе работы над казусом.</li>
                                        <li>Необходимо проверить сохранность письменной работы после завершения экзамена.</li>
                                        <li>Форма обращения к наблюдателю с вопросом о технической неисправности, возникшей во время экзамена, и его письменного оформления - обращение оформляется во время экзамена непосредственно в аудитории, где проводится экзамен.</li>
                                        <li>Необходимо из своей личной страницы после окончания экзамена.</li>
                                    </ul>
                                    После окончания экзамена, обращения о технических сбоях во время экзамена, в том числе несохранение работы, ошибочная запись всех ответов в один ответ и любые другие обращения не рассматриваются.
                                </div>
                            </>
                    }
                    <div>
                        <hr />
                        <div className="d-flex justify-content-between user-select-none">
                            <Checkbox checked={isConfirmed} onChange={() => setIsConfirmed(!isConfirmed)} ><span>{t("Men imtihon shartlari bilan tanishdim va roziman")}.</span></Checkbox>

                            <div>
                                <CButton colortype="red"
                                    onClick={() => {
                                        dispatch(EXAM_ACTIONS.agreementToggle({ isAgreement: null }));
                                        setIsConfirmed(false);
                                    }}>Bekor qilish</CButton>
                                <CButton disabled={!isConfirmed} className="ms-2" onClick={toExamLogin}>Roziman</CButton>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}


export default ExamAgreement;