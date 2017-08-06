const fs = require('fs');
var XmlStream = require('xml-stream');

const postsIngestor = (stream, minFavoriteCount) => {
    var xml = new XmlStream(stream);
    const result = [];

    xml.on('endElement: row', function(row) {
        const post = row.$;
        const type = post.PostTypeId;
        const favoriteCount = parseInt(post.FavoriteCount) || 0;

        // Only questions with favorites
        if (type != "1" || favoriteCount <= minFavoriteCount) return;

        result.push({
            id: parseInt(post.Id),
            title: post.Title,
            score: parseInt(post.Score),
            views: parseInt(post.ViewCount),
            favoriteCount: favoriteCount,
        });
    });

    return result;
}

const votesIngestor = (stream) => {
    var xml = new XmlStream(stream);
    const result = [];

    xml.on('endElement: row', function(row) {
        const vote = row.$;
        const type = vote.VoteTypeId;

        // Only favorites
        if (type != "5") return;

        result.push({
            id: parseInt(vote.Id),
            postid: parseInt(vote.PostId),
            userid: parseInt(vote.UserId),
        });
    });

    return result;
}

const usersIngestor = (stream) => {
    var xml = new XmlStream(stream);
    const result = [];

    xml.on('endElement: row', function(row) {
        const user = row.$;
        result.push({
            id: parseInt(user.Id),
            rep: parseInt(user.Reputation),
            displayname: user.DisplayName,
        });
    });

    return result;
}

const ingest = (source, ingestHandler, extra) => {
    console.log(`Ingesting ${source}`);

    const stream = fs.createReadStream(source, { encoding: 'utf-8' });
    const data = ingestHandler(stream, extra);

    return new Promise(
        function (resolve, reject) { // (A)
            if (true) {
                stream.on('close', ()=> {
                    resolve(data); // success
                });

            } else {
                reject(reason); // failure
            }
        });
};

module.exports = {
    ingestPost: (s,e = 0) => { return ingest(s, postsIngestor,e); },
    ingestVotes: (s) => { return ingest(s, votesIngestor); },
    ingestUsers: (s) => { return ingest(s, usersIngestor); },
};
