import { Request, Response } from "express";
import { UserService } from "./service";
import { UpdateUserDTO } from "./dto";
import {
  updateUserSchema,
  paginationSchema,
  userIdSchema,
} from "../../validations/user.validation";
import configureCloudinary from "../../configs/cloudinary";
import { getDataUri, FileData } from "../../middlewares/multer";
import CustomResponse from "../../utils/helpers/response.util";
export class UserController {
  static async getUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = userIdSchema.safeParse(req.params);
      if (!validationResult.success) {
        new CustomResponse(
          400,
          false,
          "Invalid user ID",
          res,
          validationResult.error
        );
        return;
      }

      const { userId } = validationResult.data;

      const user = await UserService.getUserDetails(userId);

      if (!user) {
        new CustomResponse(404, false, "User not found", res);
        return;
      }
      new CustomResponse(
        200,
        true,
        "User details retrieved successfully",
        res,
        user
      );
    } catch (error) {
      new CustomResponse(
        500,
        false,
        "Internal server error",
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  // Get all users with pagination
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = paginationSchema.safeParse(req.query);

      if (!validationResult.success) {
        new CustomResponse(
          400,
          false,
          "Invalid pagination parameters",
          res,
          validationResult.error
        );
        return;
      }

      const { page, limit } = validationResult.data;

      const result = await UserService.getAllUsers(page, limit);
      new CustomResponse(
        200,
        true,
        "All users retrieved successfully",
        res,
        result
      );
    } catch (error) {
      new CustomResponse(
        500,
        false,
        "Internal server error",
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  // Update user details
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userIdValidation = userIdSchema.safeParse(req.params);

      if (!userIdValidation.success) {
        new CustomResponse(
          400,
          false,
          "Invalid user ID",
          res,
          userIdValidation.error
        );
        return;
      }

      const { userId } = userIdValidation.data;

      // Validate request body
      const validationResult = updateUserSchema.safeParse(req.body);

      if (!validationResult.success) {
        new CustomResponse(
          400,
          false,
          "Invalid update data",
          res,
          validationResult.error
        );
        return;
      }

      const updateData = validationResult.data;

      // Check if at least one field is provided for update
      if (Object.keys(updateData).length === 0) {
        new CustomResponse(400, false, "No fields provided for update", res);
        return;
      }

      const updatedUser = await UserService.updateUser(userId, updateData);

      new CustomResponse(
        200,
        true,
        "User updated successfully",
        res,
        updatedUser
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not found") {
          new CustomResponse(404, false, error.message, res);
          return;
        }
        if (error.message === "Email already exists") {
          new CustomResponse(409, false, error.message, res);
          return;
        }
      }

      new CustomResponse(
        500,
        false,
        "Internal server error",
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  // Delete user
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = userIdSchema.safeParse(req.params);

      if (!validationResult.success) {
        new CustomResponse(
          400,
          false,
          "Invalid user ID",
          res,
          validationResult.error
        );
        return;
      }

      const { userId } = validationResult.data;

      await UserService.deleteUser(userId);
      new CustomResponse(200, true, "User deleted successfully", res);
    } catch (error) {
      if (error instanceof Error && error.message === "User not found") {
        new CustomResponse(404, false, error.message, res);
        return;
      }

      new CustomResponse(
        500,
        false,
        "Internal server error",
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  // Get current user details (from authenticated user)
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;

      if (!userId) {
        new CustomResponse(401, false, "User not authenticated", res);
        return;
      }

      const user = await UserService.getUserDetails(userId);

      if (!user) {
        new CustomResponse(404, false, "User not found", res);
        return;
      }

      new CustomResponse(
        200,
        true,
        "Current user details retrieved successfully",
        res,
        user
      );
    } catch (error) {
      new CustomResponse(
        500,
        false,
        "Internal server error",
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async updateAvatar(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!req.file) {
        new CustomResponse(400, false, "No file uploaded", res);
        return;
      }
      const updatedUser = await UserService.updateAvatar(userId, req.file);

      new CustomResponse(
        200,
        true,
        "Avatar updated successfully",
        res,
        updatedUser
      );
    } catch (error) {
      new CustomResponse(
        500,
        false,
        "Failed to update avatar",
        res,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
}
