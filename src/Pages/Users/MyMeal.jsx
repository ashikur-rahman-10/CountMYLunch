import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProviders";

const API_URL = "http://localhost:5000";

const MyMeal = () => {
    const { user } = useContext(AuthContext);

    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const loadTodayMeal = async () => {
        if (!user?.email) return;

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/meals/today/${encodeURIComponent(
                    user.email
                )}`
            );

            const data = await response.json();

            if (data.success) {
                setMeal(data.meal);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTodayMeal();
    }, [user]);

    const handleMealOn = async () => {
        try {
            setActionLoading(true);

            const response = await fetch(
                `${API_URL}/meals/on`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: user.email,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                setMeal(data.meal);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleMealOff = async () => {
        if (!meal?._id) return;

        try {
            setActionLoading(true);

            const response = await fetch(
                `${API_URL}/meals/off/${meal._id}`,
                {
                    method: "PATCH",
                }
            );

            const data = await response.json();

            if (data.success) {
                setMeal(data.meal);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const isMealOn = meal?.status === "on";

    return (
        <div className="w-full">

            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    My Meal
                </h1>

                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Manage your meal for today.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    <div className="card bg-base-100 border">
                        <div className="card-body">

                            <h2 className="card-title">
                                Today's Lunch
                            </h2>

                            <div className="mt-4">

                                <p className="text-sm text-base-content/60">
                                    Meal Status
                                </p>

                                <h2
                                    className={`text-4xl font-bold mt-1 ${
                                        isMealOn
                                            ? "text-success"
                                            : "text-error"
                                    }`}
                                >
                                    {isMealOn ? "ON" : "OFF"}
                                </h2>

                            </div>

                            <div className="divider"></div>

                            <div className="flex justify-between">
                                <span>
                                    Meal
                                </span>

                                <span className="font-semibold">
                                    Lunch
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Meal Rate
                                </span>

                                <span className="font-semibold">
                                    ৳{meal?.mealRate || 60}
                                </span>
                            </div>

                            <div className="mt-5">

                                {isMealOn ? (
                                    <button
                                        onClick={handleMealOff}
                                        disabled={actionLoading}
                                        className="btn btn-error w-full"
                                    >
                                        {actionLoading ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : (
                                            "Turn Off Meal"
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleMealOn}
                                        disabled={actionLoading}
                                        className="btn btn-success w-full"
                                    >
                                        {actionLoading ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : (
                                            "Turn On Meal"
                                        )}
                                    </button>
                                )}

                            </div>

                        </div>
                    </div>

                    <div className="card bg-base-100 border">
                        <div className="card-body">

                            <h2 className="card-title">
                                Meal Information
                            </h2>

                            <div className="space-y-4 mt-4">

                                <div>
                                    <p className="text-sm text-base-content/60">
                                        Date
                                    </p>

                                    <p className="font-semibold">
                                        {new Date().toLocaleDateString(
                                            "en-GB",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-base-content/60">
                                        Meal Type
                                    </p>

                                    <p className="font-semibold">
                                        Lunch
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-base-content/60">
                                        Status
                                    </p>

                                    <span
                                        className={`badge ${
                                            isMealOn
                                                ? "badge-success"
                                                : "badge-error"
                                        }`}
                                    >
                                        {isMealOn
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            )}

        </div>
    );
};

export default MyMeal;