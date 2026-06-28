import {create} from "zustand"

const useAuthStore = create((set) => ({

    authUser : {name: "John", _id : "123", age:25},
    isLoggedIn : false,
    isLoading: false,
    login : () => {
        console.log(" loggedIn");
        set({isLoggedIn:true,isLoading:true});
    }
}))
export default useAuthStore