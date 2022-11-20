import { Children } from "react";
import ReactDom from "react-dom"
import { Backdrop } from "./Loader"

const Modal = ({ onClose, children }) => {
    return (
        <>
            {
                ReactDom.createPortal(
                    <>
                        <Backdrop onClose={onClose} />
                        <div className="modal">
                            <button type="close" onClick={onClose}>X</button>
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