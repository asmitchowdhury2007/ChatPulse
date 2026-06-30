import {create} from "zustand"
import axiosInstance from "../lib/axios.js"
import { toast } from "react-hot-toast";

const useContactStore = create((set)=>({
    contacts:[],
    isLoadingContacts : false,

    getAllContacts : async() =>{
        set({isLoadingContacts:true})
        try{
            
            const res = await axiosInstance.get("/messages/contacts");
            
            set({contacts : res.data.contacts});
            
            
            toast.success("Contacts Details are follows");
        }catch(err){
            toast.error("Failed to Get Contacts");
        }finally{
            set({isLoadingContacts:false});
        }
    }


}))

export default useContactStore