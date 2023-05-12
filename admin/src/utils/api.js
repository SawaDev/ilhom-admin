export default {
  getCurrentQuote: async (base, symbol) => {
    const url = `https://api.exchangerate.host/latest?base=${base}&symbols=${symbol}`

    try {
      const response = await fetch(url)
      const Data = await response.json();
      if(!Data.success) throw new Error("Error occured while getting current quote")
      return Data.rates[symbol]
    } catch (err) {
      return {error: err}
    }
  },

  getSymbols: async () => {
    const url = 'https://api.exchangerate.host/symbols'
    
    try {
      const response = await fetch(url)
      const Data = await response.json();
      if(!Data.success) throw new Error("Error occured while getting symbols")
      return Data.symbols
    } catch (err) {
      return {error: err}
    }
  },

  getTimeSeries: async (startDate, endDate, base, symbol) => {
    const url = `https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}&base=${base}&symbols=${symbol}`

    try {
      const response = await fetch(url)
      const Data = await response.json();
      if(!Data.success) throw new Error("Error occured while getting time series")
      return Data.rates
    } catch (err) {
      return {error: err}
    }
  },
}