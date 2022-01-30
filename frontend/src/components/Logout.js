import { GoogleLogout } from 'react-google-login';
const CLIENT_ID = '245925352495-4vrm55t1879i1848vo53dohelebpoujs.apps.googleusercontent.com';


function Logout({ setCurrentUser }) {
	const onSuccess = () => {
		setCurrentUser(null);
	}

	return (
		<div>
			<GoogleLogout
				clientId={CLIENT_ID}
				buttonText="Logout"
				onLogoutSuccess={onSuccess}
			/>
		</div>
	)
}

export default Logout;