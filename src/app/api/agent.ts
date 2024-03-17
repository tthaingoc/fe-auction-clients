import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = 'https://localhost:5001/api/';
axios.defaults.withCredentials = true;

const sleep = () => new Promise(resolve => setTimeout(resolve, 500))
const responseBody = (response: AxiosResponse) => response.data;

//using ..  error handling
axios.interceptors.response.use(async response => {
    await sleep();
    return response
}, (error: AxiosError) => {
    const {data, status} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (data.errors) {
                const modelStateErrors: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string,body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}
const Catalog = {
    list: () => requests.get('RealEstate'),
    getValidationError: () => requests.get('RealEstate'),
    details: (id: number) => requests.get(`RealEstate/${id}`)
}
const Auction = {
    list: () => requests.get('Auction/TodayAuction'),
    getValidationError: () => requests.get('Auction/TodayAuction'),
    details: (id: number) => requests.get(`Auction/TodayAuction/${id}`)
}

const Order = {
    get: () => requests.get('orders'),
    addItem: (productId: number) => requests.post(`orders?id=${productId}`, {}),
    removeItem: (productId: number) => requests.delete(`orders?id=${productId}`)
}
const Account = {
    login: (values: any) => requests.post('Account/Login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser')
}


const agent ={
    Catalog,
    Auction,
    Order,
    Account
}

export default agent;