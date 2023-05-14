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

		// TODO: Optimize this (O(n^3) is not good)
		responses.forEach((response_object) => {
			response_object.keyword.forEach((keyword) => {
				words.forEach((word) => {
					if (word.toLowerCase() == keyword.toLowerCase()) {
						response = response_object.responses[Math.floor(Math.random() * response_object.responses.length)];
						do_next = response_object.do_next;
					}
				});
			});
		});

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