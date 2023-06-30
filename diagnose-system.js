import { loadDataset } from "./pulse-engine.js";

async function detectSymptoms(message) {
	const symptoms = await loadDataset("./datasets/diseases.json").then((dataset) => {
		let symptomKeywords = dataset.symptoms;
		let symptoms = [];
		for (const symptom in symptomKeywords) {
			for (const keyword of symptomKeywords[symptom]) {
				if (message.includes(keyword)) {
					symptoms.push(symptom);
				}
			}
		}

		// Remove duplicates
		symptoms = [...new Set(symptoms)];

		return symptoms;
	});

	return symptoms;
}

async function detectDisease(symptoms) {
    const diseases = await loadDataset("./datasets/diseases.json").then((dataset) => {
        let diseases = [];
        for (const disease in dataset.diseases) {
			let diseaseSymptoms = dataset.diseases[disease].symptoms;
			let diseaseSeverity = dataset.diseases[disease].severity;
			let score = 0;

			for (const symptom of symptoms) {
				if (diseaseSymptoms.includes(symptom)) {
					score++;
				}
			}

			if (score > 0) {
				diseases.push({
					disease: disease,
					score: score/diseaseSymptoms.length,
					severity: diseaseSeverity,
					description: dataset.diseases[disease].description,
					precautions: dataset.diseases[disease].precautions
				});
			}
        }

		// Sort the diseases by score
		diseases.sort((a, b) => {
			if (a.score > b.score) {
				return -1;
			} else if (a.score < b.score) {
				return 1;
			} else {
				// If the scores are equal, sort by severity
				if (a.severity < b.severity) {
					return -1;
				} else if (a.severity > b.severity) {
					return 1;
				} else {
					// Keep the order the same
					return 0;
				}
			}
		});

        return diseases;
    });

    return diseases;
}


export async function diagnoseSystem(message) {
	message = message.toLowerCase();
	let symptoms = await detectSymptoms(message);
	// console.log(symptoms);

	let diseases = await detectDisease(symptoms);
	// console.log(diseases);

	return diseases;
}
