import {create} from "zustand"
import axiosInstance from "../lib/axios.js"


const useAuthStore = create((set) => ({

    authUser :null,
    isCheckingAuth : true,
    
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


    signup: async (fullname, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/auth/signup", {
        fullname,
        email,
        password,
      });
      set({ authUser: data.user, isLoading: false });
      toast.success("Account Created");
    } catch (err) {
      set({ error: err.response?.data?.message || "Signup failed", isLoading: false });
      toast.error(err.response.data.message);
    }finally{
        set({isLoading:false});
    }
    },
}))


export default useAuthStore;