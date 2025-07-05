import express, { Application, NextFunction, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/book.controller";
import { ZodError } from "zod";
import { borrowRoutes } from "./app/controllers/borrow.controller";
import cors from "cors";
const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://library-management-system-client-indol.vercel.app",
    ],
    credentials: true
  })
);

app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send("Welcome to the Library Management System API!");
  } catch (error) {
    next(error);
  }
});

// 404 handler for unmatched routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({
    message: "Route not found",
    success: false,
    error: {
      message: "Route not found",
    },
  });
});

// global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    // Handle Zod validation errors
    const messages = error.issues.map((issue) => issue.message);
    res.status(400).send({
      message: messages.join("; "),
      success: false,
      error: {
        issues: error.issues,
        name: error.name,
      },
    });
  } else {
    res.status(400).send({
      message: error.message || "An unexpected error occurred",
      success: false,
      error: error,
    });
  }
});

export default app;
