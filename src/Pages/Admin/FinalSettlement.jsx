import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const FinalSettlement = () => {
    const axiosSecure = useAxiosSecure();

    const [users, setUsers] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [closureDate, setClosureDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [closureReason, setClosureReason] = useState("");

    const [preview, setPreview] = useState(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

    const [adjustmentAmount, setAdjustmentAmount] = useState("0");
    const [refundAmount, setRefundAmount] = useState("0");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [reference, setReference] = useState("");
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axiosSecure.get("/users");
                setUsers(
                    (data.users || []).filter(
                        (user) => user.mealAccess === true
                    )
                );
            } catch (error) {
                console.error(error);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadPreview = async () => {
        if (!selectedEmail) {
            Swal.fire({
                icon: "warning",
                title: "Select a user first",
            });
            return;
        }

        try {
            setLoadingPreview(true);

            const { data } = await axiosSecure.get(
                `/admin/settlement/${encodeURIComponent(
                    selectedEmail
                )}/preview`,
                { params: { closureDate } }
            );

            setPreview(data.settlement);

            const available = data.settlement.securityDeposit.remainingAmount;
            const outstanding = Math.max(
                0,
                data.settlement.outstandingAmount
            );

            const suggestedAdjustment = Math.min(available, outstanding);

            setAdjustmentAmount(String(suggestedAdjustment));
            setRefundAmount(
                String(Math.max(0, available - suggestedAdjustment))
            );
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to calculate settlement preview.",
            });
        } finally {
            setLoadingPreview(false);
        }
    };

    const handleConfirm = async () => {
        if (!preview) return;

        const numericAdjustment = Number(adjustmentAmount) || 0;
        const numericRefund = Number(refundAmount) || 0;

        const result = await Swal.fire({
            icon: "warning",
            title: "Confirm Final Settlement?",
            html: `
                <div style="text-align:left">
                    <p><b>Employee:</b> ${selectedEmail}</p>
                    <p><b>Final Meal Bill:</b> ৳${preview.finalMealBill}</p>
                    <p><b>Outstanding:</b> ৳${preview.outstandingAmount}</p>
                    <p><b>Deposit Applied:</b> ৳${numericAdjustment}</p>
                    <p><b>Refund:</b> ৳${numericRefund}</p>
                    <p style="margin-top:8px">This will disable meal access and cannot be undone from this screen.</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Confirm Settlement",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            setConfirming(true);

            await axiosSecure.post(
                `/admin/settlement/${encodeURIComponent(
                    selectedEmail
                )}/confirm`,
                {
                    closureDate,
                    closureReason,
                    adjustmentAmount: numericAdjustment,
                    refundAmount: numericRefund,
                    paymentMethod,
                    reference,
                }
            );

            Swal.fire({
                icon: "success",
                title: "Settlement Completed",
                showConfirmButton: false,
                timer: 2000,
            });

            setPreview(null);
            setSelectedEmail("");
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to complete settlement.",
            });
        } finally {
            setConfirming(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Final Settlement
                </h1>
                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Close a user's meal facility at any point during the
                    month and settle their final bill and deposit.
                </p>
            </div>

            <div className="card bg-base-100 border mb-5">
                <div className="card-body p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label className="label">
                            <span className="label-text">Employee</span>
                        </label>
                        <select
                            value={selectedEmail}
                            onChange={(e) => {
                                setSelectedEmail(e.target.value);
                                setPreview(null);
                            }}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select employee</option>
                            {users.map((user) => (
                                <option key={user._id} value={user.email}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">
                                Closure Date
                            </span>
                        </label>
                        <input
                            type="date"
                            value={closureDate}
                            onChange={(e) =>
                                setClosureDate(e.target.value)
                            }
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">
                                Closure Reason
                            </span>
                        </label>
                        <input
                            type="text"
                            value={closureReason}
                            onChange={(e) =>
                                setClosureReason(e.target.value)
                            }
                            className="input input-bordered w-full"
                            placeholder="e.g. Resignation"
                        />
                    </div>

                    <div className="md:col-span-3">
                        <button
                            className="btn btn-primary"
                            onClick={loadPreview}
                            disabled={loadingPreview}
                        >
                            {loadingPreview ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                "Calculate Settlement"
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {preview && (
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">
                        <h3 className="font-semibold text-lg mb-3">
                            Settlement Summary
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
                            <p>
                                <span className="text-base-content/60">
                                    Final Meal Count:
                                </span>{" "}
                                {preview.finalMealCount}
                            </p>
                            <p>
                                <span className="text-base-content/60">
                                    Final Meal Bill:
                                </span>{" "}
                                ৳{preview.finalMealBill}
                            </p>
                            <p>
                                <span className="text-base-content/60">
                                    Opening Balance:
                                </span>{" "}
                                ৳{preview.openingBalance}
                            </p>
                            <p>
                                <span className="text-base-content/60">
                                    Paid / Advance:
                                </span>{" "}
                                ৳{preview.paidAdvance}
                            </p>
                            <p>
                                <span className="text-base-content/60">
                                    Outstanding Amount:
                                </span>{" "}
                                <span className="font-semibold">
                                    ৳{preview.outstandingAmount}
                                </span>
                            </p>
                            <p>
                                <span className="text-base-content/60">
                                    Available Security Deposit:
                                </span>{" "}
                                ৳{preview.securityDeposit.remainingAmount}
                            </p>
                        </div>

                        <div className="divider">
                            Admin Decision (never auto-assumed)
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Adjustment (deposit applied
                                        against bill)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={adjustmentAmount}
                                    onChange={(e) =>
                                        setAdjustmentAmount(e.target.value)
                                    }
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Refund Amount
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={refundAmount}
                                    onChange={(e) =>
                                        setRefundAmount(e.target.value)
                                    }
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Refund Payment Method
                                    </span>
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    className="select select-bordered w-full"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Bank">Bank</option>
                                    <option value="Mobile Banking">
                                        Mobile Banking
                                    </option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Reference (optional)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) =>
                                        setReference(e.target.value)
                                    }
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </div>

                        <div className="card-actions justify-end mt-5">
                            <button
                                className="btn btn-error"
                                onClick={handleConfirm}
                                disabled={confirming}
                            >
                                {confirming ? (
                                    <span className="loading loading-spinner loading-sm" />
                                ) : (
                                    "Confirm Final Settlement"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinalSettlement;
