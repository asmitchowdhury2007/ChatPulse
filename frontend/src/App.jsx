
import { Routes, Route,Navigate } from "react-router" 
import ChatPage from "./pages/ChatPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import useAuthStore from "./Store/AuthStore.js"
import { useEffect } from "react"
import {Toaster} from "react-hot-toast"

function App() {
  const { authUser, isCheckingAuth, checkAuth} = useAuthStore();
  useEffect(() => {
    checkAuth()
  },[checkAuth])
  
  if (isCheckingAuth) return null 
  return (
  <>
  
    
    <Routes>
      <Route path="/"       element={ authUser ? <ChatPage /> :  <Navigate to="/login" />} />
      <Route path="/login"  element={!authUser? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/signup" element={!authUser ?<SignupPage /> : <Navigate to="/" />} />
    </Routes>
    <Toaster/>
  </>
  )
}

export default App;