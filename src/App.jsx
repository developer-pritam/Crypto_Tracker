
import { useState } from 'react'
import './App.css'
import Home from './Pages/Home';
import { currencyContext } from './context/currencyContext';


function App() {

  const [currency , SetCurrency] = useState("usd");  //global data store
  return (
    <>
    <currencyContext.Provider value= { {currency , SetCurrency}}>
        <Home/>
    </currencyContext.Provider>

    </>
  )
}

export default App
