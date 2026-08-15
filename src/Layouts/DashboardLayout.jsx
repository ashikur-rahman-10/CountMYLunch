import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../Providers/AuthProviders";

const DashboardLayout = () => {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const [dbUser, setDbUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const navLinkClass = ({ isActive }) =>
        `whitespace-nowrap ${isActive ? "active" : ""}`;

    useEffect(() => {
        if (!user?.email) {
            setLoadingUser(false);
            return;
        }

        fetch(
            `http://localhost:5000/users/${encodeURIComponent(
                user.email
            )}`
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to load user");
                }

                return res.json();
            })
            .then((data) => {
                setDbUser(data.user || data);
            })
            .catch((error) => {
                console.error("Failed to load MongoDB user:", error);
                setDbUser(null);
            })
            .finally(() => {
                setLoadingUser(false);
            });
    }, [user?.email]);

    const handleLogout = () => {
        logOut()
            .then(() => {
                navigate("/");
                Swal.fire({
                    icon: "success",
                    title: "Logged out successfully",
                    showConfirmButton: false,
                    timer: 1200,
                });
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    };

    const isAdmin = dbUser?.role === "admin";

    const userMenu = (
        <>
            <li>
                <NavLink
                    to="/dashboard"
                    end
                    className={navLinkClass}
                >
                    Dashboard
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/dashboard/my-meal"
                    className={navLinkClass}
                >
                    My Meal
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/dashboard/history"
                    className={navLinkClass}
                >
                    Meal History
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/dashboard/payments"
                    className={navLinkClass}
                >
                    Payments
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/dashboard/profile"
                    className={navLinkClass}
                >
                    Profile
                </NavLink>
            </li>
        </>
    );

    const adminMenu = isAdmin && (
        <>
            <li className="menu-title mt-4">
                <span>Admin</span>
            </li>

            <li>
                <NavLink
                    to="/dashboard/users"
                    className={navLinkClass}
                >
                    Users
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/dashboard/department-designation"
                    className={navLinkClass}
                >
                    Department & Designation
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/dashboard/admin/payments"
                    className={navLinkClass}
                >
                    Manage Payments
                </NavLink>
            </li>
        </>
    );

    return (
        <div className="drawer min-h-screen bg-base-200">

            <input
                id="dashboard-drawer"
                type="checkbox"
                className="drawer-toggle"
            />

            {/* Main Content */}
            <div className="drawer-content">

                {/* Navbar */}
                <header className="navbar bg-base-100 border-b px-3 sm:px-4 md:px-6">

                    {/* Mobile Menu Button */}
                    <div className="flex-none md:hidden">
                        <label
                            htmlFor="dashboard-drawer"
                            className="btn btn-square btn-ghost"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </label>
                    </div>

                    {/* Logo */}
                    <div className="flex-1 min-w-0">
                        <span className="text-lg sm:text-xl font-bold">
                            CountMyLunch
                        </span>
                    </div>

                    {/* User Info */}
                    <div className="hidden sm:flex items-center gap-3 mr-2">
                        {user?.photoURL && (
                            <img
                                src={user.photoURL}
                                alt={user.displayName || "User"}
                                className="w-8 h-8 rounded-full"
                            />
                        )}

                        <div className="hidden lg:block">
                            <p className="text-sm font-medium">
                                {dbUser?.name || user?.displayName || "User"}
                            </p>

                            {isAdmin && (
                                <p className="text-xs text-primary">
                                    Admin
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Logout */}
                    <div className="flex-none">
                        <button
                            onClick={handleLogout}
                            className="btn btn-ghost btn-sm sm:btn-md"
                        >
                            Logout
                        </button>
                    </div>

                </header>

                {/* Desktop Layout */}
                <div className="flex min-h-[calc(100vh-65px)]">

                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block w-52 lg:w-60 bg-base-100 border-r p-4 shrink-0">

                        {loadingUser ? (
                            <div className="flex justify-center py-4">
                                <span className="loading loading-spinner loading-sm"></span>
                            </div>
                        ) : (
                            <ul className="menu w-full">
                                {userMenu}
                                {adminMenu}
                            </ul>
                        )}

                    </aside>

                    {/* Page Content */}
                    <main className="flex-1 min-w-0 w-full p-3 sm:p-4 md:p-5 lg:p-6">
                        <Outlet />
                    </main>

                </div>

            </div>

            {/* Mobile Drawer */}
            <div className="drawer-side z-50">

                <label
                    htmlFor="dashboard-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                />

                <aside className="bg-base-100 min-h-full w-72 p-4">

                    {/* Drawer Header */}
                    <div className="flex items-center justify-between mb-4">

                        <div>
                            <span className="text-xl font-bold">
                                CountMyLunch
                            </span>

                            {isAdmin && (
                                <p className="text-xs text-primary mt-1">
                                    Admin Panel
                                </p>
                            )}
                        </div>

                        <label
                            htmlFor="dashboard-drawer"
                            className="btn btn-sm btn-circle btn-ghost"
                        >
                            ✕
                        </label>

                    </div>

                    {/* Mobile Menu */}
                    {loadingUser ? (
                        <div className="flex justify-center py-4">
                            <span className="loading loading-spinner loading-sm"></span>
                        </div>
                    ) : (
                        <ul className="menu w-full">
                            {userMenu}
                            {adminMenu}
                        </ul>
                    )}

                </aside>

            </div>

        </div>
    );
};

export default DashboardLayout;