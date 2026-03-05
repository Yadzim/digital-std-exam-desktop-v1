export type TypeGetData = {
    items: any[],
    _meta: {
        currentPage: number
        pageCount: number
        perPage: number
        totalCount: number
    },
    _links: {
        first: { href: string }
        last: { href: string }
        self: { href: string }
    }
}