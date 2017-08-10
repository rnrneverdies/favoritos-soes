Y = csvread('R.csv');
R = csvread('R.csv');
num_users = size(Y, 2);
num_posts = size(Y, 1);
num_features = 10;

% random initialize X and Theta to avoid symetry
X = randn(num_posts, num_features);
Theta = randn(num_users, num_features);

initial_parameters = [X(:); Theta(:)];

% options for fmincg
options = optimset('GradObj', 'on', 'MaxIter', 250);

% regularization
lambda = 1.75;
theta = fmincg (@(t)(cofiCostFunc(t, Y, R, num_users, num_posts, num_features, lambda)), initial_parameters, options);

% reshape
X = reshape(theta(1:num_posts*num_features), num_posts, num_features);
Theta = reshape(theta(num_posts*num_features+1:end), num_users, num_features);

p = X * Theta';

csvwrite('predictions.csv', p');

fprintf('Recommender system\n');
fprintf(' - learning completed\n');
fprintf(' - predictions saved\n');
