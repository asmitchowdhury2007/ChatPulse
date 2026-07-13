import { io } from "socket.io-client";
import { create } from "zustand";
import  axiosInstance  from "../lib/axios.js";
import toast from "react-hot-toast";


const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:9000/api"
  : import.meta.env.VITE_API_URL/api;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingPic:false,
  onlineUsers: [],
  socket : null,
 

  checkAuth: async () => {
    
    try {
      const res = await axiosInstance.get("/auth/check");
      
      set({ authUser: res.data});
      get().ConnectSocket();
    } catch (error) {
      
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!");
      get().ConnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully");
      get().ConnectSocket();
      
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      
    }
  },

  updateProfile: async (data) => {
    set({isUpdatingPic:true})
    try {
      const res = await axiosInstance.put("/auth/profilePic", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
      get().ConnectSocket();
    } catch (error) {
      
      toast.error(error.response.data.message);
    } finally{
      set({isUpdatingPic:false});
    }
  },

  ConnectSocket : () => {
    const {authUser} = get();
    if (! authUser || get().socket?.connected) return 
    const socket = io(BASE_URL,{
      withCredentials : true,
    })
    socket.connect();
    set({socket});


    socket.on("getOnlineUsers", (userIds)=>{
      set({onlineUsers: userIds});
    })
  },
  disconnectSocket : () => {
    if(get().socket.connected){
      get().socket.disconnect();
    }
  }
  
}));