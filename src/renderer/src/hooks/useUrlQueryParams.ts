import { elementClosest } from "@fullcalendar/react";
import React from "react";
import { useHistory } from "react-router-dom";



export interface IStateParams {
    filter: Record<string, number>,
    filter_like: Record<string, string>,
    item: Record<string, Record<string, number | string>>
    perPage: number,
    currentPage: number,
}

type TypeWriteToUrl = ({ name, value, items }: { name: string, value: number | string, items?: Array<Record<string | number, any>> }) => void;


const deserialize = ({ _perPage, _currentPage }: { _perPage: number, _currentPage: number }): IStateParams => {

    let queryParams: string = decodeURIComponent(window.location.search);

    let filter: IStateParams['filter'] = {};
    let filter_like: IStateParams['filter_like'] = {};
    let item: IStateParams['item'] = {};
    let perPage: IStateParams['perPage'] = _perPage;
    let currentPage: IStateParams['currentPage'] = _currentPage;

    if (queryParams.startsWith('?')) {

        queryParams = queryParams.substring(1);

    }

    const allQueryParams: string[] = queryParams.split('&');

    if (allQueryParams.length) {

        for (let index = 0; index < allQueryParams.length; index++) {

            const element: string = allQueryParams[index];

            let [key, value]: string[] = element.split('=');

            value = decodeURIComponent(value);

            if (key.endsWith('_id')) {

                if (value.includes('title=')) {

                    const [id, title] = value.split('+title=');

                    filter[key] = Number(id);

                    item[key] = { id: Number(id), name: title }

                } else {

                    filter[key] = Number(decodeURIComponent(value));

                }

            } else if (key === 'perPage') {

                perPage = Number(value);

            } else if (key === 'currentPage') {

                currentPage = Number(value);

            } else {

                if (key) {

                    filter_like[key] = decodeURIComponent(value);

                }

            }
        }
    }

    return { filter, filter_like, perPage, currentPage, item }

}

const serialize = (name: string, value: number | string) => {

    const queryParams = new URLSearchParams(window.location.search);

    queryParams.set(name, String(value));

    if (!value) {

        queryParams.delete(name);

    }

    return queryParams.toString();
}


const useUrlQueryParams = ({ perPage = 15, currentPage }: { perPage?: number, currentPage?: number | undefined }): { value: IStateParams, writeToUrl: TypeWriteToUrl } => {

    const history = useHistory<History>();

    const value: IStateParams = React.useMemo(() => deserialize({ _perPage: perPage, _currentPage: currentPage || 1 }), [(deserialize({ _perPage: perPage, _currentPage: currentPage || 1 }))]);

    const writeToUrl = React.useCallback(({ name, value, items }: { name: string, value: number | string, items?: Array<Record<string | number, any>> }) => {

        if (name.endsWith('_id')) {

            if (items && items.length) {
                const findElement = items.find(e => e.id === value);

                if (findElement && Object.getOwnPropertyNames(findElement).length) {

                    value = encodeURIComponent(`${value}+title=${items[0]['profile'] ? findElement?.profile?.last_name + " " + findElement?.profile?.first_name + " " + findElement?.profile?.middle_name : findElement?.name}`);

                }
            }
        }

        history.replace({

            search: serialize(name, value)

        })

    }, [])

    return { value, writeToUrl };

}


export default useUrlQueryParams;