import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseURL = process.env.URL ;
const supoabaseKEY = process.env.KEY ;
const supabase = createClient(supabaseURL, supoabaseKEY, {
    auth:{
        persistSession: false
    }
})

export  {supabase};