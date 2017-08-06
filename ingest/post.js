const fs = require('fs');
const path = require('path');
const lib = require('./lib');
const json2csv = require('json2csv');

const cwd = process.cwd();
const dest = path.join(cwd, process.argv[2]);
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main(params) {
    let loaded = false;
    let text = undefined;
    while(!loaded) {
        try {
            text = fs.readFileSync(path.join(dest,'predictions.csv')).toString();
            if (text) loaded = true;
        } catch (e) {
            console.log('waiting for predictions.csv');
            await timeout(1500);
        }
    }

    var predictions = text.split(/\n/).filter(l => l.length > 0).map(l => l.split(/,/).map(parseFloat));
    console.log(`preditions packed ${predictions.length} users x ${predictions[0].length} posts`)
    fs.writeFileSync(path.join(dest,'predictions.json'), JSON.stringify(predictions, true));
}

main().catch(e => console.log(e));
