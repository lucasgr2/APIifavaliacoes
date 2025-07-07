import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseURL = process.env.SUPABASE_URL ;
const supoabaseKEY = process.env.SUPABASE_ANON_KEY ;
const supabase = createClient(supabaseURL, supoabaseKEY, {
    auth:{
        persistSession: false
    }
})

export  {supabase};