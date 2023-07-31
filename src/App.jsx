import React, { useState } from 'react';

import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactPage from './pages/contact';


const Layout = () =>{
  return (
    <div className="layout-app">
        <Header />
        <Outlet />
        <Footer />
    </div>
  )
}

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <div>Lỗi 404</div>,
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
  
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
