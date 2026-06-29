import {create} from "zustand"
import axiosInstance from "../lib/axios.js"
import { toast } from "react-hot-toast";

const useAuthStore = create((set) => ({

    authUser :null,
    isCheckingAuth : true,
    isSigningUp : false,
    
    checkAuth: async() => {
        try{
            const { data } = await axiosInstance.get("/auth/check");
            set({authUser: data.user });
        }catch {
            set({ authUser: null });
        }finally{
            set({isCheckingAuth:false});
        }
    },


    signup: async (data) => {
    set({ isSigningUp:true });
    try {
      const res = await axiosInstance.post("/auth/signup",data);
      set({ authUser: res.data});
      toast.success("Account Created");
    } catch (err) {
      set({ error: err.response?.data?.message });
      toast.error(err.response.data.message);
    }finally{
        set({isSigningUp:false});
    }
    },
}))


export default useAuthStore;