import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Interface/Modal";
import OrderSuccessModal from "../Interface/OrderSuccess";
import CartItem from "./CartItem";
import { BsFillCartCheckFill } from 'react-icons/bs'
import { addItemhandler, removeItemhandler } from "../../actions";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [showModal, setShowModal] = useState(false);
    const [orderModal, setOrderModal] = useState(false);
    const [userId, setUserId] = useState("")

    const items = useSelector(state => state.cart.items)
    const dispatch = useDispatch()

    const totalAmount = useSelector(state => state.cart.totalAmount)

    const handleModal = () => {
        setShowModal(previousState => !previousState)
    }
    const { authInfo } = useAuth();
    const { isLoggedIn } = authInfo

    const navigate = useNavigate();

    const handleOrderModal = () => {
        console.log(isLoggedIn)
        setShowModal(false)

        if (!isLoggedIn) {
            return navigate("/auth/signin")
        }

        const { profile } = authInfo
        setUserId(profile.id)
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
                <BsFillCartCheckFill size={25} color="#ffffff" />
            </button>
            {
                showModal &&
                <Modal onClose={handleModal} title="Checkout">
                    <div className="checkout-modal">
                        <div className="checkout-modal_list p-4 max-h-96 overflow-auto">
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
                            <div className="checkout-modal_footer flex justify-between p-4">
                                <div className="totalAmount">
                                    <h4>Total Amount: </h4>
                                    <h4>{totalAmount}
                                        <span style={{ marginLeft: "4px" }}>INR</span>
                                    </h4>

                                </div>
                                <button className="bg-success w-24 text-white" onClick={handleOrderModal}>Next</button>
                            </div>
                        }
                    </div>
                </Modal>
            }
            {
                orderModal && <OrderSuccessModal onClose={handleOrderModal} user={userId} />
            }
        </>
    )
}
export default Cart;