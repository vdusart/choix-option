import { GoogleLogin } from 'react-google-login';
const CLIENT_ID = '245925352495-4vrm55t1879i1848vo53dohelebpoujs.apps.googleusercontent.com';


function Login({ setCurrentUser }) {
	const onSuccess = (res) => {
		setCurrentUser(res);
	}

	const onFailure = (err) => {
		console.log("[Login Failure] erreur: ", err);
	}
	return (
		<div>
			<GoogleLogin
				clientId={CLIENT_ID}
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