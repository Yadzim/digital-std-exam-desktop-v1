export type RoutesTypeSubmenu = {
    name: string,
    path: string,
    component: any,
    config: {
        key: string,
        icon: any,
        structure: 'layout' | 'nonlayout' | 'student_layout',
        exact?: boolean,
        isShowLink: boolean
    }
}

export type RoutesTypeChildren = {
    name: string,
    path: string,
    component: any,
    config: {
        key: string,
        icon: any,
        structure: 'layout' | 'nonlayout' | 'student_layout',
        exact?: boolean,
        isShowLink: boolean
    }
    submenu: Array<RoutesTypeSubmenu>
}

export type RoutesType = {
    title: string,
    children: Array<RoutesTypeChildren>

}
