import {create} from "zustand"
import axiosInstance from "../lib/axios.js"
import { toast } from "react-hot-toast";

const useAuthStore = create((set) => ({

    authUser :null,
    isCheckingAuth : true,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingPic:false,
    
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

    login: async (data) => {
        set({ isLoggingIn:true });
    try {
      const res = await axiosInstance.post("/auth/login",data);
      set({ authUser: res.data});
      toast.success("LoggedIn Successfully");
    } catch (err) {
      set({ error: err.response.data.message });
      toast.error(err.response.data.message);
    }finally{
        set({isLoggingIn:false});
    }
    },

    logout : async() => {
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged Out Successfully")
        } catch(err){
            toast.error("Error Logging Out");
        }
    },

    updateProfilePic: async (base64Image) => {
        set({ isUpdatingPic: true });
        try {
            const res = await axiosInstance.put("/auth/profilePic", { profilePic: base64Image });
            // store the cloudinary URL inside authUser
            set((state) => ({
                authUser: { ...state.authUser, profilePic: res.data.profilePic }
            }));
            toast.success("Profile photo updated!");
            return res.data.profilePic   // return URL so UI can use it
        } catch (err) {
            toast.error("Failed to update profile photo");
        } finally {
            set({ isUpdatingPic: false });
        }
    },
}))


export default useAuthStore;