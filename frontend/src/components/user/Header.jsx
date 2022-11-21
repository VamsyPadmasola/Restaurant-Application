// import { useNavigate } from "react-router-dom";
import Cart from "../Cart/index";
// import SearchBox from "../UI/Search";
// import Books from "../../../assets/icons/book_white.png";

export default function Header() {
    return (
        <header className="header-main">
            <div className='nav-brand'>
                {/* <img className='logo-img' src={ } /> */}
                <span className='spn-logo'>The Eatery</span>
            </div>
            <div className="searchBox-container">
                {/* <SearchBox /> */}
            </div>
            <div>
                <button>
                    Reserve Table
                </button>
            </div>
            <div className="cart-container">
                <Cart />
            </div>
        </header>
    )
}
