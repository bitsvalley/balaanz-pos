export const endpoints = {
    login: 'posLogin',
    logout: 'logout',
    adminlogin :'token',
    runTimeProperty: 'getRunTimeSetting/',
    validatePin: 'validatePin',
    getToken: 'getAccessToken',
    getUserDetails: 'getUserDetails',
    dailySavingAccount: 'dailySavingAccount',
    //mobilePay: "mobilepay/client/api/",
    //paymentLogin: "authentication/api/oauth/token",
    momoAuth: "getMomoAuth",
    //providerInfo: "payments/subscriber/info/",
    getProviderInfo: "getProviderInfo/",
    //disburse: "payments/disburse",
    momoDisburse: "momoDisburse",
    //collect: "payments/collect"

    newproductadd: 'api/v1/pos/product',
    editproduct:  'api/v1/pos/product',
    sales: '/api/v1/pos/product/topSold',

    // Java Rest Enpoint
    searchCustomer: "api/v1/user/",
    disburseAmount: "api/v1/dailySavingAccount/registerDailySavingAccountTransactionForm",
    getCutomerACInfo: "api/v1/dailySavingAccount/details/",
    getCustomerTransaction: "api/v1/dailySavingAccount/transactions/",
    createCustomer: "api/v1/userRoot",
    getAgentTransaction: "api/v1/dailySavingAccount/agentHistory?userId=",
    getAgentStat: "api/v1/dailySavingAccount/stats?userId=",
    createDailySavingAccount: "api/v1/dailySavingAccount/registerDailySavingAccountForm",
    userInfo: 'api/v1/user/',
    productList: 'api/v1/pos/products',
    payment: "api/v1/payment/pay",
    paymentStatus: "api/v1/payment/status/"
}