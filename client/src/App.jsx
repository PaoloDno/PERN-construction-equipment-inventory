import { BrowserRouter as Router } from "react-router-dom"
import HeaderComponent from "./components/HeaderComponent"
import AppRoutes from "./components/AppRoutes"
import FooterComponent from "./components/FooterComponent"

function App() {

  return (
    <Router>
      <main>
        <HeaderComponent />
        <AppRoutes />
        <FooterComponent />
      </main>
    </Router>
  )
}

export default App
