import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Shorterner from './shorterner/Shorterner'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div>
       <Shorterner/>
     </div>
    </>
  )
}

export default App
