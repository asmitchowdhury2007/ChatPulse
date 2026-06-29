import React from 'react'
import AuthLayout from "../components/AuthLayout.jsx"
import useAuthStore from "../Store/AuthStore.js"

function ChatPage() {
  const { logout,} = useAuthStore()
  return (
    <div>
      <AuthLayout>
      
      </AuthLayout>
    </div>
  )
}

export default ChatPage
