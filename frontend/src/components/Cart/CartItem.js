
import { useDispatch, useSelector } from "react-redux";

const CartItem = ({ data, onEmitDecreaseItem, onEmitIncreaseItem }) => {
    //const item = useSelector(state => state.cart.items.find(item => item.id === data.id))
    console.log(data.quantity)

    return (

        <div className="flex space-x-4 mb-4" >
            <div className="">
                <img className="w-24" src={data.image} />
            </div>
            <div className="information">
                <div>
                    <h4>{data.name}</h4>
                    <div className="pricing">
                        <span>{data.price}</span>
                    </div>
                </div>
                <div className="cart-addon cart-addon__modal">
                    <button onClick={() => onEmitDecreaseItem(data)}>-</button>
                    <span className="counter">{data.quantity}</span>
                    <button onClick={() => onEmitIncreaseItem(data)}>+</button>
                </div>
            </div>
        </div >
    )
}
export default CartItem;