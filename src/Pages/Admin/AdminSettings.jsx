import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const AdminSettings = () => {
    const axiosSecure = useAxiosSecure();

    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const { data } = await axiosSecure.get("/settings");
            setSettings(data.settings);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to load settings.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateField = (field, value) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const { fridayIsWeeklyHoliday, _id, ...editable } = settings;

            await axiosSecure.patch("/admin/settings", editable);

            Swal.fire({
                icon: "success",
                title: "Settings saved",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to save settings.",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading || !settings) {
        return (
            <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl">
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Configurable business rules. Friday remains the
                    automatic weekly holiday and is not editable here.
                </p>
            </div>

            <form
                onSubmit={handleSave}
                className="card bg-base-100 border"
            >
                <div className="card-body p-4 sm:p-5 space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text">
                                Company Name
                            </span>
                        </label>
                        <input
                            type="text"
                            value={settings.companyName || ""}
                            onChange={(e) =>
                                updateField("companyName", e.target.value)
                            }
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">
                                Report Title
                            </span>
                        </label>
                        <input
                            type="text"
                            value={settings.reportTitle || ""}
                            onChange={(e) =>
                                updateField("reportTitle", e.target.value)
                            }
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Currency Symbol
                                </span>
                            </label>
                            <input
                                type="text"
                                value={settings.currency || ""}
                                onChange={(e) =>
                                    updateField("currency", e.target.value)
                                }
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Meal Deadline Hour (24h, e.g. 23 =
                                    11 PM)
                                </span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={settings.mealDeadlineHour}
                                onChange={(e) =>
                                    updateField(
                                        "mealDeadlineHour",
                                        Number(e.target.value)
                                    )
                                }
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">
                                Friday Weekly Holiday
                            </span>
                        </label>
                        <input
                            type="text"
                            disabled
                            value="Always enabled (protected)"
                            className="input input-bordered w-full opacity-60"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Security Deposit Policy
                                </span>
                            </label>
                            <select
                                value={settings.securityDepositPolicy}
                                onChange={(e) =>
                                    updateField(
                                        "securityDepositPolicy",
                                        e.target.value
                                    )
                                }
                                className="select select-bordered w-full"
                            >
                                <option value="required">Required</option>
                                <option value="optional">Optional</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Partial Deposit Policy
                                </span>
                            </label>
                            <select
                                value={settings.partialDepositPolicy}
                                onChange={(e) =>
                                    updateField(
                                        "partialDepositPolicy",
                                        e.target.value
                                    )
                                }
                                className="select select-bordered w-full"
                            >
                                <option value="block">
                                    Block approval until fully paid
                                </option>
                                <option value="allow">
                                    Allow partial deposit
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="card-actions justify-end pt-2">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                "Save Settings"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
