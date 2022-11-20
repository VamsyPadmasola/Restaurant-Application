import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Interface/Modal";
import OrderSuccessModal from "../Interface/OrderSuccess";
import CartItem from "./CartItem";
import { addItemhandler, removeItemhandler } from "../../actions";

const Cart = () => {
    const [showModal, setShowModal] = useState(false);
    const [orderModal, setOrderModal] = useState(false);

    const items = useSelector(state => state.cart.items)
    const dispatch = useDispatch()

    const totalAmount = useSelector(state => state.cart.totalAmount)

    const handleModal = () => {
        setShowModal(previousState => !previousState)
    }

    const handleOrderModal = () => {
        setShowModal(false)
        dispatch({
            type: "CLEAR_CART"
        })
        setOrderModal(previous => !previous)
    }

    const dispatchEvents = (type, item) => {
        if (type == 1) {
            dispatch(addItemhandler(item))
        }
        else if (type == -1) {
            dispatch(removeItemhandler(item.id))
        }
    }

    return (
        <>
            <button onClick={handleModal}>
                <span data-items={items.length}>Cart</span>
                <img className="img-cart" src="add_cart.png" />
            </button>
            {
                showModal &&
                <Modal onClose={handleModal}>
                    <div className="checkout-modal">
                        <h2>Checkout Modal</h2>
                        <div className="checkout-modal_list">
                            {
                                items.length > 0 ?
                                    items.map(item => {
                                        return (
                                            <CartItem
                                                data={item}
                                                onEmitIncreaseItem={item => dispatchEvents(1, item)}
                                                onEmitDecreaseItem={item => dispatchEvents(-1, item)}
                                                key={item.id}
                                            />
                                        )
                                    })
                                    :
                                    <div className="empty-cart">Please add something in cart</div>

                            }
                        </div>
                        {
                            items.length > 0 &&
                            <div className="checkout-modal_footer">
                                <div className="totalAmount">
                                    <h4>Total Amount: </h4>
                                    <h4>{totalAmount}
                                        <span style={{ marginLeft: "4px" }}>INR</span>
                                    </h4>

                                </div>
                                <button onClick={handleOrderModal}>Order Now</button>
                            </div>
                        }
                    </div>
                </Modal>
            }
            {
                orderModal && <OrderSuccessModal onClose={handleOrderModal} />
            }
        </>
    )
}
export default Cart;