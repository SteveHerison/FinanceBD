import express, { Request, Response, NextFunction } from "express";
import UserController from "./controllers/UserController";

const app = express();
app.use(express.json());
const PORT = 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Port 3001");
});

// Envolver a função assíncrona em um middleware adequado
app.post(
  "/createUser",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserController.createUser(req, res);
    } catch (error) {
      next(error); // Passar o erro para o middleware de erro do Express
    }
  }
);

app.get("/Users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserController.getUsers(req, res);
  } catch (error) {
    next(error);
  }
});

// Middleware de tratamento de erro
app.use((req: Request, res: Response) => {
  console.error("Erro no servidor:");
  res.status(500).json({ error: true, message: "Erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
