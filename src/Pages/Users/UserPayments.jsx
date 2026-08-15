import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../Providers/AuthProviders";

const UserPayments = () => {
    const { user } = useContext(AuthContext);

    const [payments, setPayments] = useState([]);
    const [totalPaid, setTotalPaid] = useState(0);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    useEffect(() => {
        if (!user?.email) return;

        const loadPayments = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `${API_URL}/payments/${encodeURIComponent(user.email)}`
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Failed to load payments."
                    );
                }

                setPayments(data.payments || []);
                setTotalPaid(Number(data.totalPaid || 0));
            } catch (error) {
                console.error(error);

                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: error.message || "Failed to load payment history.",
                });
            } finally {
                setLoading(false);
            }
        };

        loadPayments();
    }, [user?.email, API_URL]);

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="w-full">
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Payments
                </h1>

                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    View your payment history and total payments.
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">
                        <p className="text-sm text-base-content/60">
                            Total Paid
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold text-success">
                            ৳{totalPaid}
                        </h2>

                        <p className="text-sm text-base-content/60">
                            Total amount paid so far
                        </p>
                    </div>
                </div>

                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">
                        <p className="text-sm text-base-content/60">
                            Total Payments
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold">
                            {payments.length}
                        </h2>

                        <p className="text-sm text-base-content/60">
                            Payment transactions
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment History */}
            <div className="card bg-base-100 border">
                <div className="card-body p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="card-title text-base sm:text-lg">
                            Payment History
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-base-content/60">
                                No payment history found.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {payments.map((payment, index) => (
                                        <tr key={payment._id}>
                                            <td>{index + 1}</td>

                                            <td>
                                                {formatDate(
                                                    payment.paymentDate ||
                                                        payment.date
                                                )}
                                            </td>

                                            <td className="font-semibold">
                                                ৳{Number(payment.amount || 0)}
                                            </td>

                                            <td>
                                                <span className="badge badge-ghost">
                                                    {payment.paymentMethod ||
                                                        "Cash"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="badge badge-success">
                                                    {payment.status || "Paid"}
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
        </div>
    );
};

export default UserPayments;