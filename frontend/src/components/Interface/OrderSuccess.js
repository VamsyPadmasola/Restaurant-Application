import Modal from "./Modal"
// import OrderSuccess from "images/order-confirm.png"

const OrderSuccessModal = ({onClose}) => {
    return(
        <Modal onClose={onClose}>
            <div className="order-container">
                <div className="order-container--success">
                    <img src ={"images/order-confirm.png"} className ="img-fluid"/>
                    <div>
                        <h1>Order Successfully Placed!</h1>
                        <span>OrderID #{Math.random().toString(32).slice(2)} </span>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
export default OrderSuccessModal;