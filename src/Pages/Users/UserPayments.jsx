import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProviders";

const API_URL = "http://localhost:5000";

    const UserPayments = () => {
        const { user, loading: authLoading } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [totalPaid, setTotalPaid] = useState(0);      
    const [loading, setLoading] = useState(true);

    // Logged-in user's email
    const userEmail = user?.email;

    const loadPayments = async () => {
        if (!userEmail) {
            setPayments([]);
            setTotalPaid(0);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            console.log("Logged-in user email:", userEmail);

            const response = await fetch(
                `${API_URL}/payments/${encodeURIComponent(userEmail)}`
            );

            console.log("Response status:", response.status);

            const data = await response.json();

            console.log("Payment API response:", data);

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load payments"
                );
            }

            setPayments(data.payments || []);
            setTotalPaid(data.totalPaid || 0);

        } catch (error) {
            console.error("Load payments error:", error);

            setPayments([]);
            setTotalPaid(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Firebase এখনও user check করছে
        if (authLoading) {
            return;
        }

        // User login করা থাকলে payment load হবে
        if (user?.email) {
            loadPayments();
        } else {
            setPayments([]);
            setTotalPaid(0);
            setLoading(false);
        }
    }, [user, authLoading]);

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Firebase loading
    if (authLoading) {
        return (
            <div className="w-full flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        );
    }

    // User login করা নেই
    if (!user) {
        return (
            <div className="w-full">
                <div className="mb-5 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold">
                        My Payments
                    </h1>

                    <p className="text-sm sm:text-base text-base-content/60 mt-1">
                        View your payment history and total payments.
                    </p>
                </div>

                <div className="card bg-base-100 border">
                    <div className="card-body p-5 sm:p-6">
                        <div className="alert alert-warning">
                            <span>
                                Please login to view your payment history.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">

            {/* Header */}
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    My Payments
                </h1>

                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    View your payment history and total payments.
                </p>

                {/* Logged in user */}
                <p className="text-sm text-base-content/50 mt-2">
                    Account:{" "}
                    <span className="font-medium text-base-content">
                        {user.email}
                    </span>
                </p>
            </div>

            {/* Total Paid */}
            <div className="card bg-base-100 border mb-5">
                <div className="card-body p-4 sm:p-5">

                    <p className="text-sm text-base-content/60">
                        Total Paid
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                        ৳{Number(totalPaid || 0).toLocaleString()}
                    </h2>

                </div>
            </div>

            {/* Payment History */}
            <div className="card bg-base-100 border">
                <div className="card-body p-4 sm:p-5">

                    <h2 className="card-title text-base sm:text-lg">
                        Payment History
                    </h2>

                    <div className="overflow-x-auto mt-3">

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <span className="loading loading-spinner loading-md"></span>
                            </div>
                        ) : payments.length === 0 ? (
                            <div className="text-center py-8 text-base-content/50">
                                No payment history found.
                            </div>
                        ) : (
                            <table className="table">

                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {payments.map((payment) => (
                                        <tr key={payment._id}>

                                            {/* Date */}
                                            <td>
                                                {formatDate(
                                                    payment.paymentDate
                                                )}
                                            </td>

                                            {/* Amount */}
                                            <td className="font-semibold">
                                                ৳
                                                {Number(
                                                    payment.amount || 0
                                                ).toLocaleString()}
                                            </td>

                                            {/* Method */}
                                            <td className="capitalize">
                                                {payment.paymentMethod || "-"}
                                            </td>

                                            {/* Status */}
                                            <td>
                                                {payment.status === "paid" ? (
                                                    <span className="badge badge-success badge-sm">
                                                        Paid
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-warning badge-sm">
                                                        {payment.status ||
                                                            "Pending"}
                                                    </span>
                                                )}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        )}

                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserPayments;