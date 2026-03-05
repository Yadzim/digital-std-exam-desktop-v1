import { sidebar_width_lg, sidebar_width_sm, sidebar_width_xs } from "config/utils/variable";
import styled , {css} from "styled-components";



export const BtnStyleHeader = styled.button<{ theme: any }>`
    border:none;
    border-radius:4px;
    /* border: 2px solid #EDF1FF; */
    width: 30px;
    height: 30px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size: 16px;
    margin:0  4px;
    background-color: ${p => p.theme.card};
    transition: all 0.1s;
    &:hover {
        background-color: ${p => p.theme.element};
        svg {
            color:#5A8DEE;
        }
    }

    svg {
        color:#5D48EC;
    }

    @media (min-width: 786px) and (max-width: 1320px) {
        border-radius:4px;
        width: 32px;
        height: 32px;
        font-size: 14px;
        margin: 0 6px;
    }


    @media (min-width: 576px) and (max-width: 786px) {
        border-radius:4px;
        width: 28px;
        height: 28px;
        font-size: 14px;
        margin: 0 3px;
    }
`



export const Std_header_logo = styled.div<{ theme: any }>`


// background-color:${props => props.theme.element};

width: ${sidebar_width_lg};
height: 30px;
padding: 0px 10px;
border-radius: 6px;
display:flex;
align-items:center;
justify-content:space-between;

& > button {
    background-color: transparent;
    padding: 4px 4px;
    border-radius:4px;
    border:none;
    color: ${props => props.theme.blue};
    // color:${props => props.theme.icon};

    &:hover {
        color: ${props => props.theme.blue};
    }
}
& > span {
    padding: 4px 6px;
    border-radius:4px;
    text-align:center;
    color: ${props => props.theme.blue};
    font-weight:bold;

    & > span {
        border-left: 1px solid ${props => props.theme.text};
        font-weight:400;
        padding-left: 2px;
        margin-left:2px;
    }
}

@media (max-width:1500px){
    width: ${sidebar_width_sm};
}

@media (min-width: 786px) and (max-width: 1320px) {
    width: 200px;
    height: 32px;
    padding: 0px 6px;
    border-radius: 4px;

    & > button {
        padding: 4px 4px;
        border-radius:4px;
        font-size: 15px;
    }
    & > span {
        font-size: 15px;

        & > span {
            margin-left:2px;
        }
    }
}
@media (min-width: 576px) and (max-width: 786px) {
    width: ${sidebar_width_xs};
    height: 28px;
    padding: 0px 4px;
    border-radius: 4px;

    & > button {
        padding: 4px 4px;
        border-radius:4px;
        font-size: 13px;
    }
    & > span {
        font-size: 13px;

        & > span {
            display:none;
        }
    }
}


`

export const StudentHeaderUi = styled.div<{ theme: any }>`
  background-color: ${p => p.theme.name === 'black' ? p.theme.card : 'white'};
  position: fixed;
  padding: 1rem 0.5rem;
  width: 100%;
  height: auto;
  box-shadow: ${ props => props.theme.name === "white" ? "0px 10px 30px rgba(209, 213, 223, 0.5)" : "rgba(0, 0, 0, 0.4) 0px 1px 10px"};
  // -webkit-box-shadow: 0px 10px 30px rgb(209 213 223 / 50%);
  z-index: 20;

  .std_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
  }
`;



export const StudentContentWrapper = styled.div<{
  isMobile: boolean;
  theme: any;
  ui: any;
  sidebar: string
}>`
  /* position: relative; */
  overflow: hidden;
  /* margin-left: ${p=> p.sidebar === 'lg' ? 260 : 0}px; */

  ${(props) =>
    props.isMobile
    ? css`
          background-color: ${props.theme.card};
          min-height: calc(100vh - 60px);
          /* margin: 1rem auto; */
          /* padding: 0.5rem 1rem;
          padding-top: 1rem; */
          color: ${props.theme.text};
          position: relative;
          width: 100%;
          `
      : css`
          background-color: ${props.theme.card};
          /* width: calc(100% - ${props.sidebar === 'lg' ? 260 : 0}px); */
          min-height: calc(100vh - 60px);
          padding: 0.7rem 0.6rem;
          color: ${props.theme.text};
          transition: all 0.1s ease-in-out;
        `}
`;


export const StdContent = styled.div<{ theme: any, sidebar: string }>`
  background-color: ${(p) => p.theme.card};
  width: 100%;
  min-height: calc(100vh - 60px);
  background-color: white;
  margin-top: 60px;
  transition: all 0.1s;
  position: relative;
`;


export const StudentAvatarCardUi = styled.div<{ isMobile: boolean, theme: any }>`

    display: flex;
    align-items: center;
    flex-direction: column;
    min-height: 180px;
    /* padding: 1rem; */
    padding-top: 0;
    position: relative;
    .img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background-color: ${(p) => p.theme.element};
      margin-bottom: 0.75rem;
    }
    .line {
      width: 100%;
      height: 1rem;
      border-radius: 0.25rem;
      background-color: ${(p) => p.theme.element};
      margin: 0.5rem 0;
      &:nth-child(3) {
        width: 70%;
      }
    }
    ${props => props.isMobile ?
        css`
        width: 90%;
        margin: 10px auto 0;
        .image {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin: 0 auto 0.5rem;
            border: 6px solid ${props.theme.element};
            & > img {
                width:100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        & > p {
            color:${props.theme.text};
            text-align:center;
            font-size: 15px;
            font-weight: 450;
            margin: 0.5rem 0 0;
            padding: 0;
        }
        `:
        css`
        width:100%;
        position:relative;
        padding-bottom: 0;
        .image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin: 0 auto 0.5rem;
            border: 6px solid ${props.theme.element};
            user-select: none;

            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            & > img {
                width:100%;
                /* height: 100%; */
                /* border-radius: 50%; */
                user-select: none;
            }
        }
        & > p {
            color:${props.theme.text};
            text-align:center;
            font-size: 13px;
            font-weight: 450;
            /* padding: 0; */
            /* margin: 0.5rem 0 0; */
            width: 100%;
            margin-top:4px;
            /* &:first-child{
                margin-top: 1rem;
            } */
        }
        @media (max-width:1500px){
            border-radius:0px !important;
            margin-top: 0px !important;
            height: 110px;
            padding: 8px;
            border-top:1px solid ${props.theme.element};
            & > div {
                width: 70px;
                height: 70px;
                border: 4px solid ${props.theme.element};
            }
            & > p {
                text-align:center;
                font-size: 14px;
                font-weight: 400;
                margin-top:4px;
            }
            }
        `
    }
    `