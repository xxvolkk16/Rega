import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Content from './Components/Content'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <Header />
      <Content />
      <Footer />
      </div>
    </>
  )
}

export default App
