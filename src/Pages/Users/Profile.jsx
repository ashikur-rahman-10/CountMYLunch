import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProviders";

const Profile = () => {
    const { user } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [formData, setFormData] = useState({
        employeeId: "",
        phone: "",
        departmentId: "",
        designationId: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =========================
    // Load Profile + Options
    // =========================

    useEffect(() => {
        if (!user?.email) {
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                // Get user profile
                const userResponse = await fetch(
                    `http://localhost:5000/users/${user.email}`
                );

                if (!userResponse.ok) {
                    throw new Error("Failed to load user profile");
                }

                const userData = await userResponse.json();

                setProfile(userData);

                setFormData({
                    employeeId: userData.employeeId || "",
                    phone: userData.phone || "",
                    departmentId: userData.departmentId || "",
                    designationId: userData.designationId || "",
                });


                // Get departments
                const departmentResponse = await fetch(
                    "http://localhost:5000/departments"
                );

                if (!departmentResponse.ok) {
                    throw new Error("Failed to load departments");
                }

                const departmentData =
                    await departmentResponse.json();

                setDepartments(departmentData);


                // Get designations
                const designationResponse = await fetch(
                    "http://localhost:5000/designations"
                );

                if (!designationResponse.ok) {
                    throw new Error("Failed to load designations");
                }

                const designationData =
                    await designationResponse.json();

                setDesignations(designationData);

            } catch (error) {
                console.error(error);

                setError(
                    error.message ||
                    "Something went wrong while loading profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();

    }, [user?.email]);


    // =========================
    // Handle Input Change
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };


    // =========================
    // Submit Profile
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.email) {
            setError("User information not found.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const updatedData = {
                employeeId: formData.employeeId,
                phone: formData.phone,
                departmentId: formData.departmentId,
                designationId: formData.designationId,

                profileCompleted: true,

                updatedAt: new Date(),
            };


            const response = await fetch(
                `http://localhost:5000/users/${user.email}`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(updatedData),
                }
            );


            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update profile."
                );
            }


            setProfile((previousProfile) => ({
                ...previousProfile,
                ...updatedData,
            }));


            setSuccess(
                "Profile updated successfully."
            );

        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                "Failed to update profile."
            );

        } finally {
            setSaving(false);
        }
    };


    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold">
                    Profile
                </h1>

                <p className="text-base-content/60 mt-1">
                    Manage your profile.
                </p>

                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-md"></span>
                </div>
            </div>
        );
    }


    // =========================
    // Page
    // =========================

    return (
        <div>

            {/* Page Header */}

            <h1 className="text-2xl font-bold">
                Profile
            </h1>

            <p className="text-base-content/60 mt-1">
                Manage your profile.
            </p>


            {/* Error */}

            {error && (
                <div className="alert alert-error mt-6">
                    <span>{error}</span>
                </div>
            )}


            {/* Success */}

            {success && (
                <div className="alert alert-success mt-6">
                    <span>{success}</span>
                </div>
            )}


            {/* Profile Card */}

            <div className="card bg-base-100 border mt-6 max-w-3xl">

                <div className="card-body">

                    <h2 className="card-title">
                        Personal Information
                    </h2>


                    {/* Google Account Information */}

                    <div className="flex items-center gap-4 py-4 border-b">

                        {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="w-14 h-14 rounded-full"
                            />
                        ) : (
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-14">
                                    <span className="text-xl">
                                        {user?.displayName
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="font-semibold">
                                {user?.displayName}
                            </h3>

                            <p className="text-sm text-base-content/60">
                                {user?.email}
                            </p>
                        </div>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 mt-4"
                    >

                        {/* Name */}

                        <div>

                            <label className="label">
                                <span className="label-text">
                                    Name
                                </span>
                            </label>

                            <input
                                type="text"
                                value={
                                    profile?.name ||
                                    user?.displayName ||
                                    ""
                                }
                                className="input input-bordered w-full"
                                disabled
                            />

                            <p className="text-xs text-base-content/50 mt-1">
                                Name is managed through your Google account.
                            </p>

                        </div>


                        {/* Email */}

                        <div>

                            <label className="label">
                                <span className="label-text">
                                    Email
                                </span>
                            </label>

                            <input
                                type="email"
                                value={
                                    profile?.email ||
                                    user?.email ||
                                    ""
                                }
                                className="input input-bordered w-full"
                                disabled
                            />

                        </div>


                        {/* Employee ID */}

                        <div>

                            <label className="label">
                                <span className="label-text">
                                    Employee ID
                                </span>
                            </label>

                            <input
                                type="text"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                placeholder="Enter employee ID"
                                className="input input-bordered w-full"
                                required
                            />

                        </div>


                        {/* Phone */}

                        <div>

                            <label className="label">
                                <span className="label-text">
                                    Phone Number
                                </span>
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="01XXXXXXXXX"
                                className="input input-bordered w-full"
                                required
                            />

                        </div>


                        {/* Department */}

                        <div>

                            <label className="label">
                                <span className="label-text">
                                    Department
                                </span>
                            </label>

                            <select
                                name="departmentId"
                                value={formData.departmentId}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                                required
                            >

                                <option value="">
                                    Select department
                                </option>

                                {departments.map(
                                    (department) => (
                                        <option
                                            key={department._id}
                                            value={department._id}
                                        >
                                            {department.name}
                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        {/* Designation */}

                        <div>

                            <label className="label">
                                <span className="label-text">
                                    Designation
                                </span>
                            </label>

                            <select
                                name="designationId"
                                value={formData.designationId}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                                required
                            >

                                <option value="">
                                    Select designation
                                </option>

                                {designations.map(
                                    (designation) => (
                                        <option
                                            key={designation._id}
                                            value={designation._id}
                                        >
                                            {designation.name}
                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        {/* Meal Rate Information */}

                        {formData.designationId && (
                            <div className="bg-base-200 rounded-lg p-4">

                                <p className="text-sm text-base-content/60">
                                    Current Meal Rate
                                </p>

                                <p className="text-xl font-bold mt-1">

                                    ৳
                                    {
                                        designations.find(
                                            (item) =>
                                                item._id ===
                                                formData.designationId
                                        )?.mealRate ?? "-"
                                    }

                                    <span className="text-sm font-normal text-base-content/60 ml-1">
                                        / meal
                                    </span>

                                </p>

                                <p className="text-xs text-base-content/50 mt-1">
                                    Meal rate is determined by your designation.
                                </p>

                            </div>
                        )}


                        {/* Submit */}

                        <div className="pt-2">

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >

                                {saving ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Profile"
                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default Profile;