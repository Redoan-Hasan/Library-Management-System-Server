export interface IBook {
    title: string;
    author : string;
    genre: "FICTION" | "NON_FICTION" | "SCIENCE" | "HISTORY" | "BIOGRAPHY" | "FANTASY";
    isbn: string;
    description: string;
    copies: Number;
    available: boolean;
}   

export interface bookInstanceMethod {
    updateBookAvailability(): boolean;
}