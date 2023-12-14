// Given several bank accounts with balance, account_id, and is_sensitive attributes.
// Go through all the bank accounts and if they are is_sensitive (True), tokenize them using a Tokenize service that has TokenServiceRequest and TokenServiceResponse class objects
// If we’re dealing with sensitive bank accounts (sensitive = True), then append ‘tkn_’ + account.id (e.g “tkn_1234”) to account

class Account {
  constructor(id, balance, sensitive) {
    this.id = id;
    this.balance = balance;
    this.sensitive = sensitive;
  }

  accountService(accounts) {
    // get sensitive accounts
    const updatedAccounts = accounts.map((account) => new Account(account.id, account.balance, account.sensitive)) // map creates a new array with new references
    const sensitiveAccounts = updatedAccounts.filter((account) => account.sensitive === true)
    // get token service requests for those accounts
    const requests = sensitiveAccounts.map((account) => new TokenServiceRequest(account.id, account))
    // call tokenService on those requests
    const responses = TokenService.prototype.tokenService(requests)

    // return what? let's say an array of accounts where all sensitive accounts have been tokenized
    for (const account of sensitiveAccounts) { // the filter method preserves references to updatedAccounts array, so updating account.id here updates it in our return array
      const matchedResponse = responses.find((response) => response.trackingId === account.id)
      if (matchedResponse) account.id = matchedResponse.token
    }

    return updatedAccounts
  }
}


class TokenServiceRequest {
  constructor(trackingId, data) {
    this.trackingId = trackingId
    this.data = data
  }
}

class TokenServiceResponse {
  constructor(trackingId, token) {
    this.trackingId = trackingId
    this.token = token
  }
}

class TokenService {
  tokenService(tokenServiceRequests) {
    // for each request, make a tokenized id value and create a response
    const responses = tokenServiceRequests.map((request) => {
      const tokenizedId = 'tkn_' + request.data.id // data = new Account(id, balance, sensitive)
      return new TokenServiceResponse(request.trackingId, tokenizedId)
    })

    // send back the responses
    return responses
  }
}

const accounts1 = [new Account("1234","12",true), new Account("2233","22", false), new Account("0505", "25", true)]
const response1 = Account.prototype.accountService(accounts1)

// let's assume the accountService output should be an array of tokenized? accounts
console.log(accounts1[0].id) // '1234'
console.log(response1[0].id) // 'tkn_1234'
console.log(accounts1[1].id) // '2233'
console.log(response1[1].id) // '2233'
// shapes / models
console.log(accounts1)
console.log(response1)