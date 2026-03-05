import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { message } from 'antd';
import instance from 'config/_axios';
import { TypeGetData } from 'utils/types';
import { useTranslation } from 'react-i18next';

type TypePropsUseGetAllData = {
    url: string,
    perPage?: number | undefined,
    currentPage?: number | undefined,
    isCall?: 'auto' | undefined,
    debouncedValue?: any[] | undefined,
    refetch?: any[],
    initialData?: any[],
    params?: any
}

export type TypeReturnUseGetAllData<T> = {
    data: TypeGetData,
    loading: boolean,
    fetch: () => void,
    default_data: TypeGetData,
    setData: Dispatch<SetStateAction<TypeGetData>>,
    items: T[],
    setState: (arg: Array<any> | Record<string | number, any>) => void
}

const default_data = {
    items: [],
    _meta: {
        currentPage: 0,
        pageCount: 0,
        perPage: 0,
        totalCount: 0
    },
    _links: {
        first: { href: '' },
        last: { href: '' },
        self: { href: '' }
    }
}

const useGetAllData = (props: TypePropsUseGetAllData): TypeReturnUseGetAllData<any> => {

    const { url, perPage, currentPage, isCall, debouncedValue = [], refetch = [], initialData, params } = props;

    const { i18n } = useTranslation();

    const [data, setData] = useState<TypeGetData>(default_data);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isCall === 'auto') {
            fetch();
        }
    }, [i18n.language, perPage, currentPage, ...debouncedValue, ...refetch])

    const fetch = async () => {
        try {
            setLoading(true);
            const response = await instance({ url, method: "GET", params: { "per-page": perPage, page: currentPage, ...params } });

            if (response.data?.status === 1) {
                setData(response.data?.data);
            } else {
                message.error(response.data?.message);
            }
            setLoading(false);
        } catch (error: any) {
            message.error(error?.response?.message);
        } finally {
            setLoading(false);
        }
    }

    /**
     * @pramas This function accepts params as a object or array and changes only current items in state. 
     */
    const setState = React.useCallback((arg: Array<any> | Record<string | number, any>) => {
        if (Array.isArray(arg)) {
            setData((prevState) => ({ ...prevState, items: arg }))
        } else {
            setData((prevState) => ({ ...prevState, items: [arg] }))
        }
    }, [data.items])

    return { data, loading, fetch, default_data, setData, items: data.items, setState }

}

export default useGetAllData;