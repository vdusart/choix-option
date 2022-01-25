import { GoogleLogout } from 'react-google-login';
import { clientId } from "../private/firebase";


function Logout() {
	const onSuccess = () => {
		alert("[Logout Success]");
	}

	return (
		<div>
			<GoogleLogout
				clientId={clientId}
				buttonText="Logout"
				onSuccess={onSuccess}
			/>
		</div>
	)
}

export default Logout;