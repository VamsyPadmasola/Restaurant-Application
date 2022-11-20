import ReactDom from "react-dom"
import { Backdrop } from "./Loader"

const PopupMenu = ({ onClose, children, options }) =>{
    return(
        <>
            {
                ReactDom.createPortal(
                  <>
                  		<Backdrop onClose = {onClose}/>
                        <div className="absolute right-0 top-12 flex flex-col space-y-3 p-5 
                        dark:bg-secondary bg-white drop-shadow-lg rounded"style={{zIndex:1101}}>
						{options.map(({ title, onClick, id }) => {
                            return <Option key = {id} onClick={onClick}>{title}</Option>;
						})}
    					</div>      
      
                  </>,
					document.getElementById("menu-root")
                )
            }
        </>
    )
}

const Option = ({ children, onClick }) => {
	return (
	  <button
		onClick={onClick}
		className="dark:text-white text-secondary hover:opacity-80 transition"
	  >
		{children}
	  </button>
	);
};
  
export default PopupMenu;