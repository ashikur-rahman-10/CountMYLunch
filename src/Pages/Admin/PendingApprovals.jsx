import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const PendingApprovals = () => {
    const axiosSecure = useAxiosSecure();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [approvingUser, setApprovingUser] = useState(null);
    const [receivedAmount, setReceivedAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [reference, setReference] = useState("");

    const loadPending = async () => {
        try {
            setLoading(true);

            const { data } = await axiosSecure.get(
                "/admin/approvals/pending"
            );

            setUsers(data.users || []);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to load pending approvals.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPending();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openApproveModal = (user) => {
        setApprovingUser(user);
        setReceivedAmount(String(user.requiredDeposit || 0));
        setPaymentMethod("Cash");
        setReference("");

        document.getElementById("approve_modal")?.showModal();
    };

    const handleApprove = async (e) => {
        e.preventDefault();

        if (!approvingUser) return;

        try {
            setSaving(true);

            const { data } = await axiosSecure.post(
                `/admin/approvals/${approvingUser._id}/approve`,
                {
                    receivedAmount: Number(receivedAmount) || 0,
                    paymentMethod,
                    reference,
                }
            );

            document.getElementById("approve_modal")?.close();

            Swal.fire({
                icon: "success",
                title: "User Approved",
                text: data.message,
                showConfirmButton: false,
                timer: 2000,
            });

            setApprovingUser(null);
            await loadPending();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to approve user.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleReject = async (user) => {
        const result = await Swal.fire({
            icon: "warning",
            title: `Reject ${user.name}?`,
            input: "text",
            inputLabel: "Reason (optional)",
            showCancelButton: true,
            confirmButtonText: "Reject",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosSecure.post(
                `/admin/approvals/${user._id}/reject`,
                { reason: result.value || "" }
            );

            Swal.fire({
                icon: "success",
                title: "User Rejected",
                showConfirmButton: false,
                timer: 1500,
            });

            await loadPending();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to reject user.",
            });
        }
    };

    return (
        <div className="w-full">
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Pending User Approvals
                </h1>
                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Review new registrations, collect the required
                    security deposit, and approve or reject.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            ) : users.length === 0 ? (
                <div className="card bg-base-100 border">
                    <div className="card-body items-center text-center py-12">
                        <p className="text-base-content/60">
                            No pending approvals.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className="card bg-base-100 border"
                        >
                            <div className="card-body p-4 sm:p-5">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold">
                                            {user.name}
                                        </h3>
                                        <p className="text-sm text-base-content/60">
                                            {user.email}
                                        </p>
                                    </div>

                                    <span
                                        className={`badge ${
                                            user.profileCompleted
                                                ? "badge-success"
                                                : "badge-warning"
                                        }`}
                                    >
                                        {user.profileCompleted
                                            ? "Profile Complete"
                                            : "Profile Incomplete"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-3">
                                    <p>
                                        <span className="text-base-content/60">
                                            Employee ID:
                                        </span>{" "}
                                        {user.employeeId || "-"}
                                    </p>
                                    <p>
                                        <span className="text-base-content/60">
                                            Phone:
                                        </span>{" "}
                                        {user.phone || "-"}
                                    </p>
                                    <p>
                                        <span className="text-base-content/60">
                                            Department:
                                        </span>{" "}
                                        {user.department}
                                    </p>
                                    <p>
                                        <span className="text-base-content/60">
                                            Designation:
                                        </span>{" "}
                                        {user.designation}
                                    </p>
                                    <p>
                                        <span className="text-base-content/60">
                                            Office Station:
                                        </span>{" "}
                                        {user.floor || "-"}
                                    </p>
                                    <p>
                                        <span className="text-base-content/60">
                                            Required Deposit:
                                        </span>{" "}
                                        ৳{user.requiredDeposit}
                                    </p>
                                </div>

                                <div className="card-actions justify-end mt-4">
                                    <button
                                        className="btn btn-sm btn-error btn-outline"
                                        onClick={() => handleReject(user)}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        className="btn btn-sm btn-success"
                                        disabled={!user.profileCompleted}
                                        onClick={() =>
                                            openApproveModal(user)
                                        }
                                    >
                                        Approve
                                    </button>
                                </div>

                                {!user.profileCompleted && (
                                    <p className="text-xs text-warning mt-1">
                                        This user must complete their
                                        profile before approval.
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <dialog id="approve_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">
                        Approve {approvingUser?.name}
                    </h3>

                    <form onSubmit={handleApprove} className="space-y-3">
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Required Deposit
                                </span>
                            </label>
                            <input
                                type="text"
                                disabled
                                value={`৳${
                                    approvingUser?.requiredDeposit || 0
                                }`}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Received Amount
                                </span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={receivedAmount}
                                onChange={(e) =>
                                    setReceivedAmount(e.target.value)
                                }
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Payment Method
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

                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                    document
                                        .getElementById("approve_modal")
                                        ?.close()
                                }
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={saving}
                            >
                                {saving ? (
                                    <span className="loading loading-spinner loading-sm" />
                                ) : (
                                    "Approve User"
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

export default PendingApprovals;
