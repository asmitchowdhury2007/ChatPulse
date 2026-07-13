
import { Routes, Route,Navigate } from "react-router" 
import ChatPage from "./Pages/ChatPage.jsx"
import LoginPage from "./Pages/LoginPage.jsx"
import SignupPage from "./Pages/SignUpPage.jsx"
import {useAuthStore} from "./Store/useAuthStore.js"
import { useEffect } from "react"
import {Toaster} from "react-hot-toast"

function App() {
  const { authUser, isCheckingAuth, checkAuth} = useAuthStore();
  useEffect(() => {
    
    checkAuth()
  },[checkAuth])
 

  if (isCheckingAuth) return ;
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