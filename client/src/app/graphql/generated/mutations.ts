import gql from 'graphql-tag';

export const MutationExchangeTokenDocs = gql`
    mutation ExchangeToken($input: TokenRequest) {
  response: exchangeToken(input: $input) {
    idToken
    accessToken
    expiresIn
    tokenType
    refreshToken
  }
}
    `;
export const MutationStartProcessDocs = gql`
    mutation StartProcess($input: ProcessInput) {
  response: startProcess(input: $input) {
    id
    status
    message
  }
}
    `;