import axios from "axios";



const create = async (data) => {
    const authToken = await localStorage.getItem("saas_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/category/createCategory`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};




const update = async (data) => {
    const authToken = await localStorage.getItem("saas_token");

    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/category/updateCategory`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
};


const getParticularRequest = async (id) => {
    const authToken = localStorage.getItem("saas_token");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/request/get/demo/request/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response
}


const addReply = async (id,data) => {
    const authToken = await localStorage.getItem("saas_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/request/${id}/reply`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};

// for getting all business unit list
const getAllList = async ({ page, keyword, perPage }) => {
    const authToken = localStorage.getItem("saas_token");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/request/get/demoRequest?keyword=${keyword}&&page=${page}&&perPage=${perPage}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response
}

const deleteOne = async ({id, page, keyword: keyWord, perPage }) => {
    const authToken = await localStorage.getItem("saas_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/request/delete/demoRequest`, {clientId: id,page, keyword: keyWord, perPage } ,{
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });

}

const activeInActive = async ({id, status ,page, keyword: keyWord, perPage}) => {
    const authToken = await localStorage.getItem("saas_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/category/activeInactiveCategory/`, {id, status ,page, keyword: keyWord, perPage}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });


};


const getAllActiveCategory = async () => {
    const authToken = localStorage.getItem("saas_token");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/category/allActiveCategory`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response.data
}





export default {
    create,
    addReply,
    getParticularRequest,
    getAllList,
    deleteOne,
    activeInActive,
    update,
    getAllActiveCategory
}