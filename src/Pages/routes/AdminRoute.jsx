import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProviders";

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    const [dbUser, setDbUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) {
            setUserLoading(false);
            return;
        }

        fetch(
            `http://localhost:5000/users/${encodeURIComponent(
                user.email
            )}`
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error("User not found");
                }

                return res.json();
            })
            .then((data) => {
                setDbUser(data.user || data);
            })
            .catch(() => {
                setDbUser(null);
            })
            .finally(() => {
                setUserLoading(false);
            });
    }, [user?.email]);

    if (loading || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/"
                state={{ from: location }}
                replace
            />
        );
    }

    if (dbUser?.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default AdminRoute;