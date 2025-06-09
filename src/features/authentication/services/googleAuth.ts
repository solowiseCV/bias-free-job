const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

interface User {
  email: string;
  username: String;
  fullname: String;
  lastname: String;
  firstname: String;
  password: String | null;
  avatar: String | null;
  authId: String;
}

class GoogleAuthService {
  static getUserByEmail = async (email: string) => {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    return existingUser;
  };

  static getExistingUser = async (authId: string | null, email: string) => {
    const conditions: any[] = [{ email }];
    if (authId) {
      conditions.push({ authId });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: conditions,
      },
    });

    return existingUser;
  };

  static registerUser = async (data: User) => {
    return await prisma.user.create({
      data,
    });
  };
}

module.exports = new GoogleAuthService();
