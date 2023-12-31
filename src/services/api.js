import axios from "../utils/axios-customize";

export const callRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};

export const callLogin = (username, password) => {
  return axios.post("/api/v1/auth/login", { username, password });
};

export const callFetchAccount = () => {
  return axios.get("/api/v1/auth/account");
};

export const callLogout = () => {
  return axios.post("/api/v1/auth/logout");
};

export const callFetchListUser = (query) => {
  return axios.get(`/api/v1/user?${query}`);
};

export const callCreateUser = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};

export const callBulkCreateUser = (data) => {
  return axios.post("/api/v1/user/bulk-create", data);
};

export const callUpdateUser = (_id, fullName, phone) => {
  return axios.put("/api/v1/user", {
    _id,
    fullName,
    phone,
  });
};

export const callDeleteUser = (_id) => {
  return axios.delete(`/api/v1/user/${_id}`);
};

//books
export const callFetchListBook = (query) => {
  return axios.get(`/api/v1/book?${query}`);
};

export const callFetchCategory = () => {
  return axios.get("/api/v1/database/category");
};

export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};

export const callCreateBook = (
  thumbnail,
  slider,
  mainText,
  author,
  price,
  quantity,
  sold,
  category
) => {
  return axios.post("/api/v1/book/", {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    quantity,
    sold,
    category,
  });
};

export const callUploadBook = (
  _id,
  thumbnail,
  slider,
  mainText,
  author,
  price,
  quantity,
  sold,
  category
) => {
  return axios.put(`/api/v1/book/${_id}`, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    quantity,
    sold,
    category,
  });
};

export const callDeleteBook = (_id) => {
  return axios.delete(`/api/v1/book/${_id}`);
};

export const callFetchBookById = (_id) => {
  return axios.get(`/api/v1/book/${_id}`);
};

export const callPlaceOrder = (data) => {
  return axios.post("/api/v1/order", data);
};

export const callHistoryOrder = () => {
  return axios.get("/api/v1/history");
};

export const callUploadAvatar = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
  });
};

export const callUpLoadInfo = (fullName, phone, avatar, _id) => {
  return axios.put("/api/v1/user", { fullName, phone, avatar, _id });
};

export const callChangePassword = (email, oldpass, newpass) => {
  return axios.post("/api/v1/user/change-password", {
    email,
    oldpass,
    newpass,
  });
};

export const callDashboard = () => {
  return axios.get("/api/v1/database/dashboard");
};

export const callFetchManageOrder = (query) => {
  return axios.get(`/api/v1/order?${query}`);
};
