import React, { useState } from "react";
import './UserInput.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Add the icon to the library
library.add(faPaperPlane);

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
        <div className="bottom_wrapper">
            <div className="message_input_wrapper">
                <input className="message_input" value={inputText} onChange={handleChange}
                    placeholder="Type your message here..." onKeyPress={handleKeyPress} />
            </div>
            <div className="send_message" onClick={handleSubmit}>
                <div className="icon" />
                <div className="text">
                    <span>Send</span>
                    <FontAwesomeIcon icon="paper-plane" />
                </div>
            </div>
        </div>
    )
}

export { UserInput }