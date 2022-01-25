import { GoogleLogout } from 'react-google-login';
import { clientId } from "../private/firebase";


function Logout({ setCurrentUser }) {
	const onSuccess = () => {
		setCurrentUser(null);
	}

	return (
		<div>
			<GoogleLogout
				clientId={clientId}
				buttonText="Logout"
				onLogoutSuccess={onSuccess}
			/>
		</div>
	)
}

export default Logout;