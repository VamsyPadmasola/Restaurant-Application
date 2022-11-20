import ReactDom from "react-dom"
import { commonModalTitleClasses } from "../../utils/theme";


export const Backdrop = props => {
    const handleClick = () => {
        if (props.onClose) {
            props.onClose();
        }
    }
    return (
        <div onClick={handleClick} className="modal-overlay"></div>
    )
}

const Modal = ({ onClose, children, style, title = '' }) => {
    return (
        <>
            {
                ReactDom.createPortal(
                    <>
                        <Backdrop onClose={onClose} />
                        <div className={"modal dark:bg-primary rounded bg-white " + style}>
                            <div className="w-full h-14 bg-secondary p-3 rounded flex justify-between">
                                <div className="w-full text-center">
                                    <span className={commonModalTitleClasses}>{title}</span>
                                </div>
                                <div className="float-right">
                                    <button type="close" className="dark:text-white text-primary text-xl" onClick={onClose}>X</button>
                                </div>
                            </div>
                            <div className="modal-content custom-scroll-bar overflow-auto ">{children}</div>
                        </div>
                    </>,
                    document.getElementById("modal-root")
                )
            }
        </>
    )
}
export default Modal;