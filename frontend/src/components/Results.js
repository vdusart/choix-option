import { useState } from "react";


function Results() {
	const [uniqueId, setUniqueId] = useState(null);
	const [choices, setChoices] = useState([]);
	const [marks, setMarks] = useState([]);
	const [classement, setClassement] = useState("?/?");
	const [error, setError] = useState("");

	const changeUniqueId = (id) => {
		setUniqueId(id);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ uid: id })
		};
		fetch('http://localhost:8000/getInfosOf', requestOptions)
			.then(async response => {
				const data = await response.json();
				if (data.error !== undefined) {
					setUniqueId(null);
					setError(data.error);
				} else {
					setChoices(data.choices);
					setMarks(data.marks);
					setClassement(data.classement);
				}
			})
			.catch(error => {
				console.error('error:', error);
			});
	}

	return (
		<div className="container">
			{(uniqueId == null) ?
				<InputUniqueId changeUniqueId={changeUniqueId} error={error} />
				:
				<DisplayResult marks={marks} choices={choices} classement={classement} />
			}
		</div>
	)
}

function DisplayResult({ choices, marks, classement }) {
	return (
		<div className="container">

			<p>D'apres nos estimations, vous êtes classés <span className="has-text-weight-bold">{classement}</span> dans votre option favorite: <span className="has-text-weight-bold">{choices[0]}</span></p>

			<div className="box">
				<div className="columns">
					<div className="column">
						<p className="subtitle is-underlined">Vos Notes</p>
						{Object.entries(marks).map(([key, value]) =>
							< div className="field" key={key}>
								<p><span className="has-text-weight-bold">{key + " : "}</span>{value}</p>
							</div>
						)}
					</div>
					<div className="column">
						<p className="subtitle is-underlined">Vos Options</p>
						{choices.map((item, index) =>
							< div className="field" key={item}>
								<p>{(index + 1) + " - " + item}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

function InputUniqueId({ changeUniqueId, error }) {
	const [currentUniqueId, setCurrentUniqueId] = useState("");

	let changeInputField = (e) => {
		setCurrentUniqueId(e.target.value);
	}

	let submitId = () => {
		if (currentUniqueId !== "")
			changeUniqueId(currentUniqueId);
	}

	return (
		<div className="columns is-mobile is-centered mt-6">
			<div className="column is-half mt-6">
				<p className="title">Entrez votre id</p>
				<div className="columns mt-6 box has-background-light">
					<div className="column">
						<div className="control">
							<input className="input" type="text" placeholder="Votre id..." onChange={changeInputField} />
							<p className="help is-danger">{error}</p>
						</div>
					</div>

					<div className="column">
						<div className="control">
							<button className="button is-info" onClick={submitId}>Valider</button>
						</div>
					</div>
				</div>

			</div>
		</div>
	)
}


export default Results;