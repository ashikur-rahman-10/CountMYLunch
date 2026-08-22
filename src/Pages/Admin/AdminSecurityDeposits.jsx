import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const STATUS_BADGE = {
    pending: "badge-warning",
    partially_paid: "badge-warning",
    paid: "badge-success",
    adjusted: "badge-info",
    refund_pending: "badge-warning",
    refunded: "badge-neutral",
    forfeited: "badge-error",
};

const AdminSecurityDeposits = () => {
    const axiosSecure = useAxiosSecure();

    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");

    const [actionTarget, setActionTarget] = useState(null);
    const [actionType, setActionType] = useState("adjust"); // "adjust" | "refund"
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);

    const loadDeposits = async () => {
        try {
            setLoading(true);

            const { data } = await axiosSecure.get("/admin/deposits", {
                params: statusFilter ? { status: statusFilter } : {},
            });

            setDeposits(data.deposits || []);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to load deposits.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDeposits();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const openAction = (deposit, type) => {
        setActionTarget(deposit);
        setActionType(type);
        setAmount("");
        setNote("");
        document.getElementById("deposit_action_modal")?.showModal();
    };

    const remainingOf = (deposit) =>
        (deposit.paidAmount || 0) -
        (deposit.adjustedAmount || 0) -
        (deposit.refundedAmount || 0);

    const handleSubmitAction = async (e) => {
        e.preventDefault();

        if (!actionTarget) return;

        const numericAmount = Number(amount);

        if (!numericAmount || numericAmount <= 0) {
            Swal.fire({
                icon: "warning",
                title: "Invalid amount",
                text: "Enter a valid positive amount.",
            });
            return;
        }

        try {
            setSaving(true);

            const endpoint =
                actionType === "refund"
                    ? `/admin/deposits/${actionTarget.email}/refund`
                    : `/admin/deposits/${actionTarget.email}/adjust`;

            await axiosSecure.post(endpoint, {
                amount: numericAmount,
                note,
                paymentMethod: "Cash",
            });

            document.getElementById("deposit_action_modal")?.close();

            Swal.fire({
                icon: "success",
                title:
                    actionType === "refund"
                        ? "Refund recorded"
                        : "Adjustment recorded",
                showConfirmButton: false,
                timer: 1500,
            });

            setActionTarget(null);
            await loadDeposits();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to record the action.",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Security Deposits
                </h1>
                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Deposits are tracked separately from monthly meal
                    payments. Adjustments and refunds are always
                    explicit -- nothing is auto-calculated here.
                </p>
            </div>

            <div className="card bg-base-100 border mb-5">
                <div className="card-body p-4 sm:p-5">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="select select-bordered w-full sm:w-64"
                    >
                        <option value="">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="partially_paid">
                            Partially Paid
                        </option>
                        <option value="paid">Paid</option>
                        <option value="adjusted">Adjusted</option>
                        <option value="refund_pending">
                            Refund Pending
                        </option>
                        <option value="refunded">Refunded</option>
                        <option value="forfeited">Forfeited</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            ) : (
                <div className="card bg-base-100 border overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Required</th>
                                <th>Paid</th>
                                <th>Adjusted</th>
                                <th>Refunded</th>
                                <th>Remaining</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deposits.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="text-center text-base-content/60 py-8"
                                    >
                                        No deposit records found.
                                    </td>
                                </tr>
                            )}

                            {deposits.map((deposit) => (
                                <tr key={deposit._id}>
                                    <td>{deposit.email}</td>
                                    <td>৳{deposit.requiredAmount}</td>
                                    <td>৳{deposit.paidAmount}</td>
                                    <td>৳{deposit.adjustedAmount}</td>
                                    <td>৳{deposit.refundedAmount}</td>
                                    <td className="font-semibold">
                                        ৳{remainingOf(deposit)}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                STATUS_BADGE[
                                                    deposit.status
                                                ] || "badge-ghost"
                                            }`}
                                        >
                                            {deposit.status}
                                        </span>
                                    </td>
                                    <td className="flex gap-2">
                                        <button
                                            className="btn btn-xs btn-outline"
                                            onClick={() =>
                                                openAction(
                                                    deposit,
                                                    "adjust"
                                                )
                                            }
                                        >
                                            Adjust
                                        </button>
                                        <button
                                            className="btn btn-xs btn-outline btn-primary"
                                            disabled={
                                                remainingOf(deposit) <= 0
                                            }
                                            onClick={() =>
                                                openAction(
                                                    deposit,
                                                    "refund"
                                                )
                                            }
                                        >
                                            Refund
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <dialog id="deposit_action_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-1">
                        {actionType === "refund"
                            ? "Refund Deposit"
                            : "Adjust Deposit"}
                    </h3>
                    <p className="text-sm text-base-content/60 mb-4">
                        {actionTarget?.email} -- remaining: ৳
                        {actionTarget ? remainingOf(actionTarget) : 0}
                    </p>

                    <form
                        onSubmit={handleSubmitAction}
                        className="space-y-3"
                    >
                        <div>
                            <label className="label">
                                <span className="label-text">Amount</span>
                            </label>
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Note (optional)
                                </span>
                            </label>
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="input input-bordered w-full"
                                placeholder={
                                    actionType === "refund"
                                        ? "e.g. Refunded on resignation"
                                        : "e.g. Applied against outstanding bill"
                                }
                            />
                        </div>

                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "deposit_action_modal"
                                        )
                                        ?.close()
                                }
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? (
                                    <span className="loading loading-spinner loading-sm" />
                                ) : actionType === "refund" ? (
                                    "Confirm Refund"
                                ) : (
                                    "Confirm Adjustment"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default AdminSecurityDeposits;
