import nlp from 'compromise'
import nlpNumbers from 'compromise-numbers'

nlp.extend(nlpNumbers)

// Basic fallback list of common units to help parse units manually
const COMMON_UNITS = ['g', 'gram', 'grams', 'kg', 'oz', 'ml', 'l', 'tbsp', 'tsp', 'cup', 'cups', 'pinch', 'clove', 'cloves', 'piece', 'pieces', 'can', 'cans'];

export function parseWithNLP(input_line) {
    const line = input_line.replace(/^[^\w\d]+/, '');
    const doc = nlp(line);
    const numbers = doc.numbers().json(); // Finds numbers, decimals, and fractions

    if (numbers.length === 0) {
        return {
            original: line,
            quantity: null,
            unit: '',
            description: line
        };
    }

    // Get first number and remove it from the line
    const parsedNumbers = numbers.map(num => ({
        text: num.text,
        value: parseFloat(num.text)
    }));

    const firstNumber = parsedNumbers[0];
    const afterFirstNum = line.replace(firstNumber.text, '').trim();

    // Try to detect a unit right after the quantity
    const words = afterFirstNum.split(' ');
    const unit = COMMON_UNITS.includes(words[0].toLowerCase()) ? words[0] : '';

    // Build cleaned ingredient description
    const description = afterFirstNum.replace(unit, '').trim();

    return {
        original: line,
        quantity: firstNumber.value,
        unit,
        description,
        numbers: parsedNumbers
    };
}
