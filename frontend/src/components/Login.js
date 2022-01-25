import { GoogleLogin } from 'react-google-login';
import { clientId } from "./../private/firebase";

function Login() {
	const onSuccess = (res) => {
		console.log("[Login Success] currentUser: " + res.profileObj);
	}

	const onFailure = (err) => {
		console.log("[Login Failure] erreur: ", err);
	}
	return (
		<div>
			<GoogleLogin
				clientId={clientId}
				buttonText="Login"
				onSuccess={onSuccess}
				onFailure={onFailure}
				cookiePolicy={'single_host_origin'}
				style={{ marginTop: '100px' }}
				isSignedIn={true}
			/>
		</div>
	)
}

export default Login;