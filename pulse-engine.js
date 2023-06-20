import { keywordSpotter } from "./keyword-spotter.js";
import { fallbackOptions } from "./fallback-options.js";
import { diagnoseSystem } from "./diagnose-system.js";

// To allow the use of require
import { createRequire } from "module";
import { re } from "mathjs";

// Load dataset function
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

// Check for yes/no responses
function checkYesNo(message) {
	let yes_no = null;

	const positiveKeywords = ["yes", "yep", "yeah", "yup", "yea", "sure", "ok", "okay", "sure", "sure thing", "definitely"];
	const negativeKeywords = ["no", "nope", "nah", "no thanks", "not really", "not", "not sure", "not really sure", "not sure really", "not sure, really", "not really"];

	if (positiveKeywords.includes(message.toLowerCase())) {
		yes_no = "yes";
	} else if (negativeKeywords.includes(message.toLowerCase())) {
		yes_no = "no";
	}

	return yes_no;
}

// Local storage memory functions
// do_next: The next action to perform
// disease: The disease to provide information on
// fallbackCount: The number of times the fallback has been called repeatedly
// lastResponse: Index of the last response to determine if the same response is being repeated

function clearLocalStorageObject(obj) {
	localStorage.removeItem(obj);
}

function setLocalStorageObject(obj, value) {
	localStorage.setItem(obj, JSON.stringify(value));
}

function getLocalStorageObject(obj) {
	return JSON.parse(localStorage.getItem(obj));
}

function clearLocalStorage() {
	localStorage.clear();
}

function increaseFallbackCount() {
	let fallbackCount = JSON.parse(localStorage.getItem("fallbackCount"));
	if (!fallbackCount) {
		fallbackCount = 0;
	}
	fallbackCount++;

	setLocalStorageObject("fallbackCount", fallbackCount);

	if (fallbackCount >= 5) {
		console.log("PULSE ENGINE: Fallback count exceeded, resetting.");
		resetFallbackCount();
		clearLocalStorageObject("lastResponse");
		return false;
	} else {
		return true;
	}
}

function resetFallbackCount() {
	setLocalStorageObject("fallbackCount", 0);
}

function getFallbackCount() {
	let fallbackCount = JSON.parse(localStorage.getItem("fallbackCount"));
	if (!fallbackCount) {
		fallbackCount = 0;
	}
	return fallbackCount;
}

// Debugging
function consoleLogLocalStorage() {
	console.log("do_next: " + getLocalStorageObject("do_next"));
	console.log("disease: " + getLocalStorageObject("disease"));
	console.log("fallbackCount: " + getLocalStorageObject("fallbackCount"));
	console.log("lastResponse: " + getLocalStorageObject("lastResponse"));
}

