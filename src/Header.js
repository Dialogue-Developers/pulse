import React from "react";
import "./Header.css";

function Header({ onEngineChange }) {
	const handleEngineChange = (event) => {
		const selectedEngine = event.target.value;
		onEngineChange(selectedEngine);
	};

	return (
<<<<<<< HEAD
		<div className="menu_top">
			<div className="buttons">
				<div className="button close" />
				<div className="button minimize" />
				<div className="button maximize" />
			</div>
=======
		<div className="top_menu">
>>>>>>> db091a31e72e5bc580da1df5ff6ad8ae4e0e8df0
			<div className="title">
                <img src='/images/pulse_logo_white.png' alt='Pulse Logo' className='pulse-logo' />
            </div>
			<select onChange={handleEngineChange} className="engine-select" title="Select an engine">
				<option value="pulse">Pulse</option>
				<option value="openai">OpenAI</option>
			</select>
		</div>
	);
}

export { Header };
