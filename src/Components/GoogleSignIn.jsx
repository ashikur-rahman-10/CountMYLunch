import React, { useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../Providers/AuthProviders";
import useAxiosSecure from "../Hooks/UseAxiosSecure";

const GoogleSignIn = () => {
    const { googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const handleGoogleLogin = async () => {
        try {
            const result = await googleLogin();

            const user = result.user;

            const userInfo = {
                name: user.displayName,
            };

            // Email/uid are taken from the verified Firebase token
            // server-side, not from this request body -- see
            // backend/index.js POST /users.
            const { data } = await axiosSecure.post("/users", userInfo);

            console.log("MongoDB response:", data);

            navigate("/dashboard");

            Swal.fire({
                icon: "success",
                title: "Login Successful!",
                showConfirmButton: false,
                timer: 1500,
            });

        } catch (error) {
            console.error("Google login error:", error);

            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text:
                    error?.response?.data?.message ||
                    error.message ||
                    "Something went wrong.",
            });
        }
    };

    return (
        <div>
            <div className="divider text-white">
                or
            </div>

            <div className="w-full flex justify-center">
                <button
                    onClick={handleGoogleLogin}
                    className="flex gap-2 items-center bg-white w-full justify-center py-3 rounded-3xl hover:bg-slate-300 hover:shadow-lg font-medium"
                >
                    Sign in with

                    <img
                        className="w-6"
                        src="https://i.ibb.co/HX7Z8g9/google-logo-png-suite-everything-you-need-know-about-google-newest-0-removebg-preview.png"
                        alt="Google"
                    />
                </button>
            </div>
        </div>
    );
};

export default GoogleSignIn;