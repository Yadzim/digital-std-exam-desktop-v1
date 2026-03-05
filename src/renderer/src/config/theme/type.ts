

export type ThemeType = {
    name: string
    sidebar: {
        sidebarBackgroundColor?: string,
        title: string,
        link: {
            bg: string,
            line: string,
            icon: string,
            text: string
            hover: {
                bg: string,
                text: string,
                icon: string
            },
            active: {
                bg: string,
                text: string,
                icon: string
            }
        },
        submenu: {
            bg: string,
            link: {
                bg: string,
                text: string,
                icon: string
            },
            hover: {
                bg: string,
                text: string,
                icon: string
            },
            active: {
                bg: string,
                text: string,
                icon: string
            }
        },
    },
    header?: {
        bg: string,
        element_bg: string,
        text: string,
        icon: string,
        ripple_hover: string,
        input_bg: string,
        hover_bg: string
    },
    content?: {

    }
}
