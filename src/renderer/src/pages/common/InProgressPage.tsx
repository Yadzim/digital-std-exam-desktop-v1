import { Result, Button } from 'antd';
import { NavLink } from 'react-router-dom';
import "./style.scss";



const InProgressPage: React.FC = (): JSX.Element => {


    return (
        <div className="under_constuction_page">
            <Result
                status="500"
                title="Project in process"
                subTitle="Sorry, something went wrong."
                extra={<NavLink to="/"><Button type="primary">Back Home</Button></NavLink>}
            />
        </div>
    )

}


export default InProgressPage;