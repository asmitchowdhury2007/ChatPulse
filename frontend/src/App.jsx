
import { Routes, Route } from "react-router" 
import ChatPage from "./pages/ChatPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import useAuthStore from "./Store/AuthStore.js"

function App() {
  const { login } = useAuthStore()
  return (
  <>
  
    <button onClick={login} className="z-10">
      login
    </button>
    <Routes>
      <Route path="/"       element={<ChatPage />} />
      <Route path="/login"  element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  
  </>
  )
}

export default App;