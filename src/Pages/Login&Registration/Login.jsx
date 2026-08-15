import React, { useState } from "react";
import loginBanner from "../../assets/Images/login_banner.svg";
import background from "../../assets/background/triangle_bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaRegEyeSlash } from "react-icons/fa";
import GoogleSignIn from "../../Components/GoogleSignIn";

const Login = () => {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
    };

    return (
        <div className="min-h-screen w-full bg-[url('https://i.ibb.co/KWvYf8D/blue-bg.jpg')] flex items-center justify-center flex-col py-16">
            <div className="flex flex-col md:flex-row max-w-5xl mx-auto h-full  justify-center gap-20 items-center">
                <div className="md:w-[500px]">
                    <img className="w-full" src={loginBanner} />
                </div>
                <div className="md:w-96 w-full">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-6 md:p-10 md:py-20 bg-white bg-opacity-10 rounded-2xl shadow-2xl space-y-4"
                    >
                        <h1 className="text-center text-2xl md:text-4xl pb-5 text-white">
                            Login
                        </h1>
                        <div className="form-control ">
                            <input
                                type="text"
                                {...register("email", { required: true })}
                                placeholder="email"
                                className="input input-bordered"
                            />
                        </div>
                        <div className="form-control relative">
                            <input
                                type={show ? "text" : "password"}
                                {...register("password", { required: true })}
                                placeholder="password"
                                className="input input-bordered"
                            />
                            <span
                                onClick={() => {
                                    setShow(!show);
                                }}
                                className="absolute top-4 right-4"
                            >
                                {show ? (
                                    <FaEye></FaEye>
                                ) : (
                                    <FaEyeSlash></FaEyeSlash>
                                )}
                            </span>
                        </div>
                        <div className=" flex justify-center">
                            <button
                                type="submit"
                                className="w-full bg-[#0D6EFD] text-white px-10 py-3 rounded-3xl hover:bg-sky-500 font-medium"
                            >
                                Login
                            </button>
                        </div>
                        <GoogleSignIn></GoogleSignIn>
                    </form>
                </div>
            </div>
            <Link
                to={"/"}
                className="btn btn-outline btn-sm btn-info rounded-3xl mt-10  md:mt-0"
            >
                Back home
            </Link>
        </div>
    );
};

export default Login;