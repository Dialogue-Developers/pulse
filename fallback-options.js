export function fallbackOptions(type) {
    const fallbacks = {
        "diagnose": "I'm sorry, but I'm not able to provide a diagnosis for you at this time. Please try again later.",
        "provide_nutrition_info": "I'm sorry, but I'm not able to provide nutrition information for you at this time. Please try again later.",
        "provide_exercise_info": "I'm sorry, but I'm not able to provide exercise information for you at this time. Please try again later.",
        "null": "I'm sorry, but I didn't quite understand that. Could you please rephrase your request?"
    };

    return fallbacks[type];
}