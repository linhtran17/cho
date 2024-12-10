import baseApi from './base';

export default {
    pets: async (params) => {
        const { data } = await baseApi.get("/products?" + (params || ""));
        return data || []
    },
    pet: async (id) => {
        const { data } = await baseApi.get("/products/" + id);
        return data
    },
    ourPet: async () => {
        const { data } = await baseApi.get("/our-pet");
        return data || []
    },
    hots: async () => {
        const { data } = await baseApi.get("/hots");
        return data || []
    },
    add: async (pet) => {
        const { data } = await baseApi.post("/products", pet);
        return data
    },
    edit: async (id, pet) => {
        const { data } = await baseApi.update("/products/" + id, pet);
        return data
    },
    delete: async (id) => {
        const { data } = await baseApi.delete("/products/" + id);
        return data
    },
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await baseApi.post("/media/upload", formData);
        return data;
    },
}