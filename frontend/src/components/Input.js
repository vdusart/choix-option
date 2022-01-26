import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


function Input({ tokenId }) {
	const possibleChoicesGSI = ['choice1', 'choice2', 'choice3', 'choice4', 'choice5']

	const subjectsGSI = ["ECE", "LV1", "Micro", "Archi Reseau", "Cyber", "DES PAT", "JEE", "Stats", "IA", "Tests verif"];
	const subjectsGMI = ["ECE", "LV1", "Micro", "ARCH RES", "DECIDABILITE", "METH AGIL", "PROG FONC", "DATAMINING", "EDP", "MOD LIN", "OPTIM"];
	const [subjects, changeSubjects] = useState(subjectsGSI);
	const [fields, setFields] = useState({});
	const [uniqueId, setUniqueId] = useState("");
	const [choices, updateChoices] = useState(possibleChoicesGSI);

	let option = "GSI";

	function handleOnDragEnd(result) {
		if (!result.destination) return;

		const items = Array.from(choices);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		updateChoices(items);
	}

	let changeOption = (event) => {
		option = event.target.value;
		if (option === "GMI") {
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
		const data = {
			"option": option,
			"marks": fields,
			choices: []
		}
		console.log(data);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tokenId: tokenId, data: data })
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


							<DragDropContext onDragEnd={handleOnDragEnd}>
								<Droppable droppableId="characters">
									{(provided) => (
										<ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
											{choices.map((choice, index) => {
												return (
													<Draggable key={choice} draggableId={choice} index={index}>
														{(provided) => (
															<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
																<p>
																	{(index + 1) + "-" + choice}
																</p>
															</li>
														)}
													</Draggable>
												);
											})}
											{provided.placeholder}
										</ul>
									)}
								</Droppable>
							</DragDropContext>


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