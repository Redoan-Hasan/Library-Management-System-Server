import { Model, model, Schema } from "mongoose";
import { bookInstanceMethod, IBook } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook, Model<IBook, {}, bookInstanceMethod>>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
      type: String,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
      required: true,
      uppercase: true,
    },
    isbn: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    copies: {
      type: Number,
      min: 0,
      required: true,
      validate: {
        validator: function (value: number) {
          return Number.isInteger(value);
        },
        message: (props) => `Copies must be an integer, got ${props.value}`,
      },
    },
    available: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

//instance method
bookSchema.method("updateBookAvailability", async function () {
  if (this.copies === 0) {
    this.available = false;
    await this.save();
  }
  else if(Number(this.copies) > 0){
    this.available = true;
    await this.save();
  }
});

//hooks 
bookSchema.pre("save", function (next) {
  console.log(`Book "${this.title}" is about to be saved.`);
  next();
});

bookSchema.post("save", function (doc) {
  console.log(`Book "${doc.title}" was saved.`);
});

export const Book = model<IBook, Model<IBook, {}, bookInstanceMethod>>(
  "Book",
  bookSchema
);
