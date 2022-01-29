

function NotLogged() {
	return (
		<div className="container">
			<div className="box">
				<p>Vous n'êtes pas connecté.</p>
				<p>Merci de vous connecter avec le boutton "Login" en haut à droite.</p>
				<p className="has-text-info is-italic">La connexion ne permet pas de vous relier à vos notes mais sert à ne pas pouvoir saisir plusieurs fois ses notes.</p>
			</div>

		</div>
	)
}

export default NotLogged;