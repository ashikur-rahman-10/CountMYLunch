import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const AdminHolidays = () => {
    const axiosSecure = useAxiosSecure();
    const [holidays, setHolidays] = useState([]);

    const [date, setDate] = useState("");
    const [name, setName] = useState("");

    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // ==============================
    // LOAD HOLIDAYS
    // ==============================

    const loadHolidays = async () => {
        try {
            setLoading(true);

            const { data } = await axiosSecure.get(`/holidays`);

            setHolidays(data.holidays || []);
        } catch (error) {
            console.error(
                "Load holidays error:",
                error
            );

            setHolidays([]);

            alert(
                error?.response?.data?.message ||
                    "Failed to load holidays."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHolidays();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ==============================
    // ADD HOLIDAY
    // ==============================

    const handleAddHoliday = async (e) => {
        e.preventDefault();

        if (!date) {
            alert("Please select a holiday date.");
            return;
        }

        try {
            setAdding(true);

            await axiosSecure.post(`/holidays`, {
                date,
                name,
            });

            alert(
                "Holiday added successfully."
            );

            setDate("");
            setName("");

            await loadHolidays();
        } catch (error) {
            console.error(
                "Add holiday error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                    "Failed to add holiday."
            );
        } finally {
            setAdding(false);
        }
    };

    // ==============================
    // DELETE HOLIDAY
    // ==============================

    const handleDeleteHoliday = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this holiday?"
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(id);

            await axiosSecure.delete(`/holidays/${id}`);

            alert(
                "Holiday deleted successfully."
            );

            await loadHolidays();
        } catch (error) {
            console.error(
                "Delete holiday error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                    "Failed to delete holiday."
            );
        } finally {
            setDeletingId(null);
        }
    };

    // ==============================
    // FORMAT DATE
    // ==============================

    const formatDate = (dateString) => {
        if (!dateString) return "-";

        return new Date(
            `${dateString}T00:00:00`
        ).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // ==============================
    // CHECK FRIDAY
    // ==============================

    const isFriday = (dateString) => {
        if (!dateString) return false;

        const selectedDate = new Date(
            `${dateString}T00:00:00`
        );

        return selectedDate.getDay() === 5;
    };

    return (
        <div className="w-full">

            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Holiday Management
                </h1>

                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Manage holidays for the meal system.
                </p>
            </div>

            {/* =========================
                ADD HOLIDAY
            ========================= */}

            <div className="card bg-base-100 border mb-6">
                <div className="card-body p-5 sm:p-6">

                    <h2 className="card-title text-base sm:text-lg">
                        Add Holiday
                    </h2>

                    <p className="text-sm text-base-content/60 mb-4">
                        Friday is automatically treated as
                        a holiday and cannot be added manually.
                    </p>

                    <form
                        onSubmit={handleAddHoliday}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >

                        {/* DATE */}

                        <div>
                            <label className="label">
                                <span className="label-text font-medium">
                                    Holiday Date
                                </span>
                            </label>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    setDate(
                                        e.target.value
                                    )
                                }
                                className="input input-bordered w-full"
                            />

                            {isFriday(date) && (
                                <p className="text-error text-xs mt-2">
                                    Friday is already an
                                    automatic holiday.
                                </p>
                            )}
                        </div>

                        {/* NAME */}

                        <div>
                            <label className="label">
                                <span className="label-text font-medium">
                                    Holiday Name
                                </span>
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                placeholder="e.g. Eid-ul-Fitr"
                                className="input input-bordered w-full"
                            />
                        </div>

                        {/* BUTTON */}

                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={
                                    adding ||
                                    !date ||
                                    isFriday(date)
                                }
                                className="btn btn-primary w-full"
                            >
                                {adding ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Adding...
                                    </>
                                ) : (
                                    "Add Holiday"
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* =========================
                HOLIDAY LIST
            ========================= */}

            <div className="card bg-base-100 border">

                <div className="card-body p-5 sm:p-6">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                        <h2 className="card-title text-base sm:text-lg">
                            Holiday List
                        </h2>

                        <span className="badge badge-neutral">
                            {holidays.length} Holiday
                            {holidays.length !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>

                    <div className="overflow-x-auto mt-4">

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        ) : holidays.length === 0 ? (
                            <div className="text-center py-10 text-base-content/50">
                                No holidays added yet.
                            </div>
                        ) : (
                            <table className="table">

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Holiday</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {holidays.map(
                                        (
                                            holiday,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    holiday._id
                                                }
                                            >
                                                <td>
                                                    {index +
                                                        1}
                                                </td>

                                                <td className="font-medium">
                                                    {formatDate(
                                                        holiday.date
                                                    )}
                                                </td>

                                                <td>
                                                    <div>
                                                        <p className="font-semibold">
                                                            {
                                                                holiday.name
                                                            }
                                                        </p>

                                                        <p className="text-xs text-base-content/50">
                                                            {
                                                                holiday.date
                                                            }
                                                        </p>
                                                    </div>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteHoliday(
                                                                holiday._id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            holiday._id
                                                        }
                                                        className="btn btn-error btn-sm"
                                                    >
                                                        {deletingId ===
                                                        holiday._id ? (
                                                            <>
                                                                <span className="loading loading-spinner loading-xs"></span>
                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            "Delete"
                                                        )}
                                                    </button>
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

export default AdminHolidays;