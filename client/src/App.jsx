import { BrowserRouter as Router } from "react-router-dom"
import HeaderComponent from "./components/HeaderComponent"
import AppRoutes from "./components/AppRoutes"
import FooterComponent from "./components/FooterComponent"

function App() {

  return (
    <Router>
      <main className="flex flex-col w-full max-w-screen min-h-screen overflow-hidden">
        <HeaderComponent />
        <AppRoutes />
        <FooterComponent />
      </main>
    </Router>
  )
}

export default App
