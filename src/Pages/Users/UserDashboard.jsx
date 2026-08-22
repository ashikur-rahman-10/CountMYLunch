import React, {
    useContext,
    useEffect,
    useState,
} from "react";
import { AuthContext } from "../../Providers/AuthProviders";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [mealLoading, setMealLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // Load dashboard
    const loadDashboard = async () => {
        if (!user?.email) return;

        try {
            setLoading(true);
            setError("");

            const { data } = await axiosSecure.get(
                `/dashboard/${user.email}`
            );

            setDashboard(data);

        } catch (error) {
            console.error(error);
            setError(
                error?.response?.data?.message ||
                "Failed to load dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    // Initial dashboard load
    useEffect(() => {
        loadDashboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email]);

    // Turn on meal
    const handleMealOn = async () => {
        try {
            setMealLoading(true);
            setError("");

            await axiosSecure.post("/meals/on");

            await loadDashboard();

        } catch (error) {
            console.error(error);
            setError(
                error?.response?.data?.message ||
                "Failed to turn on meal."
            );
        } finally {
            setMealLoading(false);
        }
    };

    // Turn off meal
    const handleMealOff = async () => {
        if (!dashboard?.todayMeal?._id) {
            return;
        }

        try {
            setMealLoading(true);
            setError("");

            await axiosSecure.patch(
                `/meals/off/${dashboard.todayMeal._id}`
            );

            await loadDashboard();

        } catch (error) {
            console.error(error);
            setError(
                error?.response?.data?.message ||
                "Failed to turn off meal."
            );
        } finally {
            setMealLoading(false);
        }
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="alert alert-error">
                <span>
                    Failed to load dashboard.
                </span>
            </div>
        );
    }

    const {
        user: dashboardUser,
        todayMeal,
        monthlyMealCount,
        monthlyBill,
        currentBalance,
        recentMeals,
        recentPayments,
    } = dashboard;

    const mealIsOn =
        todayMeal?.status === "on";

    const profileCompleted =
        dashboardUser?.profileCompleted;

    return (
        <div className="w-full">

            {/* Page Header */}
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Dashboard
                </h1>

                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Welcome back! Here is your meal summary.
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-error mb-5">
                    <span>{error}</span>
                </div>
            )}

            {/* Profile Warning */}
            {!profileCompleted && (
                <div className="alert alert-warning mb-5">
                    <div>
                        <h3 className="font-bold">
                            Profile incomplete
                        </h3>

                        <p className="text-sm">
                            Complete your profile before turning on your meal.
                        </p>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">

             {/* Today's Meal */}
<div className="card bg-base-100 border">
    <div className="card-body p-5">

        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-base-content/60">
                    Today's Meal
                </p>

                <h2 className="text-2xl font-bold mt-1">
                    {mealIsOn
                        ? "Meal Available"
                        : "No Meal Today"}
                </h2>
            </div>

            {mealIsOn ? (
                <span className="badge badge-success h-10 w-fit">
                    Meal ON
                </span>
            ) : (
                <span className="badge badge-error h-10 w-fit">
                    Meal OFF
                </span>
            )}
        </div>

        {mealIsOn && todayMeal ? (
            <div className="mt-4 bg-base-200 rounded-lg p-4">
                <p className="text-sm text-base-content/60">
                    Lunch
                </p>

                <p className="text-xl font-bold">
                    ৳{Number(todayMeal.mealRate || 0)}
                </p>
            </div>
        ) : (
            <p className="text-sm text-base-content/60 mt-3">
                You don't have a meal scheduled for today.
            </p>
        )}

    </div>
</div>

                {/* Meal Status */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">

                        <p className="text-sm text-base-content/60">
                            Meal Status
                        </p>

                        <h2
                            className={`text-2xl font-bold ${
                                mealIsOn
                                    ? "text-success"
                                    : "text-error"
                            }`}
                        >
                            {mealIsOn
                                ? "ON"
                                : "OFF"}
                        </h2>

                        <p className="text-sm text-base-content/60">
                            {mealIsOn
                                ? "Today's meal is active"
                                : "Today's meal is inactive"}
                        </p>

                        {/* {mealIsOn ? (
                            <button
                                onClick={
                                    handleMealOff
                                }
                                disabled={
                                    mealLoading
                                }
                                className="btn btn-sm btn-error mt-2 w-full sm:w-fit"
                            >
                                {mealLoading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    "Turn Off Meal"
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={
                                    handleMealOn
                                }
                                disabled={
                                    mealLoading ||
                                    !profileCompleted
                                }
                                className="btn btn-sm btn-success mt-2 w-full sm:w-fit"
                            >
                                {mealLoading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    "Turn On Meal"
                                )}
                            </button>
                        )} */}

                    </div>
                </div>

                {/* Monthly Bill */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">

                        <p className="text-sm text-base-content/60">
                            This Month Bill
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold">
                            ৳{monthlyBill}
                        </h2>

                        <p className="text-sm text-base-content/60">
                            {monthlyMealCount} meals
                        </p>

                    </div>
                </div>

                {/* Balance */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">

                        <p className="text-sm text-base-content/60">
                            Current Balance
                        </p>

                        <h2
                            className={`text-2xl sm:text-3xl font-bold ${
                                currentBalance >= 0
                                    ? "text-success"
                                    : "text-error"
                            }`}
                        >
                            ৳{currentBalance}
                        </h2>

                        <p className="text-sm text-base-content/60">
                            Available balance
                        </p>

                    </div>
                </div>

            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 mt-5 sm:mt-6">

                {/* Recent Meals */}
                <div className="card bg-base-100 border min-w-0">
                    <div className="card-body p-4 sm:p-5">

                        <h2 className="card-title text-base sm:text-lg">
                            Recent Meals
                        </h2>

                        <div className="overflow-x-auto -mx-1">
                            <table className="table table-sm sm:table-md min-w-[420px]">

                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Meal</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {recentMeals?.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="text-center text-base-content/50"
                                            >
                                                No meals found
                                            </td>
                                        </tr>
                                    ) : (
                                        recentMeals?.map(
                                            (item) => (
                                                <tr
                                                    key={
                                                        item._id
                                                    }
                                                >
                                                    <td>
                                                        {formatDate(
                                                            item.date
                                                        )}
                                                    </td>

                                                    <td>
                                                        Lunch
                                                    </td>

                                                    <td>
                                                        ৳
                                                        {
                                                            item.mealRate
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    )}

                                </tbody>

                            </table>
                        </div>

                    </div>
                </div>

                {/* Recent Payments */}
                <div className="card bg-base-100 border min-w-0">
                    <div className="card-body p-4 sm:p-5">

                        <h2 className="card-title text-base sm:text-lg">
                            Recent Payments
                        </h2>

                        <div className="overflow-x-auto -mx-1">
                            <table className="table table-sm sm:table-md min-w-[420px]">

                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {recentPayments?.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="text-center text-base-content/50"
                                            >
                                                No payments found
                                            </td>
                                        </tr>
                                    ) : (
                                        recentPayments?.map(
                                            (payment) => (
                                                <tr
                                                    key={
                                                        payment._id
                                                    }
                                                >
                                                    <td>
                                                        {formatDate(
                                                            payment.date
                                                        )}
                                                    </td>

                                                    <td>
                                                        ৳
                                                        {
                                                            payment.amount
                                                        }
                                                    </td>

                                                    <td>
                                                        <span className="badge badge-success badge-sm">
                                                            {
                                                                payment.status
                                                            }
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    )}

                                </tbody>

                            </table>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
};

export default UserDashboard;