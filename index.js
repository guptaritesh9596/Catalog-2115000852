const fs = require('fs');

function decodeBaseValue(base, value) {
    try {
        return parseInt(value, base);
    } catch (error) {
        console.error(`Failed to decode value: ${value} from base ${base}`);
        throw error;
    }
}

function buildDividedDifferenceTable(points, k) {
    let n = points.length;
    let table = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        table[i][0] = points[i][1];
    }

    for (let j = 1; j < k; j++) {
        for (let i = 0; i < n - j; i++) {
            let numerator = table[i + 1][j - 1] - table[i][j - 1];
            let denominator = points[i + j][0] - points[i][0];
            if (denominator === 0) throw new Error('Zero division error detected in table computation!');
            table[i][j] = numerator / denominator;
        }
    }

    return table;
}

function computeConstantTerm(points, table, k) {
    let constantTerm = table[0][0];
    
    for (let i = 1; i < k; i++) {
        let term = table[0][i];
        for (let j = 0; j < i; j++) {
            term *= (-points[j][0]);
        }
        constantTerm += term;
    }

    return Math.round(constantTerm);
}

function solve(filePath) {
    try {
        let jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let keys = jsonData['keys'];
        let n = keys['n'];
        let k = keys['k'];

        if (n < k) {
            throw new Error("Insufficient points provided. At least k points are required.");
        }

        let points = [];
        for (let i = 1; i <= n; i++) {
            if (jsonData[i]) {
                let x = parseInt(i);
                let y = decodeBaseValue(jsonData[i]['base'], jsonData[i]['value']);
                points.push([x, y]);
            }
        }

        let dividedDifferenceTable = buildDividedDifferenceTable(points, k);
        let constantTerm = computeConstantTerm(points, dividedDifferenceTable, k);
        
        console.log(`Secret constant (c) for file ${filePath}: ${constantTerm}`);

    } catch (error) {
        console.error(`Error processing file ${filePath}: ${error.message}`);
    }
}

solve('testcase1.json');
solve('testcase2.json');
