import React, {
    useContext,
    useEffect,
    useState,
} from "react";

import { AuthContext } from "../../Providers/AuthProviders";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const MealHistory = () => {
    const { user, loading: authLoading } =
        useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [meals, setMeals] = useState([]);

    const [totalMeals, setTotalMeals] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const [loading, setLoading] = useState(true);

    // Current month
    const [selectedMonth, setSelectedMonth] =
        useState(() => {
            const now = new Date();

            return `${now.getFullYear()}-${String(
                now.getMonth() + 1
            ).padStart(2, "0")}`;
        });

    const userEmail = user?.email;

    // =====================================
    // LOAD MONTHLY MEALS
    // =====================================

    const loadMonthlyMeals = async () => {
        if (!userEmail) return;

        try {
            setLoading(true);

            const { data } = await axiosSecure.get(
                `/meals/monthly-history/${encodeURIComponent(
                    userEmail
                )}?month=${selectedMonth}`
            );

            setMeals(data.meals || []);
            setTotalMeals(data.totalMeals || 0);
            setTotalAmount(data.totalAmount || 0);
        } catch (error) {
            console.error(
                "Load monthly meals error:",
                error
            );

            setMeals([]);
            setTotalMeals(0);
            setTotalAmount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userEmail && selectedMonth) {
            loadMonthlyMeals();
        }
    }, [userEmail, selectedMonth]);

    // =====================================
    // FORMAT DATE
    // =====================================

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =====================================
    // MONTH LABEL
    // =====================================

    const formatMonth = (month) => {
        if (!month) return "";

        const [year, monthNumber] =
            month.split("-");

        const date = new Date(
            Number(year),
            Number(monthNumber) - 1,
            1
        );

        return date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric",
            }
        );
    };

    // =====================================
    // AUTH LOADING
    // =====================================

    if (authLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="w-full">

            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Meal History
                </h1>

                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    View your meals month by month.
                </p>
            </div>

            {/* =========================
                MONTH SELECTOR
            ========================= */}

            <div className="card bg-base-100 border mb-5">
                <div className="card-body p-4 sm:p-5">

                    <div className="flex flex-col sm:flex-row sm:items-end gap-3">

                        <div className="form-control w-full sm:w-auto">
                            <label className="label">
                                <span className="label-text">
                                    Select Month
                                </span>
                            </label>

                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(
                                        e.target.value
                                    )
                                }
                                className="input input-bordered w-full"
                            />
                        </div>

                    </div>

                </div>
            </div>

            {/* =========================
                SUMMARY
            ========================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

                {/* Total Meals */}

                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">

                        <p className="text-sm text-base-content/60">
                            Total Meals
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold">
                            {totalMeals}
                        </h2>

                        <p className="text-xs text-base-content/50">
                            {formatMonth(selectedMonth)}
                        </p>

                    </div>
                </div>

                {/* Total Amount */}

                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">

                        <p className="text-sm text-base-content/60">
                            Total Meal Bill
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                            ৳{totalAmount}
                        </h2>

                        <p className="text-xs text-base-content/50">
                            {formatMonth(selectedMonth)}
                        </p>

                    </div>
                </div>

            </div>

            {/* =========================
                MEAL HISTORY TABLE
            ========================= */}

            <div className="card bg-base-100 border">

                <div className="card-body p-4 sm:p-5">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                        <h2 className="card-title text-base sm:text-lg">
                            {formatMonth(selectedMonth)}
                        </h2>

                        <span className="text-sm text-base-content/60">
                            {totalMeals} meal
                            {totalMeals !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>

                    <div className="overflow-x-auto mt-3">

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        ) : meals.length === 0 ? (
                            <div className="text-center py-10 text-base-content/50">
                                No meals found for{" "}
                                {formatMonth(
                                    selectedMonth
                                )}
                                .
                            </div>
                        ) : (
                            <table className="table">

                                <thead>
                                    <tr>
                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Meal
                                        </th>

                                        <th>
                                            Rate
                                        </th>

                                        <th>
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {meals.map(
                                        (meal) => (
                                            <tr
                                                key={
                                                    meal._id
                                                }
                                            >

                                                <td>
                                                    {formatDate(
                                                        meal.date
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        meal.mealType
                                                    }
                                                </td>

                                                <td className="font-semibold">
                                                    ৳
                                                    {Number(
                                                        meal.mealRate ||
                                                            0
                                                    )}
                                                </td>

                                                <td>
                                                    <span className="badge badge-success badge-sm">
                                                        Meal
                                                    </span>
                                                </td>

                                            </tr>
                                        )
                                    )}
                                </tbody>

                            </table>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default MealHistory;