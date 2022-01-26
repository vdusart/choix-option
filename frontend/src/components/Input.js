import { useState } from 'react';


function Input({ tokenId }) {
	const subjectsGSI = ["ECE", "LV1", "Micro", "Archi Reseau", "Cyber", "DES PAT", "JEE", "Stats", "IA", "Tests verif"];
	const subjectsGMI = ["ECE", "LV1", "Micro", "ARCH RES", "DECIDABILITE", "METH AGIL", "PROG FONC", "DATAMINING", "EDP", "MOD LIN", "OPTIM"];
	const [subjects, changeSubjects] = useState(subjectsGSI);
	const [fields, setFields] = useState({});
	const [uniqueId, setUniqueId] = useState("");

	let changeOption = (event) => {
		if (event.target.value === "GMI") {
			changeSubjects(subjectsGMI);
		} else {
			changeSubjects(subjectsGSI);
		}
	}

	let changeField = (e) => {
		const { name, value } = e.target;
		setFields(prevState => ({
			...prevState,
			[name]: value
		}));
	}

	let submitForm = () => {
		console.log(fields);
		setUniqueId("Loading...");
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tokenId: tokenId, data: fields })
		};
		fetch('http://localhost:8000/sendData', requestOptions)
			.then(async response => {
				const data = await response.json();
				setUniqueId(data.result);
			})
			.catch(error => {
				console.error('error:', error);
			});
	}


	return (
		<div className="container">
			<div className="columns is-mobile is-centered">
				<div className="column is-half">
					{(uniqueId === "") ?
						<div className="form-horizontal">
							<p className="has-text-centered title has-text-danger">Vous devez entrez vos notes d'avant rattrapages!</p>
							<fieldset>
								<div className="field">
									<label className="label" for="option-choice">Quelle est votre option ?</label>
									<div className="control">
										<div className="select">
											<select id="option-choice" name="option-choice" className="" onChange={changeOption}>
												<option>GSI</option>
												<option>GMI</option>
											</select>
										</div>
									</div>
								</div>

								{subjects.map((item) =>
									< div className="field">
										<label className="label">{item}</label>
										<div className="control">
											<input name={item} type="text" placeholder="Note" className="input" value={fields[item] || ""} onChange={changeField} />
										</div>
									</div>
								)}

								<p>Attention, une fois vos notes entrées vous ne pourrez plus les modifier.</p>
								<p>Comme elles sont sauvegardées de manière completement anonnyme, nous ne pourrons pas le faire pour vous.</p>

								<div class="field is-grouped">
									<div class="control">
										<button class="button is-link" onClick={submitForm}>Submit</button>
									</div>
									<div class="control">
										<button class="button is-link is-light">Cancel</button>
									</div>
								</div>
							</fieldset>
						</div>
						:
						<div>
							<p>Votre unique id est : {uniqueId}</p>
						</div>
					}
				</div >
			</div >
		</div >
	)
}

export default Input;