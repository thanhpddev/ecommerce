import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import BookPage from "./pages/book";
import ContactPage from "./pages/contact";
import LoginPage from "./pages/login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import RegisterPage from "./pages/register";
import { callFetchAccount } from "./services/api";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";
import AdminPage from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import UserTable from "./components/Admin/User/UserTable";
import BookTable from "./components/Admin/Book/BookTable";
import ManageOrder from "./components/Admin/ManageOrder/ManageOrder";
import Order from "./components/Order/index";
import History from "./components/History";

import "./styles/reset.scss";
import "./styles/global.scss";

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  return (
    <div className="layout-app">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isLoadingSearch={isLoadingSearch}
        setIsLoadingSearch={setIsLoadingSearch}
      />
      <Outlet
        context={[
          searchTerm,
          setSearchTerm,
          isLoadingSearch,
          setIsLoadingSearch,
        ]}
      />
      <Footer />
    </div>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.account.isLoading);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);

  const getAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
      // || (window.location.pathname === "/" && !isAuthenticated)
    )
      return;

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
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book/:slug",
          element: <BookPage />,
        },
        {
          path: "order",
          element: (
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          ),
        },
        {
          path: "history",
          element: (
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          ),
        },
      ],
    },

    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "user",
          element: (
            <ProtectedRoute>
              <UserTable />
            </ProtectedRoute>
          ),
        },
        {
          path: "book",
          element: (
            <ProtectedRoute>
              <BookTable />
            </ProtectedRoute>
          ),
        },
        {
          path: "manageorder",
          element: (
            <ProtectedRoute>
              <ManageOrder />
            </ProtectedRoute>
          ),
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
      {isLoading === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname.startsWith("/book") ||
      window.location.pathname === "/" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
