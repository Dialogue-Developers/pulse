import React, {useState} from "react";
import './UserInput.css'

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
        <div className="wrapper_bottom clearfix">
            <div className="message_input_wrapper">
                <input className="message_input" value={inputText} onChange={handleChange}
                       placeholder="Type your message here..." onKeyPress={handleKeyPress}/>
            </div>
            <div className="send_message" onClick={handleSubmit}>
                <div className="icon"/>
                <div className="text">Send</div>
            </div>
        </div>
    )
}

export {UserInput}