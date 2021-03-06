import axios from 'axios'

let base = 'http://47.99.166.155:3001'

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }

export const getDataList = params => { return axios.get(`${base}/data/list`, { params: params }) }

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }) }

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }) }

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }) }

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }) }

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }) }

export const changePassword = params => { return axios.post(`${base}/user/changePassword`, params).then(res => res.data) }
