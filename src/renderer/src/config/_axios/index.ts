import { message } from 'antd';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import _logout from './logout';
import { ResponseError } from './errors';

// require('dotenv').config();
// const base_url = process.env.


let instance = axios.create();

const onRequest = (config: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any> => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token && config.url !== '/auth/login') {
        message.error("You has not key to get data !")
        // _logout()
    }
    
    const url_lang = localStorage.getItem('i18lang') || 'uz';
    // config.baseURL = `http://10.1.5.7:8080/api/web/${url_lang}`;
    config.baseURL = `https://api-digital.tsul.uz/${url_lang}`;

    config.headers.set({
        'Authorization': "Bearer " + access_token,
        'api-token': "2k8UmgKs36Jb",
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    })
    // config.timeout = 5000
    return config;
}

const onRequestError = async (error: AxiosError): Promise<AxiosError> => {

    new ResponseError(error);
    return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    new ResponseError(error);
    return Promise.reject(error);
}

instance.interceptors.request.use(onRequest, onRequestError)
instance.interceptors.response.use(onResponse, onResponseError)



export default instance;
