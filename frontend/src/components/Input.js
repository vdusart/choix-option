import { useState } from 'react';


function Input() {
	const subjectsGSI = ["ECE", "LV1", "Micro", "Archi Reseau", "Cyber", "DES PAT", "JEE", "Stats", "IA", "Tests verif"];
	const subjectsGMI = ["ECE", "LV1", "Micro", "ARCH RES", "DECIDABILITE", "METH AGIL", "PROG FONC", "DATAMINING", "EDP", "MOD LIN", "OPTIM"];
	const [subjects, changeSubjects] = useState(subjectsGSI);

	let changeOption = (event) => {
		if (event.target.value === "GMI") {
			changeSubjects(subjectsGMI);
		} else {
			changeSubjects(subjectsGSI);
		}
	}

	return (
		<div>
			<div className="columns is-mobile is-centered">
				<div className="column is-half">
					<form className="form-horizontal" >
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
								< div className="field" >
									<label className="label" for="textinput-1">{item}</label>
									<div className="control">
										<input id="textinput-1" name="textinput-1" type="text" placeholder="Note" className="input " />
									</div>
								</div>
							)}

						</fieldset>
					</form>
				</div>
			</div>
		</div >
	)
}

export default Input;