import { borrowZodSchema } from "./../zodSchemas/borrow.zodSchema";
import express, { NextFunction, Request, Response } from "express";
import { Borrow } from "../models/borrow.model";
import { Book } from "../models/book.model";

export const borrowRoutes = express.Router();

borrowRoutes.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const borrowData = await borrowZodSchema.parseAsync(req.body);
      console.log("req.body", borrowData.dueDate);
      const targetBook = await Book.findById(borrowData.book);
      console.log(targetBook);
      if (
        targetBook &&
        Number(targetBook.copies) > 0 &&
        Number(targetBook.copies) >= borrowData.quantity &&
        targetBook.available === true
      ) {
        targetBook.copies = Number(targetBook.copies) - borrowData.quantity;
        await targetBook.save();
        const borrow = await Borrow.create(borrowData);
        await targetBook.updateBookAvailability();
        res.status(201).send({
          success: true,
          message: "Book borrowed successfully",
          data: borrow,
        });
      } else {
        res.status(400).send({
          message:
            "Something went wrong ! please check the book id and availability of book you want to borrow or contact admin for more information!",
          success: false,
        });
      }
    } catch (error: any) {
      next(error);
    }
  }
);

// 7. Borrowed Books Summary (Using Aggregation)
borrowRoutes.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const borrowedBooks = await Borrow.aggregate([
        {
          $group: {
            _id: "$book",
            totalQuantity: { $sum: "$quantity" },
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        { $unwind: "$bookDetails" },
        {
          $project: {
            _id: 0,

            //we can do it with unwind then we have to use $arrayElemAt to get the first element of the array if it gives you only one element then you can use it without unwind but if you have multiple elements then you have to use unwind
            // book: {
            //   title: { $arrayElemAt: ["$bookDetails.title", 0] },
            //   isbn: { $arrayElemAt: ["$bookDetails.isbn", 0] },
            // },

            book: {
              title: "$bookDetails.title",
              isbn: "$bookDetails.isbn",
            },
            totalQuantity: 1,
          },
        },
      ]);
      res.send({
        success: true,
        message: "Borrowed books summary retrieved successfully",
        data: borrowedBooks,
      });
    } catch (error: any) {
      next(error);
    }
  }
);
