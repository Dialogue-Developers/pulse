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

function clearLocalStorage() {
	localStorage.removeItem("pulse-engine");
}

export async function pulseEngine(message, user_id) {
	// Check storage is user has a pending action (do_next)
	const do_next = JSON.parse(localStorage.getItem("pulse-engine"));
	if (do_next) {
		console.log("PULSE ENGINE: Excecute " + do_next + " for user " + user_id);
		localStorage.removeItem("pulse-engine");
		switch (do_next) {
			case "diagnose":
				return diagnoseSystem(message).then((response_object) => {
					// Check if response is null
					if (response_object == null) {
						return fallbackOptions("null");
					}
				});
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
