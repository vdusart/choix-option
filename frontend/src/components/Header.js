import Login from "./Login";
import Logout from "./Logout";


function Header({ currentUser, setCurrentUser }) {
	return (
		<nav className="navbar" role="navigation" aria-label="main navigation">
			<div className="navbar-start">
				<p className="navbar-item title ml-6">Choix Option</p>

				<a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>

			<div className="navbar-end mr-6">
				<div className="navbar-item">
					<div className="buttons">
						{(currentUser == null) ? <Login setCurrentUser={setCurrentUser} /> : <Logout setCurrentUser={setCurrentUser} />}
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Header;