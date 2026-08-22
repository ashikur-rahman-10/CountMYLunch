import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const AuditLogs = () => {
    const axiosSecure = useAxiosSecure();

    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 25;

    const [entityType, setEntityType] = useState("");
    const [action, setAction] = useState("");
    const [loading, setLoading] = useState(true);

    const loadLogs = async () => {
        try {
            setLoading(true);

            const { data } = await axiosSecure.get("/admin/audit-logs", {
                params: {
                    entityType: entityType || undefined,
                    action: action || undefined,
                    page,
                    pageSize,
                },
            });

            setLogs(data.logs || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, entityType, action]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="w-full">
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Audit Logs
                </h1>
                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Every approval, rejection, payment/deposit change,
                    settlement, and configuration change is recorded
                    here.
                </p>
            </div>

            <div className="card bg-base-100 border mb-5">
                <div className="card-body p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                        value={entityType}
                        onChange={(e) => {
                            setEntityType(e.target.value);
                            setPage(1);
                        }}
                        className="select select-bordered w-full"
                    >
                        <option value="">All entity types</option>
                        <option value="User">User</option>
                        <option value="Payment">Payment</option>
                        <option value="SecurityDeposit">
                            Security Deposit
                        </option>
                        <option value="FinancialTransaction">
                            Financial Transaction
                        </option>
                        <option value="Department">Department</option>
                        <option value="Designation">Designation</option>
                        <option value="Holiday">Holiday</option>
                        <option value="Settings">Settings</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Filter by action (e.g. user_approved)"
                        value={action}
                        onChange={(e) => {
                            setAction(e.target.value);
                            setPage(1);
                        }}
                        className="input input-bordered w-full"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            ) : (
                <div className="card bg-base-100 border overflow-x-auto">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Action</th>
                                <th>Entity</th>
                                <th>Performed By</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center text-base-content/60 py-8"
                                    >
                                        No audit log entries found.
                                    </td>
                                </tr>
                            )}
                            {logs.map((log) => (
                                <tr key={log._id}>
                                    <td className="whitespace-nowrap">
                                        {new Date(
                                            log.timestamp
                                        ).toLocaleString()}
                                    </td>
                                    <td>
                                        <span className="badge badge-outline">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td>
                                        {log.entityType}
                                        {log.entityId
                                            ? ` (${log.entityId})`
                                            : ""}
                                    </td>
                                    <td>{log.performedBy}</td>
                                    <td className="max-w-xs">
                                        <details>
                                            <summary className="cursor-pointer text-xs text-primary">
                                                View
                                            </summary>
                                            <pre className="text-xs whitespace-pre-wrap break-all mt-1">
                                                {JSON.stringify(
                                                    {
                                                        old: log.oldData,
                                                        new: log.newData,
                                                    },
                                                    null,
                                                    2
                                                )}
                                            </pre>
                                        </details>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {total > 0 && (
                <div className="flex justify-center items-center gap-3 mt-4">
                    <button
                        className="btn btn-sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="btn btn-sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AuditLogs;
