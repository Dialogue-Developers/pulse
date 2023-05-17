const fs = require('fs');



export function diagnoseSystem(message) {
    const symptomKeywords = require('./symptomKeywords.json');


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

    // Save mentioned symptoms to JSON file
    fs.writeFileSync('diagnose_system.json', JSON.stringify(mentionedSymptoms));
}