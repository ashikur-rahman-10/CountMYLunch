import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProviders";

const API_URL = "http://localhost:5000";

const MyMeal = () => {
    const [meal, setMeal] = useState(null);
    
        const { user, loading: authLoading } = useContext(AuthContext);

    const [isHoliday, setIsHoliday] = useState(false);
    const [isFriday, setIsFriday] = useState(false);
    const [holidayName, setHolidayName] = useState("");

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

        // Logged-in user's email
    const userEmail = user?.email;

 const loadTomorrowMeal = async () => {
    try {
        setLoading(true);

        const response = await fetch(
            `${API_URL}/meals/tomorrow/${userEmail}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message ||
                    "Failed to load tomorrow's meal."
            );
        }

        setMeal(data.meal || null);

        setIsFriday(data.isFriday || false);

        setIsHoliday(data.isHoliday || false);

        setHolidayName(
            data.holidayName || ""
        );
    } catch (error) {
        console.error(
            "Load tomorrow's meal error:",
            error
        );

        setMeal(null);
        setIsFriday(false);
        setIsHoliday(false);
        setHolidayName("");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    if (userEmail) {
        loadTomorrowMeal();
    }
}, [userEmail]);

    useEffect(() => {
        loadTomorrowMeal();
    }, []);

    // =========================
    // TURN MEAL ON
    // =========================

    const turnMealOn = async () => {
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
                        email: userEmail,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(
                    data.message ||
                        "Failed to turn on meal."
                );


                if (data.isHoliday) {
                    setIsHoliday(true);

                    setIsFriday(
                        data.isFriday || false
                    );

                    setHolidayName(
                        data.holidayName || ""
                    );
                }

                return;
            }

            setMeal(data.meal || null);

            alert(
                "Tomorrow's meal turned ON successfully."
            );
        } catch (error) {
            console.error(
                "Turn meal on error:",
                error
            );

            alert(
                "Something went wrong while turning on meal."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =========================
    // TURN MEAL OFF
    // =========================

    const turnMealOff = async () => {
        if (!meal?._id) {
            return;
        }

        try {
            setActionLoading(true);

            const response = await fetch(
                `${API_URL}/meals/off/${meal._id}`,
                {
                    method: "PATCH",
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(
                    data.message ||
                        "Failed to turn off meal."
                );

                return;
            }

            await loadTomorrowMeal();

            alert(
                "Tomorrow's meal turned OFF successfully."
            );
        } catch (error) {
            console.error(
                "Turn meal off error:",
                error
            );

            alert(
                "Something went wrong while turning off meal."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =========================
    // FORMAT DATE
    // =========================

    const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

    const formattedDate =
    tomorrow.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="w-full">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    My Meal
                </h1>

                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Manage your meal for tomorrow.
                </p>
            </div>

            {/* =========================
                Tomorrow'S MEAL CARD
            ========================= */}

            <div className="card bg-base-100 border">

                <div className="card-body p-5 sm:p-6">

                    {/* Date */}

                    <div className="mb-4">
                        <p className="text-sm text-base-content/60">
                            Tomorrow
                        </p>

                        <h2 className="text-lg sm:text-xl font-semibold">
                            {formattedDate}
                        </h2>
                    </div>

                    {/* =========================
                        HOLIDAY
                    ========================= */}

                    {isHoliday ? (
                        <div className="alert alert-warning">

                            <div>
                                <h3 className="font-bold">
                                    Meal Off
                                </h3>

                                <p className="text-sm">
                                    {isFriday
                                        ? "Friday is an automatic holiday. Meal is unavailable Tomorrow."
                                        : `${holidayName || "Tomorrow"} is a holiday. Meal is unavailable Tomorrow.`}
                                </p>
                            </div>

                        </div>
                    ) : (
                        <>
                            {/* =========================
                                MEAL ON
                            ========================= */}

                            {meal?.status === "on" ? (
                                <div className="space-y-4">

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                        <div>
                                            <p className="text-sm text-base-content/60">
                                                Tomorrow's Meal
                                            </p>

                                            <h2 className="text-xl font-bold">
                                                Lunch
                                            </h2>
                                        </div>

                                        <span className="badge badge-success">
                                            Meal ON
                                        </span>

                                    </div>

                                    {/* Meal Rate */}

                                    <div className="bg-base-200 rounded-lg p-4">

                                        <p className="text-sm text-base-content/60">
                                            Meal Rate
                                        </p>

                                        <p className="text-2xl font-bold">
                                            ৳
                                            {Number(
                                                meal.mealRate || 0
                                            )}
                                        </p>

                                    </div>

                                    {/* Turn OFF */}

                                    <button
                                        type="button"
                                        onClick={turnMealOff}
                                        disabled={actionLoading}
                                        className="btn btn-error w-full sm:w-auto"
                                    >
                                        {actionLoading
                                            ? "Please wait..."
                                            : "Turn Meal OFF"}
                                    </button>

                                </div>
                            ) : (
                                /* =========================
                                    MEAL OFF
                                ========================= */

                                <div className="space-y-4">

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                        <div>
                                            <p className="text-sm text-base-content/60">
                                                Tomorrow's Meal
                                            </p>

                                            <h2 className="text-xl font-bold">
                                                Lunch
                                            </h2>
                                        </div>

                                        <span className="badge badge-error">
                                            Meal OFF
                                        </span>

                                    </div>

                                    <p className="text-sm text-base-content/60">
                                        You have not turned on
                                        Tomorrow's meal yet.
                                    </p>

                                    {/* Turn ON */}

                                    <button
                                        type="button"
                                        onClick={turnMealOn}
                                        disabled={actionLoading}
                                        className="btn btn-primary w-full sm:w-auto"
                                    >
                                        {actionLoading
                                            ? "Please wait..."
                                            : "Turn Meal ON"}
                                    </button>

                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyMeal;