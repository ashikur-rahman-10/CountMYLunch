
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const DashboardLayout = () => {
    const navLinkClass = ({ isActive }) =>
        `whitespace-nowrap ${isActive ? "active" : ""}`;

    return (
        <div className="drawer min-h-screen bg-base-200">

            {/* Drawer Toggle */}
            <input
                id="dashboard-drawer"
                type="checkbox"
                className="drawer-toggle"
            />

            {/* Main Content */}
            <div className="drawer-content">

                {/* Navbar */}
                <header className="navbar bg-base-100 border-b px-3 sm:px-4 md:px-6">

                    {/* Hamburger - Mobile Only */}
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

                    {/* Logout */}
                    <div className="flex-none">
                        <button className="btn btn-ghost btn-sm sm:btn-md">
                            Logout
                        </button>
                    </div>

                </header>

                {/* Desktop Layout */}
                <div className="flex min-h-[calc(100vh-65px)]">

                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block w-52 lg:w-56 bg-base-100 border-r p-4 shrink-0">

                        <ul className="menu w-full">

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

                        </ul>

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

                        <span className="text-xl font-bold">
                            CountMyLunch
                        </span>

                        <label
                            htmlFor="dashboard-drawer"
                            className="btn btn-sm btn-circle btn-ghost"
                        >
                            ✕
                        </label>

                    </div>

                    {/* Mobile Menu */}
                    <ul className="menu w-full">

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

                    </ul>

                </aside>

            </div>

        </div>
    );
};

export default DashboardLayout;