import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

const DepartmentDesignation = () => {
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [departmentName, setDepartmentName] = useState("");
    const [designationName, setDesignationName] = useState("");

    const [loading, setLoading] = useState(true);

    // =========================
    // LOAD DATA
    // =========================
    const loadData = async () => {
        try {
            setLoading(true);

            const [departmentResponse, designationResponse] =
                await Promise.all([
                    fetch(`${API_URL}/departments/all`),
                    fetch(`${API_URL}/designations/all`),
                ]);

            if (!departmentResponse.ok) {
                throw new Error(
                    `Department API error: ${departmentResponse.status}`
                );
            }

            if (!designationResponse.ok) {
                throw new Error(
                    `Designation API error: ${designationResponse.status}`
                );
            }

            const departmentData = await departmentResponse.json();
            const designationData = await designationResponse.json();

            console.log("Department API:", departmentData);
            console.log("Designation API:", designationData);

            // Handle different possible API response formats
            if (Array.isArray(departmentData)) {
                setDepartments(departmentData);
            } else if (Array.isArray(departmentData.departments)) {
                setDepartments(departmentData.departments);
            } else if (Array.isArray(departmentData.data)) {
                setDepartments(departmentData.data);
            } else {
                setDepartments([]);
            }

            if (Array.isArray(designationData)) {
                setDesignations(designationData);
            } else if (Array.isArray(designationData.designations)) {
                setDesignations(designationData.designations);
            } else if (Array.isArray(designationData.data)) {
                setDesignations(designationData.data);
            } else {
                setDesignations([]);
            }
        } catch (error) {
            console.error("Load data error:", error);

            setDepartments([]);
            setDesignations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // =========================
    // ADD DEPARTMENT
    // =========================
    const addDepartment = async (e) => {
        e.preventDefault();

        const name = departmentName.trim();

        if (!name) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/departments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(data.message || "Failed to add department");
                return;
            }

            setDepartmentName("");

            await loadData();
        } catch (error) {
            console.error("Add department error:", error);
            alert("Something went wrong while adding department.");
        }
    };

    // =========================
    // ADD DESIGNATION
    // =========================
    const addDesignation = async (e) => {
        e.preventDefault();

        const name = designationName.trim();

        if (!name) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/designations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(data.message || "Failed to add designation");
                return;
            }

            setDesignationName("");

            await loadData();
        } catch (error) {
            console.error("Add designation error:", error);
            alert("Something went wrong while adding designation.");
        }
    };

    // =========================
    // TOGGLE DEPARTMENT
    // =========================
    const toggleDepartment = async (department) => {
        try {
            const newStatus =
                department.status === "active"
                    ? "inactive"
                    : "active";

            const response = await fetch(
                `${API_URL}/departments/${department._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || data.success === false) {
                alert(data.message || "Failed to update department");
                return;
            }

            await loadData();
        } catch (error) {
            console.error("Toggle department error:", error);
            alert("Something went wrong while updating department.");
        }
    };

    // =========================
    // TOGGLE DESIGNATION
    // =========================
    const toggleDesignation = async (designation) => {
        try {
            const newStatus =
                designation.status === "active"
                    ? "inactive"
                    : "active";

            const response = await fetch(
                `${API_URL}/designations/${designation._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || data.success === false) {
                alert(data.message || "Failed to update designation");
                return;
            }

            await loadData();
        } catch (error) {
            console.error("Toggle designation error:", error);
            alert("Something went wrong while updating designation.");
        }
    };

    // =========================
    // DELETE DEPARTMENT
    // =========================
    const deleteDepartment = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this department?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/departments/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok || data.success === false) {
                alert(data.message || "Failed to delete department");
                return;
            }

            await loadData();
        } catch (error) {
            console.error("Delete department error:", error);
            alert("Something went wrong while deleting department.");
        }
    };

    // =========================
    // DELETE DESIGNATION
    // =========================
    const deleteDesignation = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this designation?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/designations/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok || data.success === false) {
                alert(data.message || "Failed to delete designation");
                return;
            }

            await loadData();
        } catch (error) {
            console.error("Delete designation error:", error);
            alert("Something went wrong while deleting designation.");
        }
    };

    return (
        <div className="w-full">
            {/* =========================
                PAGE HEADER
            ========================= */}
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Department & Designation
                </h1>

                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Manage departments and designations.
                </p>
            </div>

            {/* =========================
                MAIN GRID
            ========================= */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                {/* =========================
                    DEPARTMENTS
                ========================= */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">

                        <h2 className="card-title text-base sm:text-lg">
                            Departments
                        </h2>

                        {/* Add Department */}
                        <form
                            onSubmit={addDepartment}
                            className="flex gap-2 mt-3"
                        >
                            <input
                                type="text"
                                value={departmentName}
                                onChange={(e) =>
                                    setDepartmentName(e.target.value)
                                }
                                placeholder="Department name"
                                className="input input-bordered w-full"
                            />

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Add
                            </button>
                        </form>

                        {/* Department Table */}
                        <div className="overflow-x-auto mt-4">
                            {loading ? (
                                <div className="flex justify-center py-5">
                                    <span className="loading loading-spinner"></span>
                                </div>
                            ) : departments.length === 0 ? (
                                <div className="text-center py-8 text-base-content/50">
                                    No departments found.
                                </div>
                            ) : (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {departments.map((department) => (
                                            <tr key={department._id}>

                                                <td className="font-medium">
                                                    {department.name}
                                                </td>

                                                <td>
                                                    {department.status ===
                                                    "active" ? (
                                                        <span className="badge badge-success badge-sm">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-error badge-sm">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="flex gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleDepartment(
                                                                    department
                                                                )
                                                            }
                                                            className="btn btn-xs btn-warning"
                                                        >
                                                            {department.status ===
                                                            "active"
                                                                ? "Disable"
                                                                : "Enable"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteDepartment(
                                                                    department._id
                                                                )
                                                            }
                                                            className="btn btn-xs btn-error"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* =========================
                    DESIGNATIONS
                ========================= */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">

                        <h2 className="card-title text-base sm:text-lg">
                            Designations
                        </h2>

                        {/* Add Designation */}
                        <form
                            onSubmit={addDesignation}
                            className="flex gap-2 mt-3"
                        >
                            <input
                                type="text"
                                value={designationName}
                                onChange={(e) =>
                                    setDesignationName(e.target.value)
                                }
                                placeholder="Designation name"
                                className="input input-bordered w-full"
                            />

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Add
                            </button>
                        </form>

                        {/* Designation Table */}
                        <div className="overflow-x-auto mt-4">
                            {loading ? (
                                <div className="flex justify-center py-5">
                                    <span className="loading loading-spinner"></span>
                                </div>
                            ) : designations.length === 0 ? (
                                <div className="text-center py-8 text-base-content/50">
                                    No designations found.
                                </div>
                            ) : (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {designations.map((designation) => (
                                            <tr key={designation._id}>

                                                <td className="font-medium">
                                                    {designation.name}
                                                </td>

                                                <td>
                                                    {designation.status ===
                                                    "active" ? (
                                                        <span className="badge badge-success badge-sm">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-error badge-sm">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="flex gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleDesignation(
                                                                    designation
                                                                )
                                                            }
                                                            className="btn btn-xs btn-warning"
                                                        >
                                                            {designation.status ===
                                                            "active"
                                                                ? "Disable"
                                                                : "Enable"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteDesignation(
                                                                    designation._id
                                                                )
                                                            }
                                                            className="btn btn-xs btn-error"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>
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
        </div>
    );
};

export default DepartmentDesignation;