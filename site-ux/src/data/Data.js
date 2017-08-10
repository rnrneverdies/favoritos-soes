
const posts = require('./soes/posts.json');
const users = require('./soes/users.json');
const predictions = require('./soes/predictions.json');

const metaPosts = require('./meta.soes/posts.json');
const metaUsers = require('./meta.soes/users.json');
const metaPredictions = require('./meta.soes/predictions.json');

export const MainSite = {
    posts: posts,
    users: users,
    predictions: predictions,
};

export const MetaSite = {
    posts: metaPosts,
    users: metaUsers,
    predictions: metaPredictions,
};