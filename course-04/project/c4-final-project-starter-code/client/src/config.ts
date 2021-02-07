// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'gtt2o9o4ne';
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`;

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-4kascpa8.us.auth0.com',            // Auth0 domain
  clientId: 'b9jtyUyWlM4Q8Y2n1U3i3FBaGf76a5xw',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
};
