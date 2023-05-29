import { keywordSpotter } from "./keyword-spotter.js";
import { fallbackOptions } from "./fallback-options.js";
import { diagnoseSystem } from "./diagnose-system.js";

// To allow the use of require
import { createRequire } from "module";
// Load dataset
export async function loadDataset(path) {
	const require = createRequire(import.meta.url);

	const fs = require("fs");

	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(data));
			}
		});
	});
}

// Local storage contains the following:
// - do_next: The next action to perform
// - disease: The disease to provide information on
function clearLocalStorage(obj) {
	localStorage.removeItem(obj);
}

export async function pulseEngine(message, user_id) {
	// Strip punctuation from message
	message = message.replace(/[.,\/#!$%?\^&\*;:{}=\-_`~()]/g, "");

	// Check if user is responding to a yes/no question
	let yes_no = null;
	// If message contains just yes or no, set yes_no to yes or no
	if (message.toLowerCase() == "yes" || message.toLowerCase() == "yep" || message.toLowerCase() == "yeah" || message.toLowerCase() == "yup" || message.toLowerCase() == "yea") {
		yes_no = "yes";
	} else if (message.toLowerCase() == "no" || message.toLowerCase() == "nope" || message.toLowerCase() == "nah") {
		yes_no = "no";
	}

	// Check storage is user has a pending action (do_next)
	const do_next = JSON.parse(localStorage.getItem("do_next"));
	if (do_next) {
		console.log("PULSE ENGINE: Excecute " + do_next + " for user " + user_id);

		switch (do_next) {
			case "diagnose":
				console.log("PULSE ENGINE: Performing diagnose for user " + user_id);
				return await diagnoseSystem(message).then((diseases) => {
					// Check if response is null
					if (!diseases[0]) {
						return fallbackOptions("null_diagnose");
					} else {
						clearLocalStorage("do_next");

						// Create a response with the top disease
						let response = "According to my diagnosis, you may have ";
						response += diseases[0].disease + ". ";
						response += "Would you like to know more about this disease?";

						// Store do_next in local storage
						localStorage.setItem("do_next", JSON.stringify("ask_for_disease_info"));
						localStorage.setItem("disease", JSON.stringify(diseases[0]));

						return response;
					}
				});
			case "ask_for_disease_info":
				console.log("PULSE ENGINE: Asking for disease info for user " + user_id);
				const disease = JSON.parse(localStorage.getItem("disease"));

				if (yes_no == "yes" && disease) {
					// Get disease from local storage
					let response = "Here is some information about " + disease.disease + ". ";
					response += disease.description + " ";
					response += "Would you like me to give you some advice on how to treat this disease?";
					localStorage.setItem("do_next", JSON.stringify("ask_for_disease_precautions"));
					return response;
				} else if (yes_no == "no" && disease) {
					clearLocalStorage("do_next");
					return "Okay, but if you change your mind, just ask me about it."; // TODO: Add to responses.json
				} else if (!disease) {
					return fallbackOptions("null_disease");
				} else {
					return "Sorry, I didn't understand that. You want to know more about your disease, right? Please answer with yes or no.";
				}
			case "ask_for_disease_precautions":
				// Yes or no response
				console.log("PULSE ENGINE: Asking for disease precautions for user " + user_id);

				if (yes_no == "yes") {
					// Get disease from local storage
					const disease = JSON.parse(localStorage.getItem("disease"));
					let response = "I recommend that you: <br><ul>";
					for (let i = 0; i < disease.precautions.length; i++) {
						response += "<li>" + disease.precautions[i] + "</li>";
					}
					response += "</ul>";
					response += "I still recommend that you see a doctor, as I am not a replacement for a real doctor. ";
					response += "Would you like me to help you find a doctor?";
					localStorage.setItem("do_next", JSON.stringify("ask_for_doctor"));
					return response;
				} else if (yes_no == "no") {
					clearLocalStorage("do_next");
					return "Okay, but if you change your mind, just ask me about it."; // TODO: Add to responses.json
				} else {
					return "Sorry, I didn't understand that. Please answer with yes or no.";
				}
			case "ask_for_doctor":
				// Yes or no response
				if (yes_no == "yes") {
					console.log("PULSE ENGINE: Asking for doctor for user " + user_id);
					// Germany emergency number: 112
					clearLocalStorage("do_next");
					return "I can help you find a doctor. <a href='tel:112'>Call 112</a> if you need immediate help. ";
				} else if (yes_no == "no") {
					clearLocalStorage("do_next");
					return "Okay, but if you change your mind, just ask me about it."; // TODO: Add to responses.json
				} else {
					return "Sorry, I didn't understand that. Please answer with yes or no.";
				}
			case "end_conversation":
				clearLocalStorage("do_next");

			case "null":
				break;
		}
	}

	// Normal conversation
	return keywordSpotter(message).then((response_object) => {
		// Check if response is null
		if (response_object == null) {
			return fallbackOptions("null");
		}

		// Store do_next in local storage if it exists
		if (response_object.do_next) {
			localStorage.setItem("do_next", JSON.stringify(response_object.do_next));
		}

		return response_object.response;
	});
}
