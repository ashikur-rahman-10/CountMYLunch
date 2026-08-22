import axios from "axios";
import { getAuth } from "firebase/auth";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import app from "../firebase/firebase.config";
import useAuth from "./UseAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Single shared instance so interceptors are only attached once.
const axiosSecure = axios.create({
    baseURL: API_URL,
});

/**
 * useAxiosSecure
 *
 * Every request made with this instance automatically carries the
 * current user's Firebase ID token as a Bearer token, so the backend can
 * verify who is actually calling it (see backend/middleware/auth.js).
 *
 * Do NOT use plain fetch()/axios for authenticated endpoints -- without
 * the token attached, the backend will reject the request with 401.
 *
 * On a 401 (invalid/expired token) or 403 (not authorized for this
 * resource), the user is signed out and sent back to the login page,
 * since either means their session/credentials are no longer valid for
 * what they were trying to do.
 */
const useAxiosSecure = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use(
            async (config) => {
                const auth = getAuth(app);
                const currentUser = auth.currentUser;

                if (currentUser) {
                    const token = await currentUser.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error?.response?.status;

                if (status === 401 || status === 403) {
                    await logOut();
                    navigate("/", { replace: true });
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return useMemo(() => axiosSecure, []);
};

export default useAxiosSecure;
