import { login } from "./auth.js"

document.getElementById("loginBtn").onclick = doLogin

async function doLogin(){

const email = document.getElementById("email").value
const pass = document.getElementById("password").value

const {error} = await login(email,pass)

if(error){

document.getElementById("error").innerText = error.message
return

}

location.href="dashboard.html"

}