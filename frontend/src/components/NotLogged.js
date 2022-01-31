

function NotLogged() {
	return (
		<div className="container">
			<div className="box">
				<p>Vous n'êtes pas connecté.</p>
				<p>Merci de vous connecter avec le boutton "Login" en haut à droite.</p>
				<p className="has-text-info is-italic">Le fait de vous connecter ne sert qu'à s'assurer de l'unicité de vos notes. Il est impossible de retrouver vos résultats en connaissant votre adresse mail.</p>
			</div>

		</div>
	)
}

export default NotLogged;