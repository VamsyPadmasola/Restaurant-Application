import React from "react";
import { BsFillSunFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../hooks";
import Cart from "../Cart";
import Container from "../Container";
import AppSearchForm from "../form/AppSearchForm";

export default function Navbar() {
	const { toggleTheme } = useTheme();
	const { authInfo, handleLogout } = useAuth();
	const { isLoggedIn } = authInfo;

	const navigate = useNavigate()

	const handleSearchSubmit = (query) => {
		navigate("/movie/search?title=" + query)
	}

	return (
		<div className="bg-secondary shadow-sm shadow-gray-500">
			<Container className="p-2">
				<div className="flex justify-between items-center">
					<Link to="/" className="flex items-center space-x-2">
						<img src="logo_white.png" alt="" className="sm:h-8 h-6" />
						<span className="text-white sm:text-lg text-sm">Restaurant Name</span>
					</Link>

					<ul className="flex items-center sm:space-x-4 space-x-2">
						{/* <li>
							<AppSearchForm
								placeholder="Search..."
								inputClassName="border-dark-subtle text-white focus:border-white
								sm:w-auto w-24 sm:h-10 h-8 "
								onSubmit={handleSearchSubmit}
							/>
						</li> */}
						<li>
							{isLoggedIn ? (
								<button
									onClick={handleLogout}
									className="text-white font-semibold  sm:text-lg text-sm"
								>
									Log out
								</button>
							) : (
								<Link
									className="text-white font-semibold sm:text-lg text-sm"
									to="/auth/signin"
								>
									Login
								</Link>
							)}
						</li>
						<li>
							<div className="cart-container">
								<Cart />
							</div>
						</li>
					</ul>
				</div>
			</Container>
		</div>
	);
}
