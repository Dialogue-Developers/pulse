/*
"symptoms": {
		"itching": ["itching", "itch", "itchy", "itchiness", "itches"],
		"skin_rash": ["skin rash", "rash", "skinrash", "skinrashes", "rashes"],
		"nodal_skin_eruptions": ["nodal skin eruptions", "nodal skin", "nodalskin", "nodal", "skin eruptions", "skineruptions"],
		"dischromic _patches": ["dischromic patches", "dischromic", "patches", "dischromicpatches"],
		"continuous_sneezing": ["continuous sneezing", "continuous", "sneezing", "sneeze", "sneezes", "sneezed"],
		"shivering": ["shivering", "shiver", "shivers", "shivered", "shivering"],
		"watering_from_eyes": ["watering from eyes", "watering eyes", "eyes watering", "eyes are watering", "eye is watering", "eye water"],
		"stomach_pain": ["stomach pain", "stomachache", "stomach ache", "stomach pains", "stomachaches", "stomach aches", "stomachpains", "stomach hurts"],
		"acidity": [
			"acidity",
			"acid reflux",
			"acidreflux",
			"acid refluxes",
			"acidrefluxes",
			"acid refluxed",
			"acidrefluxed",
			"stomach burn",
			"stomach burning",
			"stomach burns"
		],
		...
*/

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
            let diseaseSymptoms = dataset.diseases[disease];
            let matches = 0;
            for (const symptom of symptoms) {
                if (Array.isArray(diseaseSymptoms) && diseaseSymptoms.includes(symptom)) {
                    matches++;
                }
            }
            if (matches > 0) {
                diseases.push({
                    name: disease,
                    matches: matches,
                });
            }
        }

        // Sort by matches
        diseases.sort((a, b) => {
            return b.matches - a.matches;
        });

        return diseases;
    });

    return diseases;
}


export async function diagnoseSystem(message) {
	console.log("Diagnose system");
	let symptoms = await detectSymptoms(message);
	console.log(symptoms);

	let disease = await detectDisease(symptoms);
	console.log(disease);
}