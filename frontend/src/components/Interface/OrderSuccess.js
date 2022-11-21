import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createorder, handlePayment, initPayment } from "../../api/order";
import { useAuth, useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import Selector from "../form/Selector";
import Modal from "./Modal"
// import OrderSuccess from "images/order-confirm.png"

const defaultLocationInfo = {
    street1: '',
    street2: '',
    city: '',
    state: '',
    contact: null,
}

const cityOptions = [
    { title: "Patna", value: "patna" },
]

const stateOptions = [
    { title: "Bihar", value: "bihar" },
]

const validateLocation = (location) => {
    const { street1, city, state, contact } = location;

    if (!street1.trim()) return { err: 'Street1 is missing!' }
    if (!city.trim()) return { err: 'City is missing!' }
    if (!state.trim()) return { err: 'State is missing!' }
    if (!contact) return { err: 'Contact is missing!' }
    if (contact.length < 10) return { err: 'Contact is invalid!' }

    return { err: null }
}

const OrderSuccessModal = ({ onClose, user }) => {
    const [locationInfo, setLocationInfo] = useState({ ...defaultLocationInfo })

    const handleChange = ({ target }) => {
        const { value, name } = target;
        setLocationInfo({ ...locationInfo, [name]: value })
    }
    const { updateNotification } = useNotification()

    const items = useSelector(state => state.cart.items)
    const totalAmount = useSelector(state => state.cart.totalAmount)

    const handlePlaceOrder = async () => {
        const { err } = validateLocation(locationInfo)
        if (err) return updateNotification('error', err)

        const { street1, street2, state, city, contact } = locationInfo
        const details = [...items.map(({ id, name, quantity }) => {
            return { itemId: id, itemName: name, quantity };
        })];

        const orderInfo = {
            street1,
            street2,
            city,
            state,
            contact,
            details,
            price: totalAmount,
            owner: user,
            status: "Confirmed"
        }

        await initPayment({ amount: totalAmount })
        // updateNotification('success', message)
        // const formData = new FormData()
        // for (let key in chefInfo) {
        //     if (key) formData.append(key, chefInfo[key])
        // }
        placeOrder(orderInfo)


        // handlePlaceOrder(order)

        // window.location.reload(false)
    }

    const placeOrder = async (orderInfo) => {
        const { order } = await createorder(orderInfo)
        updateNotification('success', 'Order Placed successfully!')
    }


    const { street1, street2, city, state, contact } = locationInfo;

    return (
        <Modal onClose={onClose} title="Add Location">
            <div className="order-container">
                <div className="order-container--success p-5">
                    <div className='flex-grow flex flex-col space-y-8'>
                        <input placeholder='Enter Street 1'
                            name='street1' type='text'
                            className={commonInputClasses + ' border-b-2 '}
                            value={street1}
                            onChange={handleChange}
                            autoComplete="off"
                            spellCheck="false" />

                        <input placeholder='Enter Street 2'
                            name='street2' type='text'
                            className={commonInputClasses + ' border-b-2 '}
                            value={street2}
                            onChange={handleChange}
                            autoComplete="off"
                            spellCheck="false" />
                        <div className='flex items-center justify-between'>
                            <Selector options={cityOptions} label='City' onChange={handleChange}
                                name='city' value={city} />
                            <Selector options={stateOptions} label='State' onChange={handleChange}
                                name='state' value={state} />
                        </div>

                        <input placeholder='Enter Contact'
                            name='contact' type='Number'
                            className={commonInputClasses + ' border-b-2 '}
                            value={contact}
                            onChange={handleChange}
                            autoComplete="off"
                            spellCheck="false" />
                    </div>
                </div>
                <div className="flex items-end justify-end mr-5 mb-3">
                    <button className="bg-success p-2 text-white w-32"
                        onClick={handlePlaceOrder}>
                        Order now
                    </button>
                </div>
            </div>
        </Modal>
    )
}
export default OrderSuccessModal;