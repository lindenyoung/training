class AccountTokenization {
  constructor(id, balance, sensitive) {
    this.id = id;
    this.balance = balance;
    this.sensitive = sensitive;
  }

  // THIS IS BLANK
  accountService(accounts) { // O(n + m) time - the find method takes m time, but does not depend on length of accounts array so not quadratic
    const updatedAccounts = accounts.map((account) => new AccountTokenization(account.id, account.balance, account.sensitive))
    const sensitiveAccounts = updatedAccounts.filter((account) => account.sensitive === true)
    const requests = sensitiveAccounts.map((account) => new TokenServiceRequest(account.id, account))
    const responses = TokenService.prototype.tokenService(requests)

    for (const account of sensitiveAccounts) {
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

// THIS IS BLANK
class TokenService { // O(n) time
  tokenService(tokenServiceRequests) {
    const responses = tokenServiceRequests.map((request) => {
      const token = 'tkn_' + request.data.id
      return new TokenServiceResponse(request.trackingId, token)
    })

    return responses
  }
}

const accounts1 = [new AccountTokenization("1234",12,true), new AccountTokenization("2233",22, false)]
const response1 = AccountTokenization.prototype.accountService(accounts1)
// this should be true:
// 'tkn_' + accounts[0].id === response[0].id
console.log(accounts1[0].id) // '1234'
console.log(response1[0].id) // 'tkn_1234'



/* BANK ACCOUNT OOP PROBLEM */

// do this next!