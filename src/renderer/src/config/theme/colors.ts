import store from "store"

const BlackTheme = {
    name: 'black',
    bg: "#0E1621",
    card: "#141F2F",
    element: "#19273C",
    icon: "#6C7883",
    text: "#6C7883",
    // active_element: "#1F2936",
    // active_element: "#24354c",
    active_element: "#1e2f46",
    active_icon: "#5a8dee",  // 5EB5F7
    active_text: "#5a8dee",
    header_text: "#8C939D",
    blue: "#5a8dee",
}

const WhiteTheme = {
    name: 'white',
    bg: "#F8F7FA",
    // card: "#FFFFFF",
    card: "#F7F9FB",
    // element: "#F8F7FA",
    // element: "#e7edf5",
    element: "#f1f4f9",
    // element: "#e1ecf7",
    icon: "#717171",
    text: "#717171",
    // active_element: "#f5f5f5",
    active_element: "#e7edf5",
    // active_element: "#dee8f3",
    active_icon: "#5a8dee",
    active_text: "#5a8dee",
    // header_text: "#4b4d4b",
    // header_text: "#343a40",
    header_text: "#495057",
    blue: "#5a8dee",
}


export const SelectStudentTheme = () => {
    const color = store.getState().ui.studentTheme;
    if (color === "white") {
        return WhiteTheme;
    }
    return BlackTheme;
}