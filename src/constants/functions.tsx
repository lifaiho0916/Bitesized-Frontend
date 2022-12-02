import CONSTANT from "./constant"

const getLocalCurrency = (currency: any) => {
    const index = CONSTANT.CURRENCIES.findIndex((cur: any) => cur.toLowerCase() === currency)
    let res = CONSTANT.CURRENCIES[index] + ' ' + CONSTANT.CURRENCY_SYMBOLS[index]
    return res
}

const getLocalPriceFromCurrency = (localCurrency: any, price: any, currency: any, currencyRate: any) => {
    if(currencyRate) {
        const usdAmount = price / (currency === 'usd' ? 1 : currencyRate[currency])
        const localPrice = usdAmount * (localCurrency === 'usd' ? 1 : currencyRate[localCurrency])
        return localPrice
    } return 0
}

export { 
    getLocalCurrency,
    getLocalPriceFromCurrency
}