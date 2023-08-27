// 요청 인터셉터 추가하기
import axios from 'axios';
import { CONSTANTS } from '../../constants';

const axiosInstance = axios.create({
    // baseURL: CONSTANTS.API_URL,
    baseURL: 'http://localhost:8082/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

axiosInstance.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export const getApiInstance = () => {
    return axiosInstance;
};

// example
// export const signInUser = ({
//                                email,
//                                password,
//                            }: UserInputs): Promise<AxiosResponse<UserLoginResult>> => {
//     return axios.post(SIGNIN_PATH, createLoginRequestBody(email, password));
// };
