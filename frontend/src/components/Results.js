import { useState } from "react";


function Results() {
	const [uniqueId, setUniqueId] = useState(null);
	const [choices, setChoices] = useState([]);
	const [marks, setMarks] = useState([]);
	const [classement, setClassement] = useState("?/?");
	const [possibleChoice, setPossibleChoice] = useState("");
	const [option, setOption] = useState("");
	const [totalStudents, setTotalStudents] = useState(0);
	const [studentsInOption, setStudentsInOption] = useState(0);
	const [error, setError] = useState("");

	const changeUniqueId = (id) => {
		setUniqueId(id);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ uid: id })
		};
		const backendUrl = process.env.NODE_ENV === "production"
			? "https://backend-dot-choix-options.ew.r.appspot.com"
			: "http://localhost:8000";
		fetch(`${backendUrl}/getInfosOf`, requestOptions)
			.then(async response => {
				const data = await response.json();
				if (data.error !== undefined) {
					setUniqueId(null);
					setError(data.error);
				} else {
					setOption(data.option);
					setChoices(data.choices);
					setMarks(data.marks);
					setClassement(data.classement);
					setPossibleChoice(data.possibleChoice);
					setTotalStudents(data.totalStudents);
					setStudentsInOption(data.studentsInOption);
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
				<DisplayResult
					option={option} marks={marks}
					classement={classement}
					choices={choices} possibleChoice={possibleChoice}
					studentsInOption={studentsInOption} totalStudents={totalStudents} />
			}
		</div>
	)
}

function DisplayResult({ option, choices, marks, classement, possibleChoice, totalStudents, studentsInOption }) {
	const choicePosition = choices.findIndex(choice => choice === possibleChoice) + 1;
	return (
		<div className="container">

			<div className="box has-background-success">
				<p>D'apr??s nos estimations, vous ??tes class??s <span className="has-text-weight-bold">{classement}</span> dans votre option {choicePosition}: <span className="has-text-weight-bold">{possibleChoice}</span></p>
			</div>

			<div className="box">
				<h1 className="title">Vos Infos</h1>
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
			<div className="box has-background-info">
				<p className="has-text-white">Pour le moment, nous avons r??cup??r?? les donn??es de <span className="has-text-weight-bold">{totalStudents}</span> ??tudiants dont <span className="has-text-weight-bold">{studentsInOption + " " + option}</span> .</p>
				<p className="is-italic has-text-white">Plus un grand nombre de personnes entrent leurs notes, plus les r??sultats seront fiables.</p>
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