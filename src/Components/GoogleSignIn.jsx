import React, { useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../Providers/AuthProviders";

const GoogleSignIn = () => {
    const { googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await googleLogin();

            const user = result.user;

            const userInfo = {
                name: user.displayName,
                email: user.email,
            };

            const response = await fetch(
                "http://localhost:5000/users",
                {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(userInfo),
                }
            );

            const data = await response.json();

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
                text: error.message,
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