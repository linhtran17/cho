import baseApi from './base';

export default {
    news: async (params) => {
        const { data } = await baseApi.get("/news?" + (params || ""));
        return data || []
    },
    find: async (params) => {
        const { data } = await baseApi.get("/news?" + (params || ""));
        await ( new Promise(resolve => setTimeout(resolve, 500)))
        return data || []
    },
    getById: async (id) => {
        const { data } = await baseApi.get("/news/" + id);
        return data || {}
    },
    add: async (news) => {
        const { data } = await baseApi.post("/news", news);
        return data
    },
    edit: async (id, news) => {
        const { data } = await baseApi.update("/news/" + id, news);
        return data
    },
    delete: async (id) => {
        const { data } = await baseApi.delete("/news/" + news);
        return data
    },uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const { data } = await baseApi.post("/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },
}