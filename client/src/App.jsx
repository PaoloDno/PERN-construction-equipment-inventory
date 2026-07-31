import { BrowserRouter as Router } from "react-router-dom"
import HeaderComponent from "./components/HeaderComponent"
import AppRoutes from "./components/AppRoutes"

function App() {

  return (
    <Router>
      <main>
        <HeaderComponent />
        <AppRoutes />
      </main>
    </Router>
  )
}

export default App
