import { loadDataset } from "./pulse-engine.js";

export async function keywordSpotter(message) {
	// Load the dataset
	return await loadDataset("./datasets/responses.json").then((dataset) => {
		const responses = dataset.responses; // Responses to keywords

		// Split the message into words, and remove punctuation
		const words = message.toLowerCase().replace(/[.,\/#!$%?\^&\*;:{}=\-_`~()]/g, "").split(" ");

		// Perform keyword search on the message
		let response = null;
		let do_next = null;

		const responseMap = {};
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