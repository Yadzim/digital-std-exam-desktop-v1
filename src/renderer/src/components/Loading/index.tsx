import React, { FC } from "react";
import "./styles.scss";






export const Loading: FC = (): JSX.Element => {


    return (
        <div className="login_loading">
            <div className="wrapper-parent">
                <div className="login_loading_text">
                    T &nbsp; S &nbsp; U &nbsp; L
                </div>
                <div className="colors-container">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    )

}