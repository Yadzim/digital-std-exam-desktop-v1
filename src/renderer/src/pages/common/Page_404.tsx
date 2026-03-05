import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import './style.scss';

const NotFoundPage: React.FC = (): JSX.Element => {

    const history = useHistory();


    return (
        <>
            <div className="not_found_page">
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary" onClick={() => history.goBack()}>Back Home</Button>}
                />
            </div>
        </>
    )
}

export default NotFoundPage;