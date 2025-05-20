function parseQuantity(quantityStr) {
    const parts = quantityStr.trim().split(' ');

    // simple fraction: e.g. 1/2
    if (parts.length === 1 && parts[0].includes('/')) {
        const [numerator, denominator] = parts[0].split('/');
        return parseFloat(numerator) / parseFloat(denominator);
    }

    // mixed fraction: e.g. 1 1/2
    if (parts.length == 2) {
        
        const whole = parseFloat(parts[0])
        const [numerator, denominator] = parts[1].split('/');
        if (!isNaN(whole) && denominator) {
            return whole + parseFloat(numerator) / parseFloat(denominator);
        }
    }

    // whole number or decimal
    return parseFloat(quantityStr);
} 

export function parseIngredients(text) {
    return text.split('\n').map(line => {

        const match = line.match(/^\D?([\d\s/.\-]+)\s*(.*)$/);
        // ^([\d/.]+) = matches one or more digits: captures '1', '1.5', '1/2'
        // \s* = matches optional whitespace
        // (.*) = matches the remainder of the line
        // match = [ - , quantity, item]

        if (!match) {
            return { original: line, quantity: null, unit: '', description: line };
        }
        const quantity = parseQuantity(match[1])
        
        const remainder = match[2]
        const unit = remainder.split(' ')[0];

        const noteRegex = /\bnote\s*\d+/i; // skipe cases of "(Note 4)"

        // Find bracketed numbers: e.g. "3/4 cup (185 ml)"
        const bracketMatches = [...remainder.matchAll(/[\(\[]([^\)\]]*?([\d.\/]+)[^\)\]]*?)[\)\]]/g)];
        const brackets = bracketMatches.map(m => ({
            fullMatch: m[0],
            quantityStr: m[2],
            index: m.index
        })).filter(b => !noteRegex.test(b.fullMatch));

        // Find slahed alternative units: e.g. "180g / 6oz cream cheese"
        const slashMatches = [...remainder.matchAll(/\/\s*([\d.\/]+)\s*\w*/g)];
        const slashUnits = slashMatches.map(m => ({
            fullMatch: m[0],
            quantityStr: m[1],
            index: m.index
        }));

        return {
            original: line,
            quantity, 
            unit,
            description: remainder,
            brackets,
            slashUnits
        };
    });
}

function formatFraction(decimal) {
    const rounded = Math.round(decimal * 1000) / 1000; // prevent float errors
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
  
    // Find the best matching fraction
    const keys = Object.keys(FRACTION_MAP).map(parseFloat);
    for (const key of keys) {
        if (Math.abs(remainder - key) < 0.02) {
            const fractionPart = FRACTION_MAP[key];
            if (whole === 0) {
                return fractionPart; // e.g. "1/2"
            }
            return `${whole} ${fractionPart}`; // e.g. "2 1/2"
        }
    }
    // fallbacks
    return remainder === 0 ? `${whole}` : rounded.toFixed(2);
}
  


export function scaleIngredients(ingredients, multiplier) {
    return ingredients.map(item => {
        if (item.quantity === null) return {...item, newQuantity: null};

        const newQuantity = formatFraction(+(item.quantity * multiplier).toFixed(2))
        let newDescription = item.description;

        // updated bracketed quantities
        if (item.brackets && item.brackets.length > 0) {
            for (const bracket of item.brackets) {
                const parsed = parseQuantity(bracket.quantityStr);
                const scaled = +(parsed * multiplier).toFixed(2);
                const replacement = bracket.fullMatch.replace(
                    bracket.quantityStr,
                    formatFraction(scaled)
                );

                const escapedMatch = bracket.fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape for regex
                const regex = new RegExp(escapedMatch, 'g');
                newDescription = newDescription.replace(regex, replacement);

            }
        }
        
        // updated slashed quantity alternatives
        if (item.slashUnits && item.slashUnits.length > 0) {
            for (const slash of item.slashUnits) {
                const parsed = parseQuantity(slash.quantityStr);
                const scaled = +(parsed * multiplier).toFixed(2);
                const replacement = slash.fullMatch.replace(
                    slash.quantityStr,
                    formatFraction(scaled)
                );
        
                const escapedMatch = slash.fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedMatch, 'g');
                newDescription = newDescription.replace(regex, replacement);
            }
        }

        // replace other inline quantities (e.g. "2 cups grated carrot, about 2 carrots")
        newDescription = newDescription.replace(/\b(\d+(\.\d+)?|\d+\s+\d+\/\d+|\d+\/\d+)\b/g, (match, numStr, _, offset, fullStr) => {
            // Avoid touching "Note 4" or already processed matches
            const isNote = /note\s*[\d]+/i.test(fullStr.slice(offset - 5, offset + match.length + 5));
            if (isNote) return match;

            const parsed = parseQuantity(match);
            if (isNaN(parsed)) return match;

            const scaled = +(parsed * multiplier).toFixed(2);
            return formatFraction(scaled);
        });




        return {
            ...item,
            newQuantity,
            description: newDescription
        };
    });
}