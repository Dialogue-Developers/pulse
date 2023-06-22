import React, {useEffect, useState} from "react";
import './Chatbot.css';

import {Header} from "./Header";
import {UserInput} from "./UserInput";
import {MessageArea} from "./MessageArea";

import {io} from "socket.io-client";
const socket = io();

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});



function Chatbot() {
	/*
      Handle messages
     */

    const [selectedEngine, setSelectedEngine] = useState("pulse");

	const [messages, setMessages] = useState([
		{
			text: "Hello, I am Pulse, your personal AI health assistant. How can I help you today?",
			position: "left"
		},
	]);

	useEffect(() => {
		//if last message is a non-empty question, ask the server
		let lastMessage = messages[messages.length - 1];
		if (lastMessage.text !== "" && lastMessage.position === "right") {
			let request_message = {
				engine: selectedEngine,
				question: lastMessage.text,
			};
			socket.emit("message", request_message);
		}

		//handle server responses
		socket.on("answer", (data) => {
			setMessages([...messages, { text: data, position: "left" }]);
			document.querySelector("body").classList.remove("thinking");
		});
	}, [messages, selectedEngine]);

	function onSubmitMessage(inputText) {
		setMessages([...messages, { text: inputText, position: "right" }]);
		document.querySelector("body").classList.add("thinking");
	}

	/*
      Render HTML
    */
	return (
		<div className="window_chat">
			<Header onEngineChange={setSelectedEngine} />
			<MessageArea messages={messages} />
			<UserInput onSubmitMessage={onSubmitMessage} />
		</div>
	);
}

export default Chatbot;
