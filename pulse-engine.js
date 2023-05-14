import { keywordSpotter } from "./keyword-spotter.js";
import { fallbackOptions } from "./fallback-options.js";

function clearLocalStorage() {
	localStorage.removeItem("pulse-engine");
}

function diagnoseUser(message) {
	clearLocalStorage();
	return "I think you have a problem, but I'm not a doctor so I can't help you.";
}

export async function pulseEngine(message, user_id) {
	// Check storage is user has a pending action (do_next)
	const do_next = JSON.parse(localStorage.getItem("pulse-engine"));
	if (do_next) {
		console.log("PULSE ENGINE: Excecute " + do_next + " for user " + user_id);
		localStorage.removeItem("pulse-engine");
		switch (do_next) {
			case "diagnose":
				return diagnoseUser(message);
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
			localStorage.setItem("pulse-engine", JSON.stringify(response_object.do_next));
		}

		// Return response
		console.log("PULSE ENGINE: Keyword spotter returned '" + response_object.response + "' for user " + user_id);
		return response_object.response;
	});
}
