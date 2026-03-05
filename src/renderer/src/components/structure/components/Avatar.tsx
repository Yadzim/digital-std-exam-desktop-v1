import React, { FC } from "react";
import { StudentAvatarCardUi } from './styled';
import user_male from 'assets/images/user_male.svg';
import { SelectStudentTheme } from "config/theme/colors";
import { useAppSelector } from "store/services";
import { TypeInitialStateUser } from "store/user";
import { FILE_URL } from "config/utils";
import userimg from 'assets/images/user_male.svg'

const StudentAvatarCard: FC<{ isMobile: boolean }> = ({ isMobile }): JSX.Element => {


  const theme = SelectStudentTheme();
  const user_data: any = useAppSelector(state => state.auth);
  const user = useAppSelector(state => state.user) as TypeInitialStateUser;


  return (
    <StudentAvatarCardUi isMobile={isMobile} theme={theme}>
      <div className="image" >
        <img src={user.user?.profile?.image ? `${FILE_URL}/${user.user?.profile?.image}` : user_male} alt="Rasm topilmadi" />
      </div>
      {
        user_data.user.last_name ?
          <p>{user_data.user.last_name} {user_data.user.first_name}</p> :
          <div className="line"></div>
      }
    </StudentAvatarCardUi>
  )
}


export default StudentAvatarCard;