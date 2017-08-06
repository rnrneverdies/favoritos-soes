function [J, grad] = cofiCostFunc(params, Y, R, num_users, num_movies, ...
                                  num_features, lambda)
X = reshape(params(1:num_movies*num_features), num_movies, num_features);
Theta = reshape(params(num_movies*num_features+1:end), ...
                num_users, num_features);

Jp = R.*(X*Theta' - Y);

% 1/2 * sum(sum(Jp.^2)) but this is faster!!
J = (Jp(:)'*Jp(:))/2 ...
	+ (lambda/2 * Theta(:)'*Theta(:)) ...
	+ (lambda/2 * X(:)'*X(:));

X_grad = Jp*Theta+(lambda * X);
Theta_grad = Jp'*X+(lambda * Theta);

grad = [X_grad(:); Theta_grad(:)];

end
