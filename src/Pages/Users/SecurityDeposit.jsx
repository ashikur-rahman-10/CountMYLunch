import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProviders";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const STATUS_LABEL = {
    pending: "Pending",
    partially_paid: "Partially Paid",
    paid: "Paid",
    adjusted: "Adjusted",
    refund_pending: "Refund Pending",
    refunded: "Refunded",
    forfeited: "Forfeited",
};

const STATUS_BADGE = {
    pending: "badge-warning",
    partially_paid: "badge-warning",
    paid: "badge-success",
    adjusted: "badge-info",
    refund_pending: "badge-warning",
    refunded: "badge-neutral",
    forfeited: "badge-error",
};

const SecurityDeposit = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [deposit, setDeposit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.email) return;

        (async () => {
            try {
                setLoading(true);
                const { data } = await axiosSecure.get(
                    `/deposits/${encodeURIComponent(user.email)}`
                );
                setDeposit(data.deposit);
            } catch (err) {
                console.error(err);
                setError(
                    err?.response?.data?.message ||
                        "Failed to load your security deposit."
                );
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email]);

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
        <div className="w-full max-w-2xl">
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Security Deposit
                </h1>
                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    This is separate from your monthly meal bill and
                    payments.
                </p>
            </div>

            <div className="card bg-base-100 border">
                <div className="card-body p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">Deposit Status</h2>
                        <span
                            className={`badge ${
                                STATUS_BADGE[deposit.status] ||
                                "badge-ghost"
                            }`}
                        >
                            {STATUS_LABEL[deposit.status] ||
                                deposit.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <p className="text-base-content/60">
                            Required Deposit
                        </p>
                        <p className="text-right font-medium">
                            ৳{deposit.requiredAmount}
                        </p>

                        <p className="text-base-content/60">
                            Paid Deposit
                        </p>
                        <p className="text-right font-medium">
                            ৳{deposit.paidAmount}
                        </p>

                        <p className="text-base-content/60">
                            Adjusted (applied against bill)
                        </p>
                        <p className="text-right font-medium">
                            ৳{deposit.adjustedAmount}
                        </p>

                        <p className="text-base-content/60">
                            Refunded
                        </p>
                        <p className="text-right font-medium">
                            ৳{deposit.refundedAmount}
                        </p>

                        <p className="text-base-content/60 font-semibold border-t pt-2">
                            Remaining / Refundable
                        </p>
                        <p className="text-right font-bold border-t pt-2">
                            ৳{deposit.remainingAmount}
                        </p>
                    </div>

                    {deposit.status === "pending" && (
                        <div className="alert alert-warning mt-4 text-sm">
                            Your security deposit has not been completed.
                            Please contact HR/admin to complete it before
                            meal access can be enabled.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecurityDeposit;
