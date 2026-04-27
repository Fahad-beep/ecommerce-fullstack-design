import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainLayout from "./components/Layout/MainLayout"
import HomePage from "./pages/HomePage"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={MainLayout()}>
          <Route path="/" element={HomePage()}/>
        </Route>
      </Routes>
    </BrowserRouter>    
  )
}

export default App
