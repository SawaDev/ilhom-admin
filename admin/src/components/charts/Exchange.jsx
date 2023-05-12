import { useEffect, useState } from 'react'
import api from '../../utils/api'
import Rates from './Rates';

const Exchange = () => {
  const [data, setData] = useState('');
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [value, setValue] = useState(1);
  const [convertedValue, setConvertedValue] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0)
  const [base, setBase] = useState('USD')
  const [symbol, setSymbol] = useState('UZS')
  const [symbols, setSymbols] = useState({
    "UZS": {
      "description": "Uzbekistan Som",
      "code": "UZS"
    },
    "USD": {
      "description": "United States Dollar",
      "code": "USD"
    },
  })

  useEffect(() => {
    api.getCurrentQuote(base, symbol)
      .then(response => {
        if (response.error) console.log(response.error)
        else setCurrentQuote(response)
      })
  }, [base, symbol])

  useEffect(() => {
    setConvertedValue(value * currentQuote)
  }, [value, currentQuote])

  useEffect(() => {
    const date = new Date()
    const year = date.getFullYear()
    const endMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const endFullDate = `${year}-${endMonth}-${day}`
    setEndDate(endFullDate)

    const startMonth = date.getMonth().toString().padStart(2, '0');
    const startFullDate = `${startMonth === '00' ? year - 1 : year}-${startMonth === '00' ? '12' : startMonth}-${day}`

    setStartDate(startFullDate)
  }, [])

  useEffect(() => {
    api.getTimeSeries(startDate, endDate, base, symbol)
      .then(response => {
        if (response.error) console.log(response.error)
        else setData(response)
      })
  }, [startDate, endDate, base, symbol])

  useEffect(() => {
    api.getSymbols()
      .then(response => {
        if (response.error) console.log(response.error)
        else setSymbols(response)
      })
  }, [])

  const listClass = "flex flex-col items-start pr-1 pl-1 mb-1"
  return (
    <div className="flex flex-col gap-10 p-6">
      {/* <div className='w-full z-0 md:p-5' style={{ height: 340, zIndex: 0 }}> */}
      <div className='relative'>
        <div className='absolute top-0 -left-10 sm:left-0 w-full' style={{ height: 340, zIndex: 0 }}>
          <Rates data={data} symbol={symbol} />
        </div>
      </div>

      {/* </div> */}
      <ul className="grid grid-cols-2 w-full mt-[340px]">
        <li className="flex flex-col items-start  pr-1 pl-1 mb-2">
          <label htmlFor="start-date" className="mr-3 w-30">Initial Date</label>
          <input className="w-full bg-gray-100 p-3" type="date" name="start-date" value={startDate} onChange={event => setStartDate(event.target.value)} />
        </li>
        <li className={listClass}>
          <label htmlFor="end-date" className="mr-3 w-30">Final date</label>
          <input className="w-full bg-gray-100 p-3" type="date" name="end-date" value={endDate} onChange={event => setEndDate(event.target.value)} />
        </li>
        <li className={listClass}>
          <label htmlFor="from" className="mr-3 w-30">From</label>
          <select className="w-full bg-gray-100 p-3" name="from" id="from" value={base} onChange={event => setBase(event.target.value)}>
            {Object.keys(symbols).map(key => (
              <option value={key} key={key}>{symbols[key].description}</option>
            ))}
          </select>
        </li>
        <li className={listClass}>
          <label htmlFor="to" className="mr-3 w-30">To</label>
          <select className="w-full bg-gray-100 p-3" name="to" id="to" value={symbol} onChange={event => setSymbol(event.target.value)}>
            {Object.keys(symbols).map(key => (
              <option value={key} key={key}>{symbols[key].description}</option>
            ))}
          </select>
        </li>
        <li className={listClass}>
          <label htmlFor="value" className="mr-3 w-30">Value</label>
          <input className="w-full bg-gray-100 p-3" type="number" value={value} onChange={event => setValue(event.target.value)} />
        </li>
        <li className={listClass}>
          <label htmlFor="convertedValue" className="mr-3 w-30">Converted Value</label>
          <span className="w-full bg-gray-100 p-3">{convertedValue}</span>
        </li>
      </ul>
    </div>
  )
}

export default Exchange