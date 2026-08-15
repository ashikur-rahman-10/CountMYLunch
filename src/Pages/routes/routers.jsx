import { createBrowserRouter } from "react-router-dom";

import Login from "../Login&Registration/Login";
import DashboardLayout from "../../Layouts/DashboardLayout";

import UserDashboard from "../Users/UserDashboard";
import MyMeal from "../Users/MyMeal";
import MealHistory from "../Users/MealHistory";
import Profile from "../Users/Profile";
import UserPayments from "../Users/UserPayments";

import AdminUsers from "../Admin/AdminUsers";
import DepartmentDesignation from "../Admin/DepartmentDesignation";
import ManagePayments from "../Admin/Admin/ManagePayments";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },

    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <DashboardLayout />
            </PrivateRoute>
        ),

        children: [
            {
                index: true,
                element: <UserDashboard />,
            },

            {
                path: "my-meal",
                element: <MyMeal />,
            },

            {
                path: "history",
                element: <MealHistory />,
            },

            {
                path: "payments",
                element: <UserPayments />,
            },

            {
                path: "profile",
                element: <Profile />,
            },

            {
                path: "users",
                element: (
                    <AdminRoute>
                        <AdminUsers />
                    </AdminRoute>
                ),
            },

            {
                path: "department-designation",
                element: (
                    <AdminRoute>
                        <DepartmentDesignation />
                    </AdminRoute>
                ),
            },

            {
                path: "admin/payments",
                element: (
                    <AdminRoute>
                        <ManagePayments />
                    </AdminRoute>
                ),
            },
        ],
    },
]);

export default routers;