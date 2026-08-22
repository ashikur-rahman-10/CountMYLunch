import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useExcelDownload from "../../../Hooks/UseExcelDownload";

const MonthlyReport = () => {
    const axiosSecure = useAxiosSecure();
    const downloadExcel = useExcelDownload();

    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);

    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState("");
    const [search, setSearch] = useState("");

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axiosSecure.get(
                    "/departments/all"
                );
                setDepartments(data.departments || []);
            } catch (error) {
                console.error(error);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const buildParams = () => ({
        year,
        month,
        department: department || undefined,
        search: search || undefined,
    });

    const runReport = async () => {
        try {
            setLoading(true);
            const { data } = await axiosSecure.get(
                "/admin/reports/monthly",
                { params: buildParams() }
            );
            setReport(data.report);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to generate monthly report.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDownload = async () => {
        try {
            setDownloading(true);

            const params = new URLSearchParams(
                Object.entries(buildParams()).filter(
                    ([, value]) => value !== undefined
                )
            );

            await downloadExcel(
                `/admin/reports/monthly/excel?${params.toString()}`,
                `monthly-lunch-report-${year}-${String(month).padStart(
                    2,
                    "0"
                )}.xlsx`
            );
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Download failed",
                text:
                    error?.response?.data?.message ||
                    "Failed to download Excel file.",
            });
        } finally {
            setDownloading(false);
        }
    };

    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
    const yearOptions = Array.from(
        { length: 6 },
        (_, i) => now.getFullYear() - 3 + i
    );

    return (
        <div className="w-full">
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Monthly Lunch Report
                </h1>
                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Date columns are generated dynamically for the
                    selected month -- Fridays and holidays are excluded.
                </p>
            </div>

            <div className="card bg-base-100 border mb-5">
                <div className="card-body p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="select select-bordered w-full"
                    >
                        {monthOptions.map((m) => (
                            <option key={m} value={m}>
                                {new Date(2000, m - 1, 1).toLocaleString(
                                    "en-GB",
                                    { month: "long" }
                                )}
                            </option>
                        ))}
                    </select>

                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="select select-bordered w-full"
                    >
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>

                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="select select-bordered w-full"
                    >
                        <option value="">All Departments</option>
                        {departments.map((d) => (
                            <option key={d._id} value={d._id}>
                                {d.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Search employee"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <div className="flex flex-wrap gap-2">
                        <button
                            className="btn btn-primary"
                            onClick={runReport}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                "Generate"
                            )}
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={handleDownload}
                            disabled={downloading}
                        >
                            {downloading ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                "Download Excel"
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {report && (
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">
                        <h2 className="text-center font-bold text-lg mb-1">
                            Labaid Kalabagan Employee List for Lunch
                        </h2>
                        <p className="text-center text-sm text-base-content/60 mb-4">
                            {new Date(
                                report.year,
                                report.month - 1,
                                1
                            ).toLocaleDateString("en-GB", {
                                month: "long",
                                year: "numeric",
                            })}
                        </p>

                        <div className="overflow-x-auto">
                            <table className="table table-xs">
                                <thead>
                                    <tr>
                                        <th className="sticky left-0 bg-base-100">
                                            SL
                                        </th>
                                        <th className="sticky left-8 bg-base-100">
                                            Employee
                                        </th>
                                        <th>Emp ID</th>
                                        <th>Dept</th>
                                        <th>Designation</th>
                                        <th>Station</th>
                                        <th>Religion</th>
                                        <th>Security</th>
                                        <th>Rate</th>
                                        {report.workingDates.map((meta) => (
                                            <th
                                                key={meta.dateString}
                                                className="text-center"
                                                title={meta.dateString}
                                            >
                                                {new Date(
                                                    meta.date
                                                ).getDate()}
                                            </th>
                                        ))}
                                        <th>Total Meal</th>
                                        <th>Total Amt</th>
                                        <th>Opening</th>
                                        <th>Paid</th>
                                        <th>Adj.</th>
                                        <th>Due</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.rows.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={
                                                    15 +
                                                    report.workingDates
                                                        .length
                                                }
                                                className="text-center text-base-content/60 py-8"
                                            >
                                                No employees found for
                                                this filter.
                                            </td>
                                        </tr>
                                    )}

                                    {report.rows.map((row) => (
                                        <tr key={row.sl}>
                                            <td>{row.sl}</td>
                                            <td className="whitespace-nowrap">
                                                {row.employeeName}
                                            </td>
                                            <td>{row.employeeId}</td>
                                            <td>{row.department}</td>
                                            <td>{row.designation}</td>
                                            <td>{row.officeStation}</td>
                                            <td>{row.religion}</td>
                                            <td>{row.securityAmount}</td>
                                            <td>{row.mealRate}</td>
                                            {row.dailyMarks
                                                .filter(
                                                    (mark) =>
                                                        !mark.isFriday &&
                                                        !mark.isHoliday
                                                )
                                                .map((mark) => (
                                                    <td
                                                        key={
                                                            mark.dateString
                                                        }
                                                        className="text-center"
                                                    >
                                                        {mark.taken
                                                            ? 1
                                                            : ""}
                                                    </td>
                                                ))}
                                            <td className="font-semibold">
                                                {row.totalMeal}
                                            </td>
                                            <td className="font-semibold">
                                                ৳{row.totalAmount}
                                            </td>
                                            <td>৳{row.openingBalance}</td>
                                            <td>৳{row.paidAdvance}</td>
                                            <td>৳{row.adjustments}</td>
                                            <td className="font-semibold">
                                                ৳{row.dueAmount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {report.rows.length > 0 && (
                                    <tfoot>
                                        <tr className="font-bold">
                                            <td
                                                colSpan={
                                                    9 +
                                                    report.workingDates
                                                        .length
                                                }
                                            >
                                                Grand Total
                                            </td>
                                            <td>
                                                {report.grandTotalMeal}
                                            </td>
                                            <td>
                                                ৳{report.grandTotalAmount}
                                            </td>
                                            <td colSpan={4} />
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>

                        <p className="text-xs text-base-content/50 mt-2">
                            Weekly quantity/amount subtotals are included
                            in the downloaded Excel file (separate
                            "Weekly Totals" sheet) to keep this on-screen
                            grid readable.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthlyReport;
