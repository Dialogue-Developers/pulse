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
<<<<<<< HEAD
        <div className="wrapper_bottom clearfix">
=======
        <div className="bottom_wrapper">
>>>>>>> db091a31e72e5bc580da1df5ff6ad8ae4e0e8df0
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