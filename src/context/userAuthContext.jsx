import React, {createContext, useContext, useEffect, useState} from 'react'
import {
    createUserWithEmailAndPassword,
    SignInWithEmailAndPassword,
    onAuthStateChanged,
    SignOut
} from "firebase/auth"

import {auth} from '../firebase'

const userAuthContext = createContext

export function userAuthContextProvider({ children }){
   
   const [user,setUser] = useState({});

   function login(email,password){
    return SignInWithEmailAndPassword(auth,email,password);
   }

   function signUp(email,password){
    return createUserWithEmailAndPassword(auth,email,password);
   }

   function logout(){
    return SignOut(auth);
   }

   useEffect(()=>{

    const unsubscribe = onAuthStateChanged(auth,(currentuser)=>{
        console.log("Auth",currentuser);
        setUser(currentuser);
    })

    return () => {
        unsubscribe();
    }

   }, [])

    return(
        <userAuthContext.Provider value ={{user,login,signUp,logout}}>
            {children}
        </userAuthContext.Provider>
    )
}

export function useUserAuth(){
    return useContext(userAuthContext);
}
