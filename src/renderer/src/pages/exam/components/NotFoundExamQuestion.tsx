import { Col, Row } from "antd";
import { FaExclamationTriangle } from "react-icons/fa";
import { Card, CardBody } from "reactstrap";







const NotFoundExamQuestion = () => {



    return (
        <div>
            <Card style={{ height: "80vh" }}>
                <CardBody>
                    <Row>
                        <Col xl={8} lg={8} md={8} sm={24} xs={24} className="text-center">
                            <FaExclamationTriangle size={60} color="#fc9903" />
                        </Col>
                        <Col xl={16}>
                            <div className="exam_error_page">
                                fsdhgsdfgh
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    )
}


export default NotFoundExamQuestion;