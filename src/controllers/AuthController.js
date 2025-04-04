import { supabase } from "../database/supaBaseConection.js";
import jwt from "jsonwebtoken"


const { JWT_SECRET, JWT_EXPIRATION } = process.env;

class AuthController {

  async signin(req, res) {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        res.status(400);
        return;
      }
      let response = await supabase.from("Usuarios").select("*").eq("email",email).limit(1).single();
      let {data} = response;
      if (!data) {
        throw new Error("Email ou Senha inválidos");
      }
      //const isMatch = await bcrypt.compare(password, nextUser.password);
      if (data.senha !== senha) {
        throw new Error("Email ou Senha inválidos");
      }
      // Passando pelas verificações hora de gerar o token do usuário
    const token = jwt.sign({id:data.id,email: data.email}, JWT_SECRET,{
        expiresIn: JWT_EXPIRATION
        })

      res.status(200).send({ token:token });
    } catch (err) {
      console.error("POST auth/signin, Something Went Wrong:", err);
      res.status(400).send({ error: true, message: err.message });
    }
  }

  async getCurrentUser(req, res) {
    const defaultReturnObject = { authenticated: false, user: null };
    try {
      const token = String(req.headers.authorization?.replace("Bearer ", ""));
      const decoded = jwt.verify(token, JWT_SECRET);
      const response = await supabase.from("Usuarios").select("*").eq("email",decoded.email).limit(1).single();
      const {data} = response;
      if (!data) {
        throw new Error("Usuario não autenticado");
      }
      delete data.senha;
      res.status(200).send({ authenticated: true, user:data });
    } catch (err) {
      console.error("GET auth/me, Something Went Wrong:", err);
      res.status(400).json(defaultReturnObject);
    }
  }
}

export default AuthController;

