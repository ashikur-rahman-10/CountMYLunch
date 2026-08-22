import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const StatCard = ({ label, value, accent = "" }) => (
    <div className="card bg-base-100 border">
        <div className="card-body p-4 sm:p-5">
            <p className="text-sm text-base-content/60">{label}</p>
            <h2 className={`text-2xl sm:text-3xl font-bold ${accent}`}>
                {value}
            </h2>
        </div>
    </div>
);

const AdminDashboardHome = () => {
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await axiosSecure.get("/admin/dashboard");
                setStats(data);
            } catch (err) {
                console.error(err);
                setError(
                    err?.response?.data?.message ||
                        "Failed to load admin dashboard."
                );
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    return (
        <div className="w-full">
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Admin Dashboard
                </h1>
                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    {stats?.todayIsFriday
                        ? "Today is Friday -- no lunch service."
                        : stats?.todayIsHoliday
                        ? "Today is a company holiday -- no lunch service."
                        : "Overview of today's and this month's meal activity."}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <StatCard
                    label="Total Employees"
                    value={stats.totalEmployees}
                />
                <StatCard
                    label="Pending Approvals"
                    value={stats.pendingApprovals}
                    accent="text-warning"
                />
                <StatCard
                    label="Active Meal Users"
                    value={stats.activeMealUsers}
                    accent="text-success"
                />
                <StatCard
                    label="Today's Lunch Count"
                    value={stats.todaysLunchCount}
                />
                <StatCard
                    label="Today's Lunch Expense"
                    value={`৳${stats.todaysLunchExpense}`}
                />
                <StatCard
                    label="Current Month Meals"
                    value={stats.currentMonthMeals}
                />
                <StatCard
                    label="Current Month Expense"
                    value={`৳${stats.currentMonthExpense}`}
                />
                <StatCard
                    label="Total Payments Collected"
                    value={`৳${stats.totalPayments}`}
                    accent="text-success"
                />
                <StatCard
                    label="Pending Deposits"
                    value={stats.pendingDeposits}
                    accent="text-warning"
                />
                <StatCard
                    label="Refunds Pending"
                    value={stats.refundPending}
                    accent="text-warning"
                />
                <StatCard
                    label="Outstanding Amount"
                    value={`৳${stats.outstandingAmount}`}
                    accent="text-error"
                />
                <StatCard
                    label="Users With Outstanding / Credit"
                    value={`${stats.usersWithOutstanding} / ${stats.usersWithCredit}`}
                />
            </div>
        </div>
    );
};

export default AdminDashboardHome;
