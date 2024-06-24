// import {axiosInstance} from "@/src/helpers/axios";
//
// export const register = (requestData: { username: string, email: string, password: string }) => {
//     axiosInstance.post("/auth/signup", requestData)
//         .then(() => console.log("User registered successfully"))
//         .catch((error: any) => {
//             console.error("Error registering user: " + error.message);
//         });
// }

// export const updateAuthor = (id: number, requestData: { name?: string, bookIds?: number[] }) => {
//     axiosInstance.put(`/authors/edit/${id}`, requestData)
//         .then(() => toast("Author updated successfully", {
//             action: {
//                 label: "Close",
//                 onClick: () => console.log("Closed")
//             }
//         }))
//         .catch((error) => console.error(error))
// }
//
// export const getAuthors = async (): Promise<Author[]> => {
//     try {
//         const response = await axiosInstance.get('/authors');
//         return response.data;
//     } catch (error) {
//         // console.error('Error fetching authors:', error);
//         toast.error("Error fetching data: " + error, {
//             action: {
//                 label: "Close",
//                 onClick: () => console.log("Closed")
//             }
//         });
//         throw error;
//     }
// };
//
// export const getAuthorById = async (id: number): Promise<Author> => {
//     try {
//         const response = await axiosInstance.get(`/authors/author/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching author:', error);
//         throw error;
//     }
// }
//
// export const deleteAuthor = (id: number) => {
//     axiosInstance.delete(`/authors/delete/${id}`)
//         .then(() => toast("Author deleted successfully", {
//             action: {
//                 label: "Close",
//                 onClick: () => console.log("Closed")
//             }
//         }))
//         .catch((error) => console.error(error))
// }