// import React, {createContext, useContext, useEffect, useState} from 'react'
// import {
//     createUserWithEmailAndPassword,
//     SignInWithEmailAndPassword,
//     onAuthStateChanged,
//     SignOut
// } from "firebase/auth"

// import {auth} from '../firebase'

// const userAuthContext = createContext

// export function userAuthContextProvider({ children }){
   
//    const [user,setUser] = useState({});

//    function login(email,password){
//     return SignInWithEmailAndPassword(auth,email,password);
//    }

//    function signUp(email,password){
//     return createUserWithEmailAndPassword(auth,email,password);
//    }

//    function logout(){
//     return SignOut(auth);
//    }

//    useEffect(()=>{

//     const unsubscribe = onAuthStateChanged(auth,(currentuser)=>{
//         console.log("Auth",currentuser);
//         setUser(currentuser);
//     })

//     return () => {
//         unsubscribe();
//     }

//    }, [])

//     return(
//         <userAuthContext.Provider value ={{user,login,signUp,logout}}>
//             {children}
//         </userAuthContext.Provider>
//     )
// }

// export function useUserAuth(){
//     return useContext(userAuthContext);
// }


import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { auth } from '../firebase';

const userAuthContext = createContext(); // เรียกใช้ createContext เป็นฟังก์ชัน

export function UserAuthContextProvider({ children }) {
    const [user, setUser] = useState(null); // แก้เป็น null แทน object เปล่า

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // เปลี่ยนชื่อ logout เป็น logOut เพื่อให้ตรงกับที่ใช้ใน Navbar
    function logOut() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth", currentUser);
            setUser(currentUser);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <userAuthContext.Provider value={{ user, login, signUp, logOut }}>
            {children}
        </userAuthContext.Provider>
    );
}

export function useUserAuth() {
    return useContext(userAuthContext);
}




