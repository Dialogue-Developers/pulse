import React from "react";
import "./Header.css";

function Header({ onEngineChange }) {
	const handleEngineChange = (event) => {
		const selectedEngine = event.target.value;
		onEngineChange(selectedEngine);
	};

	return (
		<div className="top_menu">
			<div className="buttons">
				<div className="button close" />
				<div className="button minimize" />
				<div className="button maximize" />
			</div>
			<div className="title">
                <img src='/images/pulse_logo_white.png' alt='Pulse Logo' className='pulse-logo' />
            </div>
			<select onChange={handleEngineChange} className="engine-select">
				<option value="pulse">Pulse</option>
				<option value="openai">OpenAI</option>
			</select>
		</div>
	);
}

export { Header };