export async function pulseEngine(message, user_id) {
	// consoleLogLocalStorage();
	// Strip punctuation from message
	message = message.replace(/[.,\/#!$%?\^&\*;:{}=\-_`~()]/g, "");

	// Check if user is responding to a yes/no question
	const yes_no = checkYesNo(message);

	// Functional conversation
	const do_next = JSON.parse(localStorage.getItem("do_next"));
	if (do_next) {
		console.log("PULSE ENGINE: Excecute " + do_next + " for user " + user_id);

		switch (do_next) {
			case "diagnose":
				console.log("PULSE ENGINE: Performing diagnose for user " + user_id);
				return await diagnoseSystem(message).then((diseases) => {
					// Check if response is null
					if (!diseases[0]) {
						if(!increaseFallbackCount()) return fallbackOptions("change_topic");
						return fallbackOptions("null_diagnose");
					} else {
						clearLocalStorageObject("do_next");
						resetFallbackCount();
						// Create a response with the top disease
						let response = "According to my diagnosis, you may have ";
						response += diseases[0].disease + ". ";
						response += "Would you like to know more about this disease?";

						// Store do_next in local storage
						// localStorage.setItem("do_next", JSON.stringify("ask_for_disease_info"));
						setLocalStorageObject("do_next", "ask_for_disease_info");
						setLocalStorageObject("disease", diseases[0]);

						return response;
					}
				});
			case "ask_for_disease_info":
				console.log("PULSE ENGINE: Asking for disease info for user " + user_id);
				const disease = JSON.parse(localStorage.getItem("disease"));

				if (yes_no == "yes" && disease) {
					resetFallbackCount();
					// Get disease from local storage
					let response = "Here is some information about " + disease.disease + ".<br>";
					response += disease.description + " ";
					response += "Would you like me to give you some advice on how to treat your disease?";
					setLocalStorageObject("do_next", "ask_for_disease_precautions");
					return response;
				} else if (yes_no == "no" && disease) {
					clearLocalStorageObject("do_next");
					resetFallbackCount();
					return "Okay, but if you change your mind, just ask me about it."; // TODO: Add to responses.json
				} else if (!disease) {
					if(!increaseFallbackCount()) return fallbackOptions("change_topic");
					clearLocalStorageObject("do_next");
					return fallbackOptions("null_disease");
				} else {
					if(!increaseFallbackCount()) return fallbackOptions("change_topic");
					return "Sorry, I didn't understand that. You want to know more about your disease, right? Please answer with yes or no.";
				}
			case "ask_for_disease_precautions":
				// Yes or no response
				console.log("PULSE ENGINE: Asking for disease precautions for user " + user_id);

				if (yes_no == "yes") {
					resetFallbackCount();
					// Get disease from local storage
					const disease = JSON.parse(localStorage.getItem("disease"));
					let response = "I recommend that you: <br><ul>";
					for (let i = 0; i < disease.precautions.length; i++) {
						response += "<li>" + disease.precautions[i] + "</li>";
					}
					response += "</ul>";
					response += "I still recommend that you see a doctor, as I am not a replacement for a real doctor. ";
					response += "Would you like me to help you find a doctor?";

					setLocalStorageObject("do_next", "ask_for_doctor");
					return response;
				} else if (yes_no == "no") {
					resetFallbackCount();
					clearLocalStorageObject("do_next");
					return "Okay, but if you change your mind, just ask me about it."; // TODO: Add to responses.json
				} else {
					if(!increaseFallbackCount()) return fallbackOptions("change_topic");
					return "Sorry, I didn't understand that. Please answer with yes or no.";
				}
			case "ask_for_doctor":
				// Yes or no response
				if (yes_no == "yes") {
					console.log("PULSE ENGINE: Asking for doctor for user " + user_id);
					// Germany emergency number: 112
					clearLocalStorageObject("do_next");
					resetFallbackCount();
					return "I can help you find a doctor. <a href='tel:112'>Call 112</a> if you need immediate help. ";
				} else if (yes_no == "no") {
					clearLocalStorageObject("do_next");
					resetFallbackCount();
					return "Okay, but if you change your mind, just ask me about it."; // TODO: Add to responses.json
				} else {
					if(!increaseFallbackCount()) return fallbackOptions("change_topic");
					return "Sorry, I didn't understand that. Please answer with yes or no.";
				}
			case "end_conversation":
				console.log("PULSE ENGINE: Ending conversation for user " + user_id);
				clearLocalStorage();
				resetFallbackCount();

			case "null":
				break;
		}
	}

	// Normal conversation
	return keywordSpotter(message).then((response_object) => {
		// Check if response is null
		if (response_object == null) {
			if(!increaseFallbackCount()) return fallbackOptions("change_topic");
			return fallbackOptions("null");
		} else {
			setLocalStorageObject("lastResponse", response_object.responseIndex);
		}

		// Store do_next in local storage if it exists
		if (response_object.do_next) {
			setLocalStorageObject("do_next", response_object.do_next);
		}
		
		if (response_object.responseIndex == getLocalStorageObject("lastResponse") && response_object.do_next == null) {
			if(!increaseFallbackCount()) return fallbackOptions("change_topic");
		} else {
			resetFallbackCount();
		}

		return response_object.response;
	});
}
