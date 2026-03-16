import { load } from "./db.js"
import { logout } from "./auth.js"

window.logout = logout

window.loadSports = async function(){

const data = await load("sports")

render(data)

}

window.loadSocieties = async function(){

const data = await load("societies")

render(data)

}

window.loadTeams = async function(){

const data = await load("teams")

render(data)

}

window.loadCategories = async function(){

const data = await load("categories")

render(data)

}

window.loadAthletes = async function(){

const data = await load("athletes")

render(data)

}

function render(data){

document.getElementById("content").innerHTML =
"<pre>"+JSON.stringify(data,null,2)+"</pre>"

}