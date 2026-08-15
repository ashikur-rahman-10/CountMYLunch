import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProviders";

const API_URL = "http://localhost:5000";

const MealHistory = () => {
    const { user } = useContext(AuthContext);

    const [meals, setMeals] = useState([]);
    const [totalMeals, setTotalMeals] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);

    const loadMealHistory = async () => {
        if (!user?.email) return;

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/meals/history/${encodeURIComponent(
                    user.email
                )}`
            );

            const data = await response.json();

            if (data.success) {
                setMeals(data.meals);
                setTotalMeals(data.totalMeals);
                setTotalAmount(data.totalAmount);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMealHistory();
    }, [user]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    return (
        <div className="w-full">

            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Meal History
                </h1>

                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    View your previous meal records.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5">

                        <div className="card bg-base-100 border">
                            <div className="card-body p-4 sm:p-5">
                                <p className="text-sm text-base-content/60">
                                    Total Meals
                                </p>

                                <h2 className="text-2xl sm:text-3xl font-bold">
                                    {totalMeals}
                                </h2>

                                <p className="text-sm text-base-content/60">
                                    Meals counted
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-100 border">
                            <div className="card-body p-4 sm:p-5">
                                <p className="text-sm text-base-content/60">
                                    Total Amount
                                </p>

                                <h2 className="text-2xl sm:text-3xl font-bold">
                                    ৳{totalAmount}
                                </h2>

                                <p className="text-sm text-base-content/60">
                                    Total meal cost
                                </p>
                            </div>
                        </div>

                    </div>

                    <div className="card bg-base-100 border">
                        <div className="card-body p-4 sm:p-5">

                            <h2 className="card-title text-base sm:text-lg mb-3">
                                Meal Records
                            </h2>

                            {meals.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-base-content/60">
                                        No meal history found.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table">

                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Meal</th>
                                                <th>Rate</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {meals.map((item) => (
                                                <tr key={item._id}>

                                                    <td>
                                                        {formatDate(
                                                            item.date
                                                        )}
                                                    </td>

                                                    <td>
                                                        {item.mealType ||
                                                            "Lunch"}
                                                    </td>

                                                    <td>
                                                        ৳
                                                        {item.mealRate ||
                                                            60}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                item.status ===
                                                                "on"
                                                                    ? "badge-success"
                                                                    : "badge-error"
                                                            }`}
                                                        >
                                                            {item.status ===
                                                            "on"
                                                                ? "Counted"
                                                                : "Off"}
                                                        </span>
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                            )}

                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default MealHistory;