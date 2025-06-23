
static async updateSeeker(userId: string, data: UpdateJobSeekerDto) {
    return await prisma.jobSeeker.update({
      where: { userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }