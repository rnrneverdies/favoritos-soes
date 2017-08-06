const fs = require('fs');
const path = require('path');
const lib = require('./lib');
const json2csv = require('json2csv');

const cwd = process.cwd();
const source = path.join(cwd, process.argv[2]);
const dest = path.join(cwd, process.argv[3]);

if (!fs.existsSync(dest)){
    fs.mkdirSync(dest);
}

const f = (fn) => path.join(dest, fn);
const transpose = m => m[0].map((x,i) => m.map(x => x[i]));
const minFavoriteCount = process.argv[4] || 0;
const minUserVotes = process.argv[5] || 1;

const data = {};

async function main() {
    const posts = await lib.ingestPost(path.join(source, 'Posts.xml'), minFavoriteCount);
    const votes = await lib.ingestVotes(path.join(source, 'Votes.xml'));
    const users = await lib.ingestUsers(path.join(source, 'Users.xml'));

    const u = users.length;
    const m = posts.length;

    console.log(`${m} posts ingested`);
    console.log(`${votes.length} votes ingested`);
    console.log(`${u} users ingested`);

    const tR = []; // transpose R
    const U = []; // users

    console.log(`creating matrix R`);

    // for each user
    var c = 0;
    for(var i=0; i < u; i++) {
        const Ru = [];
        const user = users[i];
        const userVotes = votes.filter(v=>v.userid==user.id);

        // users with few votes are discarded
        if (userVotes.length < minUserVotes) continue;

        // for each post
        for(var k=0; k < m; k++) {
            const post = posts[k];
            const vote = userVotes.find(v=>v.postid == post.id);

            Ru.push(vote ? 1 : 0);
        }

        tR[c] = Ru;
        U[c] = user;
        c++;
    }

    console.log(`saving matrix R`);

    saveMatrix(f('R.csv'), transpose(tR));

    console.log(`saving users=${U.length} & posts=${posts.length} as CSV and JSON`);

    saveList(f('posts.csv'), posts);
    saveList(f('users.csv'), U);
    saveJson(f('posts.json'), posts);
    saveJson(f('users.json'), U);
}

// execure app
main().catch(e => console.log(e));

function saveJson(file, json) {
    fs.writeFileSync(file, JSON.stringify(json));
}

function saveMatrix(file, M) {
    const stream = fs.createWriteStream(file);
    stream.once('open', function(fd) {
        for(var i=0; i < M.length; i++) {
            stream.write(`${M[i].toString()}\n`);
        }
        stream.end();
    });
}

function saveList(file, L, removeHeaders = true) {
    const model = L[0]; // element 0 must have all the fields
    const fields = [];
    for (let name in model) {
        fields.push(name);
    }
    try {
        var result = json2csv({ data: L, fields: fields });
        if (removeHeaders) {
            result = result.substring(result.indexOf("\n") + 1);
        }
        fs.writeFileSync(file, result);
    } catch (err) {
        console.error(err);
    }
}