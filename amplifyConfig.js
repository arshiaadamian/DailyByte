export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'ca-west-1_l7hLXLf0O',
      userPoolClientId: 'u5l3645s7javpithgegobum6f',
      loginWith: {
        oauth: {
          domain: 'ca-west-1l7hlxlf0o.auth.ca-west-1.amazoncognito.com',
          scopes: ["email", "openid", "profile"],
          redirectSignIn: ["dailybyte://"],
          redirectSignOut: ["dailybyte://"],
          responseType: 'code'
        }
      }
    },
  },
};