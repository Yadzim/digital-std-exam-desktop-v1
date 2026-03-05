import React from 'react';
import { Button, Result } from "antd";
import { useHistory } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import { useAppSelector } from "store/services";





const ExamErrorPage = ({ getStudentanswerForChecking }: { getStudentanswerForChecking: () => void }) => {

    const history = useHistory();
    const { has_answer } = useAppSelector(state => state.exam.exam_errors);

    return (
        <div>
            <Card>
                <CardBody>
                    <Result
                        status="error"
                        title="Imtihon ma'lumotlarini olishda xatolik."
                        subTitle={
                            has_answer ?
                                "Topshirilgan imtihon ma'lumotlarini olishda xatolik!" : "Ma'lumot olishda xatolik"
                        }
                        extra={[
                            <Button type="dashed" onClick={() => history.push("/")}>Bosh sahifaga qaytish!</Button>,
                            <Button type="primary"  onClick={() =>getStudentanswerForChecking()}>Qaytadan urinib ko'rish</Button>,
                        ]}
                    ></Result>
                </CardBody>
            </Card>
        </div>
    )

}


export default ExamErrorPage;