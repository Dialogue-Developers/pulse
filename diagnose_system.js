const fs = require('fs');

export function diagnoseSystem(message) {
    const symptomKeywords = require('./dataset/diseases.json');


    const mentionedSymptoms = [];

    for (const symptom in symptomKeywords) {
    const keywords = symptomKeywords[symptom];
    for (const keyword of keywords) {
        if (message.toLowerCase().includes(keyword)) {
        mentionedSymptoms.push(symptom);
        break;
        }
    }
    }

   
}