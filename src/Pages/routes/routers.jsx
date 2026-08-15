import { createBrowserRouter } from "react-router-dom";
import Login from "../Login&Registration/Login";
import DashboardLayout from "../../Layouts/DashboardLayout";
import UserDashboard from "../Users/UserDashboard";
import MyMeal from "../Users/MyMeal";
import MealHistory from "../Users/MealHistory";
import Payments from "../Users/Payments";
import Profile from "../Users/Profile";



const routers = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },

    {
        path: "/dashboard",
        element: <DashboardLayout />,
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
                element: <Payments />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
        ],
    },
]);

export default routers;