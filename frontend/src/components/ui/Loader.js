import ReactDom from "react-dom";

export const Backdrop = props => {
    const handleClick = () => {
        if (props.onClose) {
            props.onClose();
        }
    }
    return (
        <div onClick={handleClick} className="loader-overlay"></div>
    )
}

const Loader = () => {
    return (
        ReactDom.createPortal(
            <>
                <Backdrop />
                <div className="loader">
                </div>
            </>,
            document.getElementById("loader-root")
        )
    )
}
export default Loader;