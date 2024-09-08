import { useState } from 'react'
import './App.css'
import Home from './pages/home/home'
import Login from './pages/login/login'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
     <Home/>
     {/* <Login/> */}
      </div>
    </>
  )
}

export default App
