import {axiosInstance} from "@/helpers/axios";
import {Book} from "@/types";
import {toast} from "sonner";

export const createBook = (requestData: {
    title: string,
    description: string,
    authorIds: number[],
    genreIds: number[],
    ISBN: string
}) => {
    axiosInstance.post("/books/add", requestData)
        .then(() => toast("Book created successfully", {
            action: {
                label: "Close",
                onClick: () => console.log("Closed")
            }
        }))
        .catch((error) => {
            toast.error("Error creating book: " + error.message, {
                action: {
                    label: "Close",
                    onClick: () => console.log("Closed")
                }
            });
            console.error(error);
        });
}

export const updateBook = (id: number, requestData: {
    title?: string,
    description?: string,
    authorIds?: number[],
    genreIds?: number[],
    ISBN?: string
}) => {
    axiosInstance.put(`/books/edit/${id}`, requestData)
        .then(() => toast("Book updated successfully", {
            action: {
                label: "Close",
                onClick: () => console.log("Closed")
            }
        }))
        .catch((error) => {
            toast.error("Error updating book: " + error.message, {
                action: {
                    label: "Close",
                    onClick: () => console.log("Closed")
                }
            });
            console.error(error);
        })
}

export const getBooks = async (): Promise<Book[]> => {
    try {
        const response = await axiosInstance.get('/books');
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}

export const getBookById = async (id: number): Promise<Book> => {
    try {
        const response = await axiosInstance.get(`/books/book/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching book:', error);
        throw error;
    }
};

export const deleteBook = (id: number) => {
    axiosInstance.delete(`/books/delete/${id}`)
        .then(() => toast("Book deleted successfully", {
            action: {
                label: "Close",
                onClick: () => console.log("Closed")
            }
        }))
        .catch((error) => console.error(error))
}