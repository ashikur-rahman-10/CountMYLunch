import { createBrowserRouter } from "react-router-dom";

import Login from "../Login&Registration/Login";
import DashboardLayout from "../../Layouts/DashboardLayout";

import UserDashboard from "../Users/UserDashboard";
import MyMeal from "../Users/MyMeal";
import MealHistory from "../Users/MealHistory";
import Profile from "../Users/Profile";
import UserPayments from "../Users/UserPayments";
import SecurityDeposit from "../Users/SecurityDeposit";

import AdminUsers from "../Admin/AdminUsers";
import DepartmentDesignation from "../Admin/DepartmentDesignation";
import ManagePayments from "../Admin/Admin/ManagePayments";
import AdminHolidays from "../Admin/AdminHolidays";
import PendingApprovals from "../Admin/PendingApprovals";
import AdminDashboardHome from "../Admin/AdminDashboardHome";
import AdminSecurityDeposits from "../Admin/AdminSecurityDeposits";
import FinalSettlement from "../Admin/FinalSettlement";
import AuditLogs from "../Admin/AuditLogs";
import AdminSettings from "../Admin/AdminSettings";
import DailyReport from "../Admin/Reports/DailyReport";
import MonthlyReport from "../Admin/Reports/MonthlyReport";

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
                path: "deposit",
                element: <SecurityDeposit />,
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

            {
                path: "admin/holidays",
                element: (
                    <AdminRoute>
                        <AdminHolidays />
                    </AdminRoute>
                ),
            },

            {
                path: "admin/dashboard",
                element: (
                    <AdminRoute>
                        <AdminDashboardHome />
                    </AdminRoute>
                ),
            },

            {
                path: "admin/approvals",
                element: (
                    <AdminRoute>
                        <PendingApprovals />
                    </AdminRoute>
                ),
            },

            {
                path: "admin/deposits",
                element: (
                    <AdminRoute>
                        <AdminSecurityDeposits />
                    </AdminRoute>
                ),
            },

            {
                path: "admin/settlement",
                element: (
                    <AdminRoute>
                        <FinalSettlement />
                    </AdminRoute>
                ),
            },

            {
                path: "admin/audit-logs",
                element: (
                    <AdminRoute>
                        <AuditLogs />
                    </AdminRoute>
                ),
            },

            {
                path: "admin/settings",
                element: (
                    <AdminRoute>
                        <AdminSettings />
                    </AdminRoute>
                ),
            },

            {
                path: "admin/reports/daily",
                element: (
                    <AdminRoute>
                        <DailyReport />
                    </AdminRoute>
                ),
            },

            {
                path: "admin/reports/monthly",
                element: (
                    <AdminRoute>
                        <MonthlyReport />
                    </AdminRoute>
                ),
            },
        ],
    },
]);

export default routers;
