import React, { useEffect, useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import LoginPage from "./pages/login";
import Home from "./components/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactPage from "./pages/contact";
import RegisterPage from "./pages/register";
import { callFetchAccount } from "./services/api";
import { useDispatch } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";

const Layout = () => {
  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default function App() {
  const dispatch = useDispatch();

  const getAccount = async () => {
    const res = await callFetchAccount();

    if (res && res.data) {
      dispatch(doGetAccountAction(res.data));
    }
  };
  useEffect(() => {
    getAccount();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <div>Error 404</div>,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
