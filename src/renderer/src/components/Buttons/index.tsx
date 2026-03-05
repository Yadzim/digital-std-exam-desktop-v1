import React from 'react';
import { ButtonHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { IconBaseProps } from "react-icons/lib";
import "./styles.scss";
import { BiLoaderAlt } from 'react-icons/bi';


export const CButton = (props: ButtonHTMLAttributes<any> & { preicon?: any, posicon?: any, colortype?: 'red' | 'green', loading?: boolean }): JSX.Element => {

    const { t } = useTranslation();


    function getColor() {
        switch (props.colortype) {
            case 'red':
                return 'cb_red';
            case 'green':
                return 'cb_green';
            default:
                return ''
        }
    }

    return (
        <button {...props} disabled={props.disabled || props.loading} className={`custom_simple_button ${props.className} ${getColor()}`}>
            {props?.loading ? <BiLoaderAlt size={18} className='loader me-1' /> : props.preicon ?? null}
            {props.children ? (
                typeof props.children === 'string' ? t(props.children) : props.children
            ) : (
                t('Create')
            )}
            {props.posicon ?? null}
        </button>

    )
}