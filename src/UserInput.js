import React, { useState } from "react";
import './UserInput.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UserInput(props) {

    /*
    Handle input text
    */
    const [inputText, setInputText] = useState("");

    function handleChange(e) {
        setInputText(e.target.value)
    }
    function handleSubmit() {
        if (inputText === "") return;
        props.onSubmitMessage(inputText);
        setInputText("");
    }

    // On enter press
    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    return (
        <div className="wrapper_bottom">
            <div className="message_input_wrapper">
                <input className="message_input" value={inputText} onChange={handleChange}
                    placeholder="Type your message here..." onKeyPress={handleKeyPress} />
            </div>
            <div className="send_message" onClick={handleSubmit}>
                <div className="text">
                    <div className="send">
                        <span>Send</span>
                        <FontAwesomeIcon icon="paper-plane" />
                    </div>
                    <div className="sending">
                        <span>Thinking</span>
                        <FontAwesomeIcon icon="spinner" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { UserInput }