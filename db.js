import { supabase } from "./supabase.js"

export async function load(table){

const {data,error} = await supabase
.from(table)
.select("*")

if(error) console.error(error)

return data

}

export async function insert(table,row){

const {error} = await supabase
.from(table)
.insert(row)

if(error) console.error(error)

}

export async function update(table,row){

const {error} = await supabase
.from(table)
.upsert(row)

if(error) console.error(error)

}

export async function remove(table,id){

const {error} = await supabase
.from(table)
.delete()
.eq("id",id)

if(error) console.error(error)

}