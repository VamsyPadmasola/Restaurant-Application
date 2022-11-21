import { Children } from "react";
import ReactDom from "react-dom"
import { Backdrop } from "./Loader"

const Modal = ({ onClose, children, title = '' }) => {
    return (
        <>
            {
                ReactDom.createPortal(
                    <>
                        <Backdrop onClose={onClose} />
                        <div className="modal">
                            <div className="bg-secondary p-2 h-12 text-white text-xl flex items-center justify-between ">
                                <span>{title}</span>
                                <button type="close" className="border-none text-xl" onClick={onClose}>X</button>
                            </div>
                            <div className="content">{children}</div>
                        </div>

                    </>,
                    document.getElementById("modal-root")
                )
            }
        </>
    )
}
export default Modal;