import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const AdminUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [floorFilter, setFloorFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [profileFilter, setProfileFilter] = useState("");

    const loadUsers = async () => {
        try {
            setLoading(true);

            const { data } = await axiosSecure.get("/users");

            if (data.success) {
                setUsers(data.users || []);
            }
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateRole = async (id, role) => {
        try {
            await axiosSecure.patch(`/users/role/${id}`, { role });

            loadUsers();
        } catch (error) {
            console.error("Role update error:", error);
            alert(
                error?.response?.data?.message ||
                    "Failed to update user role."
            );
        }
    };

    const filteredUsers = users.filter((user) => {
        const searchText = search.trim().toLowerCase();

        const matchesSearch =
            !searchText ||
            user.name?.toLowerCase().includes(searchText) ||
            user.email?.toLowerCase().includes(searchText);

        const matchesFloor =
            !floorFilter ||
            String(user.floor) === floorFilter;

        const matchesRole =
            !roleFilter ||
            user.role === roleFilter;

        const matchesProfile =
            !profileFilter ||
            (profileFilter === "completed"
                ? user.profileCompleted === true
                : user.profileCompleted !== true);

        return (
            matchesSearch &&
            matchesFloor &&
            matchesRole &&
            matchesProfile
        );
    });

    const totalUsers = users.length;

    const totalAdmins = users.filter(
        (user) => user.role === "admin"
    ).length;

    const completedProfiles = users.filter(
        (user) => user.profileCompleted === true
    ).length;

    const incompleteProfiles = users.filter(
        (user) => user.profileCompleted !== true
    ).length;

    return (
        <div className="w-full">

            {/* Page Header */}
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    User Management
                </h1>

                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Manage CountMyLunch users.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-5">

                {/* Total Users */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">
                        <p className="text-sm text-base-content/60">
                            Total Users
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold">
                            {totalUsers}
                        </h2>
                    </div>
                </div>

                {/* Admins */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">
                        <p className="text-sm text-base-content/60">
                            Admins
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold">
                            {totalAdmins}
                        </h2>
                    </div>
                </div>

                {/* Completed */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">
                        <p className="text-sm text-base-content/60">
                            Completed Profiles
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold text-success">
                            {completedProfiles}
                        </h2>
                    </div>
                </div>

                {/* Incomplete */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">
                        <p className="text-sm text-base-content/60">
                            Incomplete Profiles
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold text-warning">
                            {incompleteProfiles}
                        </h2>
                    </div>
                </div>

            </div>

            {/* Filters */}
            <div className="card bg-base-100 border mb-5">
                <div className="card-body p-4 sm:p-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search name or email"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="input input-bordered w-full"
                        />

                        {/* Floor */}
                        <select
                            value={floorFilter}
                            onChange={(e) =>
                                setFloorFilter(e.target.value)
                            }
                            className="select select-bordered w-full"
                        >
                            <option value="">
                                All Floors
                            </option>

                            <option value="1">
                                Floor 1
                            </option>

                            <option value="2">
                                Floor 2
                            </option>

                            <option value="3">
                                Floor 3
                            </option>

                            <option value="4">
                                Floor 4
                            </option>

                            <option value="5">
                                Floor 5
                            </option>

                            <option value="6">
                                Floor 6
                            </option>

                            <option value="7">
                                Floor 7
                            </option>

                            <option value="8">
                                Floor 8
                            </option>

                            <option value="9">
                                Floor 9
                            </option>

                            <option value="10">
                                Floor 10
                            </option>

                            <option value="11">
                                Floor 11
                            </option>

                            <option value="12">
                                Floor 12
                            </option>
                        </select>

                        {/* Role */}
                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(e.target.value)
                            }
                            className="select select-bordered w-full"
                        >
                            <option value="">
                                All Roles
                            </option>

                            <option value="user">
                                User
                            </option>

                            <option value="admin">
                                Admin
                            </option>
                        </select>

                        {/* Profile */}
                        <select
                            value={profileFilter}
                            onChange={(e) =>
                                setProfileFilter(e.target.value)
                            }
                            className="select select-bordered w-full"
                        >
                            <option value="">
                                All Profiles
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                            <option value="incomplete">
                                Incomplete
                            </option>
                        </select>

                    </div>

                </div>
            </div>

            {/* Users Table */}
            <div className="card bg-base-100 border">
                <div className="card-body p-4 sm:p-5">

                    <div className="flex justify-between items-center mb-3">
                        <h2 className="card-title text-base sm:text-lg">
                            Users
                        </h2>

                        <span className="badge badge-neutral">
                            {filteredUsers.length}
                        </span>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center py-10">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading &&
                        filteredUsers.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-base-content/60">
                                    No users found.
                                </p>
                            </div>
                        )}

                    {/* Table */}
                    {!loading &&
                        filteredUsers.length > 0 && (
                            <div className="overflow-x-auto">

                                <table className="table">

                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Department</th>
                                            <th>Designation</th>
                                            <th>Floor</th>
                                            <th>Profile</th>
                                            <th>Role</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {filteredUsers.map((user) => (
                                            <tr key={user._id}>

                                                {/* Name */}
                                                <td>
                                                    <div className="font-medium">
                                                        {user.name || "No name"}
                                                    </div>
                                                </td>

                                                {/* Email */}
                                                <td>
                                                    {user.email}
                                                </td>

                                                {/* Department */}
                                                <td>
                                                    {user.department ||
                                                        "Not set"}
                                                </td>

                                                {/* Designation */}
                                                <td>
                                                    {user.designation ||
                                                        "Not set"}
                                                </td>

                                                {/* Floor */}
                                                <td>
                                                    {user.floor
                                                        ? `Floor ${user.floor}`
                                                        : "Not set"}
                                                </td>

                                                {/* Profile */}
                                                <td>
                                                    {user.profileCompleted ? (
                                                        <span className="badge badge-success badge-sm">
                                                            Complete
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-warning badge-sm">
                                                            Incomplete
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Role */}
                                                <td>
                                                    {user.role === "admin" ? (
                                                        <span className="badge badge-info badge-sm">
                                                            Admin
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-sm">
                                                            User
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Action */}
                                                <td>

                                                    {user.role === "admin" ? (
                                                        <button
                                                            onClick={() =>
                                                                updateRole(
                                                                    user._id,
                                                                    "user"
                                                                )
                                                            }
                                                            className="btn btn-xs btn-warning"
                                                        >
                                                            Make User
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                updateRole(
                                                                    user._id,
                                                                    "admin"
                                                                )
                                                            }
                                                            className="btn btn-xs btn-primary"
                                                        >
                                                            Make Admin
                                                        </button>
                                                    )}

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

export default AdminUsers;