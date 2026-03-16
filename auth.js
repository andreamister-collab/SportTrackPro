import { supabase } from "./supabase.js"

export async function login(email,password){

const {data,error} = await supabase.auth.signInWithPassword({
email,
password
})

return {data,error}

}

export async function logout(){

await supabase.auth.signOut()

location.href="index.html"

}

export async function getUser(){

const {data} = await supabase.auth.getUser()

return data.user

}