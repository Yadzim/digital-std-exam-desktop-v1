import { FC } from "react";
import { Button } from "antd";
import { FILE_URL } from "config/utils";
import { FiExternalLink } from "react-icons/fi";
import { FaDownload } from "react-icons/fa";


const OpenFileNewWindowButton: FC<{ url: string, tag?: boolean, download?: boolean }> = ({ url, tag, download }): JSX.Element => {

  const openFileNewWindow = (url: string) => {
    window.open(url, "", "height=700,width=800")
  }

  // return (
  //   <Button type={ tag ? "primary" : "link"} size="small" className="mb-2" onClick={() => openFileNewWindow(FILE_URL + url)} > <FiExternalLink />&nbsp;&nbsp;{url.split("/")[url.split("/").length-1]}</Button>
  // )

  return (
    <div className="d-f mb-2" style={{width: "max-content"}} >
     <Button type={ tag ? "primary" : "link"} size="small" onClick={() => openFileNewWindow(FILE_URL + url)} > <FiExternalLink size={12} />&nbsp;&nbsp;{url?.split("/")[url?.split("/")?.length - 1]}</Button>
     { download ? <a href={FILE_URL + url} download target="_blank" className="d-f justify-content-center ms-2 rounded-circle" style={{backgroundColor: "#BAE7FF", width: 24, height: 24}} ><FaDownload size={12} /></a> : null}
    </div>
  )
}

export default OpenFileNewWindowButton;