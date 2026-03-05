import React from 'react';
import { Menu, Dropdown } from 'antd';
import UzbImage from "assets/images/uzb-flag.png"
import RusImage from "assets/images/rus-flag.jpg"
import EngImage from "assets/images/en-flag.jpg"
import { FC, useState } from "react";
import i18n from 'config/i18n';
import { SelectStudentTheme } from 'config/theme/colors';
import "./styles.scss";

const LanguageBtn: FC<any> = (props): JSX.Element => {
    const langs = [
        {
            id: 1,
            title: "Uzbek",
            key: "uz",
            img: UzbImage
        },
        {
            id: 3,
            title: "Ruscha",
            key: "ru",
            img: RusImage
        },
        {
            id: 2,
            title: "English",
            key: "en",
            img: EngImage
        },
    ]

    const localLang = localStorage.getItem("i18lang") ? langs.find(i => i.key === localStorage.getItem("i18lang")) : langs[0]
    const [selectedItem, setselectedItem] = useState(localLang)

    const theme = SelectStudentTheme();

    const changeLang = (event: any) => {
        localStorage.setItem("i18lang", event.key)
        setselectedItem(event)
        i18n.changeLanguage(event.key)
    }

    const menu = (
        <Menu>
            {
                langs.map((item) => (
                    <Menu.Item key={item.id} onClick={() => changeLang(item)} style={{ backgroundColor: theme.element, color: theme.text }}>
                        <img className="header_language_img" src={item?.img} alt="?" />&nbsp;<span>{item.title}</span>
                    </Menu.Item>
                ))
            }
        </Menu>
    );
    return (
        <Dropdown className='mx-1' overlay={menu} trigger={['click']} overlayStyle={{ backgroundColor: 'green' }}>
            <div className="header_language student_header_language" style={{ backgroundColor: theme.element, cursor: 'pointer' }}>
                <img className="header_language_img" src={selectedItem?.img} alt="?" />&nbsp;
                <span style={{ color: theme.blue }}>{selectedItem?.title}</span>
            </div>
        </Dropdown>
    )
}

export default LanguageBtn;