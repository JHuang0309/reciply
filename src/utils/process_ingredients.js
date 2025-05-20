// Helper: parse fractions and mixed fractions into decimals
function parseQuantity(quantityStr) {
    const parts = quantityStr.trim().split(' ');
  
    // simple fraction e.g. "1/2"
    if (parts.length === 1 && parts[0].includes('/')) {
      const [numerator, denominator] = parts[0].split('/');
      return parseFloat(numerator) / parseFloat(denominator);
    }
  
    // mixed fraction e.g. "1 1/2"
    if (parts.length === 2 && parts[1].includes('/')) {
      const whole = parseFloat(parts[0]);
      const [numerator, denominator] = parts[1].split('/');
      if (!isNaN(whole) && denominator) {
        return whole + parseFloat(numerator) / parseFloat(denominator);
      }
    }
  
    // simple number (int or decimal)
    return parseFloat(quantityStr);
}
  
// Format decimals back to fractions or decimal strings for readability
function formatFraction(decimal) {
    const rounded = Math.round(decimal * 1000) / 1000; // avoid float precision issues
    const whole = Math.floor(rounded);
    const remainder = rounded - whole;

    const FRACTION_MAP = {
        0.25: '1/4',
        0.33: '1/3',
        0.333: '1/3',
        0.5: '1/2',
        0.66: '2/3',
        0.667: '2/3',
        0.75: '3/4'
    };

    for (const key in FRACTION_MAP) {
        if (Math.abs(remainder - parseFloat(key)) < 0.02) {
        const fractionPart = FRACTION_MAP[key];
        if (whole === 0) return fractionPart;
        return `${whole} ${fractionPart}`;
        }
    }

    return remainder === 0 ? `${whole}` : rounded.toFixed(2);
}
  
function scaleIngredientLine(line, multiplier) {
    // Replace all numbers except those inside "Note X"
  
    // Matches: "1", "1.5", "1/2", "1 1/2"
    const numberRegex = /\b(\d+\s\d+\/\d+|\d+\/\d+|\d+(\.\d+)?)/g;
    
    // First, find the first number in the line to use as main quantity
    const firstNumberMatch = line.match(numberRegex);
    let mainQuantity = null;
    if (firstNumberMatch) {
        mainQuantity = parseQuantity(firstNumberMatch[0]);
    }

    let firstNumberRemoved = false;
  
    // Replace all numbers by scaled numbers except those in Note
    const scaledLine = line.replace(numberRegex, (match, _1, _2, offset, fullStr) => {

        const isNote = /note\s*[\d]+/i.test(fullStr.slice(offset - 5, offset + match.length + 5));
        if (isNote) return match;

        if (!firstNumberRemoved) {
            firstNumberRemoved = true;
            return ''; // Remove the first number entirely
        }
    
        const parsed = parseQuantity(match);
        if (isNaN(parsed)) return match;
    
        const scaled = parsed * multiplier;
        return formatFraction(scaled);
    });
  
    return {
        original: line,
        newQuantity: mainQuantity !== null ? formatFraction(mainQuantity * multiplier) : null,
        description: scaledLine
    };
}

export function scaleIngredients(text, multiplier) {
    return text.split('\n').map(line => {
      // Remove leading characters that are NOT digits or letters
      const cleanedLine = line.replace(/^[^a-zA-Z0-9]+/, '');
  
      // Now scale this cleaned line
      return scaleIngredientLine(cleanedLine, multiplier);
    });
}
  
  