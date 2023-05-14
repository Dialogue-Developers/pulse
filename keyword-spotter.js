// To allow the use of require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require("fs");

// Load dataset
async function loadDataset(path) {
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

export async function keywordSpotter(message) {
	// Load the dataset
	return await loadDataset("./datasets/responses.json").then((dataset) => {
		const responses = dataset.responses; // Responses to keywords

		// Split the message into words, and remove punctuation
		const words = message.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(" ");

		// Perform keyword search on the message
		let response = null;
		let do_next = null;

		const responseMap = {};
		responses.forEach((response_object) => {
			response_object.keyword.forEach((keyword) => {
				const keywordLower = keyword.toLowerCase();
				if (!responseMap[keywordLower]) {
					responseMap[keywordLower] = {
						responses: response_object.responses,
						do_next: response_object.do_next
					};
				}
			});
		});
		for (const word of words) {
			const wordLower = word.toLowerCase();
			if (responseMap[wordLower]) {
				const responseObj = responseMap[wordLower];
				const response = responseObj.responses[Math.floor(Math.random() * responseObj.responses.length)];
				do_next = responseObj.do_next;
				break;
			}
		}

		if (response == null) {
			return null;
		} else {
			return {
				response: response,
				do_next: do_next
			};
		}
	});
}