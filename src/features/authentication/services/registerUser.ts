const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

interface User {
  email: string;
  lastname: String;
  firstname: String;
  fullname: String;
  password: String;
}

export class AuthService {
  static getUserByEmail = async (email: string) => {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    return existingUser;
  };

  static registerUser = async (data: User) => {
    return await prisma.user.create({
      data,
    });
  };
}
