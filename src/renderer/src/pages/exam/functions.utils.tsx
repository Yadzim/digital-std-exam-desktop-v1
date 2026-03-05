import React from 'react';
import { FILE_URL } from "config/utils";
import store from "store";
import { EXAM_ACTIONS } from "store/exam";




export function changeExamQuestion(exam_question_id: number) {

    localStorage.setItem("exam_question_id", String(exam_question_id));

    store.dispatch(EXAM_ACTIONS.selectExamQuestion({ exam_question_id }));

}



export function fileCheckFormat(file: string) {

    if (file.endsWith(".pdf")) {
        return (
            <iframe src={FILE_URL + file} width="100%" height={'800px'}></iframe>
        )
    } else if (file.endsWith(".docx") || file.endsWith('.doc' || file.endsWith('.ppt'))) {
        return (
            <div>File mavjud va format xatoligi sababli ochishning imkoni yo'q</div>
        )
    } else {
        return (
            <div className='question_img_box'>
                <img src={FILE_URL + file} alt="" />
            </div>
        )
    }
}


export function replaceFontSize(text: string, textSize: number) {

    text = text.replace(/(font-size:\s*)(\d+)(px)?/gi, function (match, p1, p2, p3) {
        // Extract the font size value and convert it to a number
        var fontSize = parseInt(p2, 10);

        // Increment the font size by the desired value
        var newFontSize = fontSize + textSize

        // Construct the updated font size declaration
        return p1 + newFontSize + (p3 || '');
    });

    return text;
}


