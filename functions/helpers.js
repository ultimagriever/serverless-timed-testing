exports.addCorsHeader = function(response) {
  const corsResponse = Object.assign({}, response);

  if (!corsResponse.headers) {
    corsResponse.headers = {};
  }

  Object.assign(corsResponse.headers, {
    'Access-Control-Allow-Origin': '*'
  });

  return corsResponse;
};

exports.extractUserGuid = function(event) {
  const { cognitoAuthenticationProvider } = event.requestContext.identity;

  const provider = cognitoAuthenticationProvider.split(',').pop();

  return provider.split(':').pop();
};

exports.parseDdbOutput = items => items.map(
  item => Object.keys(item).reduce(
    (prev, curr) => Object.assign({}, prev, { [curr]: item[curr].S }), {}
  )
);
