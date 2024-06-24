import {axiosInstance} from "@/helpers/axios";
import {toast} from "sonner";
import {Genre} from "@/types";

export const createGenre = (requestData: { name: string, bookIds: number[] }) => {
    axiosInstance.post("/genres/add", requestData)
        .then(() => toast("Genre created successfully", {
            action: {
                label: "Close",
                onClick: () => console.log("Closed")
            }
        }))
        .catch((error) => {
            toast.error("Error creating genre: " + error.message, {
                action: {
                    label: "Close",
                    onClick: () => console.log("Closed")
                }
            });
            console.error(error);
        });
}

export const updateGenre = (id: number, requestData: { name?: string, bookIds?: number[] }) => {
    axiosInstance.put(`/genres/edit/${id}`, requestData)
        .then(() => toast("Genre updated successfully", {
            action: {
                label: "Close",
                onClick: () => console.log("Closed")
            }
        }))
        .catch((error) => console.error(error))
}

export const getGenres = async (): Promise<Genre[]> => {
    try {
        const response = await axiosInstance.get('/genres');
        return response.data;
    } catch (error) {
        // console.error('Error fetching genres:', error);
        toast.error("Error fetching data: " + error, {
            action: {
                label: "Close",
                onClick: () => console.log("Closed")
            }
        });
        throw error;
    }
};

export const getGenreById = async (id: number): Promise<Genre> => {
    try {
        const response = await axiosInstance.get(`/genres/genre/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching genre:', error);
        throw error;
    }
}

export const deleteGenre = (id: number) => {
    axiosInstance.delete(`/genres/delete/${id}`)
        .then(() => toast("Genre deleted successfully", {
            action: {
                label: "Close",
                onClick: () => console.log("Closed")
            }
        }))
        .catch((error) => console.error(error))
}