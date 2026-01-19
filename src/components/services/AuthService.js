import { Key } from "lucide-react";
const key = "isLoggedIn";

export const LoginUser = (payload)=>{
    const  isExist = JSON.parse(localStorage.getItem(key))
    const  existEmail = isExist ?  isExist.email : null;
    const  existPassword  = isExist ? isExist.password: null;
    if (existEmail === payload.email && existPassword === payload.password ){
        return JSON.parse(localStorage.getItem(key))
    }else{
        return false;
    }
}
export const LogoutUser = ()=>{
    localStorage.removeItem("userToken")
}

export const checkAuthStatus = ()=>{
    return localStorage.getItem("userToken") !== null
}