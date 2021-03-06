import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


function Input({ tokenId }) {
	const possibleChoicesGSI = ["BI", "Visual", "INEM", "Cyber", "ICC", "IA Pau", "IA Cergy", "HPDA"];
	const possibleChoicesGMI = ["BI", "IA Pau", "IA Cergy", "HPDA", "DS", "Fintech"];
	const subjectsGSI = ["ECE", "LV1", "MICRO", "ARCH RES", "CYBER", "DES PAT", "JEE", "TESTS VERIF", "STATS", "IA"];
	const subjectsGMI = ["ECE", "LV1", "MICRO", "GEST FI", "ARCH RES", "DECIDABILITE", "METH AGIL", "PROG FONC", "DATAMINING", "EDP", "MOD LIN", "OPTIM"];

	const [subjects, changeSubjects] = useState(subjectsGSI);
	const [fields, setFields] = useState({});
	const [uniqueId, setUniqueId] = useState("");
	const [choices, updateChoices] = useState(possibleChoicesGSI);
	const [option, setOption] = useState("GSI");

	function handleOnDragEnd(result) {
		if (!result.destination) return;

		const items = Array.from(choices);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		updateChoices(items);
	}

	let changeOption = (event) => {
		const option = event.target.value;
		setOption(option);
		if (option === "GMI") {
			changeSubjects(subjectsGMI);
			updateChoices(possibleChoicesGMI);
		} else {
			changeSubjects(subjectsGSI);
			updateChoices(possibleChoicesGSI);
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
		setUniqueId("Loading...");
		console.log(option)
		const data = {
			"option": option,
			"marks": fields,
			choices: choices
		}
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tokenId: tokenId, data: data })
		};
		const backendUrl = process.env.NODE_ENV === "production"
			? "https://backend-dot-choix-options.ew.r.appspot.com"
			: "http://localhost:8000";
		fetch(`${backendUrl}/sendData`, requestOptions)
			.then(async response => {
				const data = await response.json();
				setUniqueId(data.result);
			})
			.catch(error => {
				console.error('error:', error);
			});
	}

	function refreshPage() {
		window.location.reload(false);
	}


	return (
		<div className="container">
			<div className="columns is-mobile is-centered">
				<div className="column is-half">
					{(uniqueId === "") ?
						<div className="form-horizontal">

							<div className="field">
								<label className="label">Quelle est votre option ?</label>
								<div className="control">
									<div className="select">
										<select id="option-choice" className="" onChange={changeOption}>
											<option>GSI</option>
											<option>GMI</option>
										</select>
									</div>
								</div>
							</div>

							<p className="has-text-centered title has-text-danger">Triez vos options par preferences</p>
							<DragDropContext onDragEnd={handleOnDragEnd}>
								<Droppable droppableId="characters">
									{(provided) => (
										<ul className="box has-background-grey" {...provided.droppableProps} ref={provided.innerRef}>
											{choices.map((choice, index) => {
												return (
													<Draggable key={choice} draggableId={choice} index={index}>
														{(provided) => (
															<li className="box" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
																<p>
																	{(index + 1) + " - " + choice}
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

							<p className="has-text-centered title has-text-danger">Vous devez entrez vos notes d'avant rattrapages!</p>

							{subjects.map((item) =>
								< div className="field" key={item}>
									<label className="label">{item}</label>
									<div className="control">
										<input name={item} type="text" placeholder="Note" className="input" value={fields[item] || ""} onChange={changeField} />
									</div>
								</div>
							)}
							<div className="box has-background-danger">
								<p>Attention, une fois vos notes entr??es vous ne pourrez plus les modifier.</p>
								<p>Comme elles sont sauvegard??es de mani??re completement anonyme, nous ne pourrons pas le faire pour vous.</p>
							</div>

							<div className="field is-grouped">
								<div className="control">
									<button className="button is-link" onClick={submitForm}>Submit</button>
								</div>
								<div className="control">
									<button className="button is-link is-light">Cancel</button>
								</div>
							</div>
						</div>
						:
						<div>
							<div className="box has-background-success mb-6">
								<p>Votre unique id est : <span className="has-text-weight-bold">{uniqueId}</span></p>
							</div>
							<div className="box has-background-warning">
								<p>Ne cliquez pas sur le bouton tant que vous n'avez pas sauvegard?? cet identifiant!</p>
								<p className="has-text-weight-bold">Il ne pourra pas vous ??tre redonn??!</p>
								<button className="button is-link is-light" onClick={refreshPage}>Acceder ?? mes infos</button>
							</div>
						</div>
					}
				</div >
			</div >
		</div >
	)
}

export default Input;