// import Header from "./pages/Header"

import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {


  return (
    <main>
      <Header />
      <div className="">
        <Outlet />
      </div>

      <Footer />


    </main>
  )
}

export default App
