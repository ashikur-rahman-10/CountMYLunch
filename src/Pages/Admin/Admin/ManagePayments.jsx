import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure";

const ManagePayments = () => {
    const axiosSecure = useAxiosSecure();

    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [selectedUser, setSelectedUser] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [editingPayment, setEditingPayment] = useState(null);
    const [editAmount, setEditAmount] = useState("");
    const [editPaymentDate, setEditPaymentDate] = useState("");

    const loadUsers = async () => {
        try {
            const { data } = await axiosSecure.get(`/users`);

            setUsers(data.users || []);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to load users.",
            });
        }
    };

    const loadPayments = async () => {
        try {
            setLoading(true);

            const { data } = await axiosSecure.get(
                `/admin/payments`
            );

            setPayments(data.payments || []);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to load payments.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
        loadPayments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddPayment = async (e) => {
        e.preventDefault();

        if (!selectedUser) {
            return Swal.fire({
                icon: "warning",
                title: "Select User",
                text: "Please select a user first.",
            });
        }

        if (!amount || Number(amount) <= 0) {
            return Swal.fire({
                icon: "warning",
                title: "Invalid Amount",
                text: "Please enter a valid payment amount.",
            });
        }

        try {
            setSaving(true);

            // addedBy is no longer sent from the client -- the backend
            // now stamps it from the verified admin's own token so it
            // can't be spoofed.
            await axiosSecure.post(`/admin/payments`, {
                userEmail: selectedUser,
                amount: Number(amount),
                paymentDate,
            });

            Swal.fire({
                icon: "success",
                title: "Payment Added",
                text: "Payment has been added successfully.",
                showConfirmButton: false,
                timer: 1500,
            });

            setSelectedUser("");
            setAmount("");
            setPaymentDate(
                new Date().toISOString().split("T")[0]
            );

            loadPayments();
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to add payment.",
            });
        } finally {
            setSaving(false);
        }
    };

    const openEditModal = (payment) => {
        setEditingPayment(payment);
        setEditAmount(payment.amount || "");

        const date = payment.paymentDate
            ? new Date(payment.paymentDate)
            : new Date();

        setEditPaymentDate(
            date.toISOString().split("T")[0]
        );

        document
            .getElementById("edit_payment_modal")
            ?.showModal();
    };

    const handleUpdatePayment = async (e) => {
        e.preventDefault();

        if (!editingPayment) return;

        if (!editAmount || Number(editAmount) <= 0) {
            return Swal.fire({
                icon: "warning",
                title: "Invalid Amount",
                text: "Please enter a valid amount.",
            });
        }

        try {
            setSaving(true);

            await axiosSecure.patch(
                `/admin/payments/${editingPayment._id}`,
                {
                    amount: Number(editAmount),
                    paymentDate: editPaymentDate,
                }
            );

            document
                .getElementById("edit_payment_modal")
                ?.close();

            Swal.fire({
                icon: "success",
                title: "Updated",
                text: "Payment updated successfully.",
                showConfirmButton: false,
                timer: 1500,
            });

            setEditingPayment(null);
            loadPayments();
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to update payment.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePayment = async (id) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Delete Payment?",
            text: "This payment record will be permanently deleted.",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosSecure.delete(`/admin/payments/${id}`);

            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Payment deleted successfully.",
                showConfirmButton: false,
                timer: 1500,
            });

            loadPayments();
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to delete payment.",
            });
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getUserName = (email) => {
        const user = users.find(
            (item) => item.email === email
        );

        return user?.name || email;
    };

    return (
        <div className="w-full">
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Manage Payments
                </h1>

                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Add and manage user cash payments.
                </p>
            </div>

            {/* Add Payment */}
            <div className="card bg-base-100 border mb-5 sm:mb-6">
                <div className="card-body p-4 sm:p-5">
                    <h2 className="card-title text-base sm:text-lg mb-2">
                        Add Payment
                    </h2>

                    <form
                        onSubmit={handleAddPayment}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    User
                                </span>
                            </label>

                            <select
                                className="select select-bordered w-full"
                                value={selectedUser}
                                onChange={(e) =>
                                    setSelectedUser(e.target.value)
                                }
                            >
                                <option value="">
                                    Select user
                                </option>

                                {users.map((user) => (
                                    <option
                                        key={user._id}
                                        value={user.email}
                                    >
                                        {user.name} - {user.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Amount
                                </span>
                            </label>

                            <label className="input input-bordered flex items-center gap-2">
                                <span>৳</span>

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    className="grow"
                                />
                            </label>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Payment Date
                                </span>
                            </label>

                            <input
                                type="date"
                                className="input input-bordered w-full"
                                value={paymentDate}
                                onChange={(e) =>
                                    setPaymentDate(e.target.value)
                                }
                            />
                        </div>

                        <div className="md:col-span-3">
                            <button
                                type="submit"
                                className="btn btn-primary w-full md:w-auto"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Saving...
                                    </>
                                ) : (
                                    "Add Payment"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Payments Table */}
            <div className="card bg-base-100 border">
                <div className="card-body p-4 sm:p-5">
                    <h2 className="card-title text-base sm:text-lg mb-3">
                        Payment Records
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-base-content/60">
                                No payment records found.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>User</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {payments.map(
                                        (payment, index) => (
                                            <tr key={payment._id}>
                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <div>
                                                        <div className="font-semibold">
                                                            {getUserName(
                                                                payment.userEmail
                                                            )}
                                                        </div>

                                                        <div className="text-xs text-base-content/60">
                                                            {
                                                                payment.userEmail
                                                            }
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        payment.paymentDate
                                                    )}
                                                </td>

                                                <td className="font-semibold">
                                                    ৳
                                                    {Number(
                                                        payment.amount || 0
                                                    )}
                                                </td>

                                                <td>
                                                    <span className="badge badge-ghost">
                                                        {payment.paymentMethod ||
                                                            "Cash"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="badge badge-success">
                                                        {payment.status ||
                                                            "Paid"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-outline"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    payment
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-error btn-outline"
                                                            onClick={() =>
                                                                handleDeletePayment(
                                                                    payment._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Payment Modal */}
            <dialog
                id="edit_payment_modal"
                className="modal"
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">
                        Edit Payment
                    </h3>

                    {editingPayment && (
                        <form
                            onSubmit={handleUpdatePayment}
                            className="space-y-4"
                        >
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        User
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={
                                        editingPayment.userEmail
                                    }
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Amount
                                    </span>
                                </label>

                                <label className="input input-bordered flex items-center gap-2">
                                    <span>৳</span>

                                    <input
                                        type="number"
                                        min="1"
                                        value={editAmount}
                                        onChange={(e) =>
                                            setEditAmount(
                                                e.target.value
                                            )
                                        }
                                        className="grow"
                                    />
                                </label>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Payment Date
                                    </span>
                                </label>

                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    value={editPaymentDate}
                                    onChange={(e) =>
                                        setEditPaymentDate(
                                            e.target.value
                                        )
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
                                                "edit_payment_modal"
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
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Payment"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default ManagePayments;