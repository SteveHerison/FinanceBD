import { Request, Response } from "express";
import { prisma } from "../database";

class UserController {
  static async createUser(request: Request, res: Response) {
    try {
      const { name, email } = request.body;

      // Verifica se o usuário já existe no banco de dados
      const userExists = await prisma.user.findUnique({ where: { email } });

      if (userExists) {
        return res.status(400).json({
          error: true,
          message: "Usuário já existe!",
        });
      }

      // Criação do usuário no banco de dados
      const user = await prisma.user.create({
        data: { name, email },
      });

      return res.status(201).json(user);
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      return res.status(500).json({
        error: true,
        message:
          err instanceof Error ? err.message : "Erro interno do servidor",
      });
    }
  }

  static async getUsers(request: Request, res: Response) {
    try {
      const { name, email } = request.body;

      if (!name && !email) {
        return res.status(400).json({
          error: true,
          message: "Informe o nome ou email do usuário",
        });
      }

      const users = await prisma.user.findMany({
        where: {
          OR: [{ name: name }, { email: email }],
        },
      });

      if (!users) {
        return res.status(404).json({
          error: true,
          message: "Usuário não encontrado",
        });
      }

      return res.json(users);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      return res.status(500).json({
        error: true,
        message:
          err instanceof Error ? err.message : "Erro interno do servidor",
      });
    }
  }
}

export default UserController;
