import React from 'react';
import { FILE_URL } from "config/utils";
import { IStudent } from "models/user";
import "../styles.scss"
import userimg from 'assets/images/user_male.svg'
import { Image } from 'antd';



const HomeProfile = ({ user }: { user: IStudent | null }) => {



    return (
        <div className="home-profile h-100" style={{ backgroundColor: "#EDF0F2", borderRadius: "16px" }} >
            <div className="w-100 home-profile-card">
                <div className='d-flex justify-content-center'>
                    <div style={{ width: 220, height: 220 }}>
                        <Image className='rounded-1' style={{ border: '6px solid #EDF0F2' }} height={220} src={user?.profile?.image ? (FILE_URL + user?.profile?.image) : userimg} />
                    </div>
                </div>
                <div>
                    <div className="c-name">{user?.profile?.last_name} {user?.profile?.first_name} {user?.profile?.middle_name}</div>
                    <hr />
                    <div className="c-info">{user?.faculty?.name}&nbsp;&nbsp;&nbsp;{user?.course?.name} - kurs</div>
                </div>
            </div>
        </div>
    )
}


export default HomeProfile;