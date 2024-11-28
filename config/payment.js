// Your API username and password
const apiUsername = 'mIM89v382PF9KGOFgU59';
const apiPassword = 'cCSDQAbeEbVpGMaIgOVpV3c7ORUxcVkJVS84d1iB';

// Concatenating username and password with a colon
const credentials = `${apiUsername}:${apiPassword}`;

// Base64 encode the credentials
const encodedCredentials = Buffer.from(credentials).toString('base64');

// Creating the Basic Auth token
const basicAuthToken = `Basic ${encodedCredentials}`;

// Output the token
module.exports = basicAuthToken;
