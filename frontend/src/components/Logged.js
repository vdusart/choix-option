import Input from "./Input";
import Results from "./Results";
import InvalidEmail from "./InvalidEmail";

function Logged({ userState, tokenId }) {

	switch (userState) {
		case 0:
			return <InvalidEmail />
		case 1:
			return <Input tokenId={tokenId} />
		case 2:
			return <Results />
		default:
			return (
				<div className="container">
					<p>Loading...</p>
				</div>
			);
	}
}

export default Logged;