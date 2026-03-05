import { useState, useEffect } from 'react';
import { message } from 'antd';
import instance from 'config/_axios';



type PropsTypeUseGetOneData = {
    isCall?: 'auto' | undefined,
    url?: string,
    params?: any,
    refetch?: any[],
}

export type ReturnTypeUseGetOneData<T = any> = {
    data: T,
    loading: boolean,
    fetch: (url: string) => void,
    setData: React.Dispatch<React.SetStateAction<T | Record<string | number, any>>>
}



const useGetOneData = (props: PropsTypeUseGetOneData): ReturnTypeUseGetOneData => {

    const { isCall, url, params, refetch = [] } = props;
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isCall === 'auto') {
            if (url) {
                fetch(url)
            } else {
                message.error("Url topilmadi !");
            }
        }
    }, [...refetch])

    const fetch = async (url: string) => {
        try {
            setLoading(true);
            const response = await instance({ url, method: 'GET', params: params ? params : {} });

            if (response.data?.status === 1 && Object.getOwnPropertyNames(response.data?.data).length) {
                setData(response.data?.data);
            } else {
                message.error(response.data?.message);
            }
            setLoading(false);
        } catch (error: any) {
            message.error(error?.response?.message);
            setLoading(false);
        }
    }


    return { data, loading, fetch, setData }

}

export default useGetOneData;