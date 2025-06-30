import axios from "axios";




const getAllList = async ({ page, keyword, perPage }) => {
    const authToken = localStorage.getItem("saas_token");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/query/get/query?keyword=${keyword}&&page=${page}&&perPage=${perPage}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response
}


// const update = async (data) => {
//     const authToken = await localStorage.getItem("saas_token");

//     return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/category/updateCategory`, data, {
//         headers: {
//             Authorization: `Bearer ${authToken}`,
//         }

//     });
// };


const getParticularQuery = async (id) => {
    const authToken = localStorage.getItem("saas_token");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/query/get/query/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }

    });
    return response
}


const addReply = async (id,data) => {
    const authToken = await localStorage.getItem("saas_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/query/${id}/reply`, data, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });
};



const deleteOne = async ({id, page, keyword: keyWord, perPage }) => {
    const authToken = await localStorage.getItem("saas_token");
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/query/delete/query`, {clientId: id,page, keyword: keyWord, perPage } ,{
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    });

}

// const activeInActive = async ({id, status ,page, keyword: keyWord, perPage}) => {
//     const authToken = await localStorage.getItem("saas_token");
//     return await axios.post(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/category/activeInactiveCategory/`, {id, status ,page, keyword: keyWord, perPage}, {
//         headers: {
//             Authorization: `Bearer ${authToken}`,
//         }

//     });


// };


// const getAllActiveCategory = async () => {
//     const authToken = localStorage.getItem("saas_token");
//     const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/superAdmin/category/allActiveCategory`, {
//         headers: {
//             Authorization: `Bearer ${authToken}`,
//         }

//     });
//     return response.data
// }





export default {
    getAllList,
    getParticularQuery,
    addReply,
    deleteOne
   
}