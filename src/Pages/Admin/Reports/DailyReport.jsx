import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useExcelDownload from "../../../Hooks/UseExcelDownload";

const DailyReport = () => {
    const axiosSecure = useAxiosSecure();
    const downloadExcel = useExcelDownload();

    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [officeStation, setOfficeStation] = useState("");
    const [religion, setReligion] = useState("");
    const [search, setSearch] = useState("");

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [deptRes, desigRes] = await Promise.all([
                    axiosSecure.get("/departments/all"),
                    axiosSecure.get("/designations/all"),
                ]);
                setDepartments(deptRes.data.departments || []);
                setDesignations(desigRes.data.designations || []);
            } catch (error) {
                console.error(error);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const buildParams = () => ({
        date,
        department: department || undefined,
        designation: designation || undefined,
        officeStation: officeStation || undefined,
        religion: religion || undefined,
        search: search || undefined,
    });

    const runReport = async () => {
        try {
            setLoading(true);
            const { data } = await axiosSecure.get(
                "/admin/reports/daily",
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
                    "Failed to generate report.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleReset = () => {
        setDepartment("");
        setDesignation("");
        setOfficeStation("");
        setReligion("");
        setSearch("");
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);

            const params = new URLSearchParams(
                Object.entries(buildParams()).filter(
                    ([, value]) => value !== undefined
                )
            );

            await downloadExcel(
                `/admin/reports/daily/excel?${params.toString()}`,
                `daily-lunch-report-${date}.xlsx`
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

    return (
        <div className="w-full">
            <div className="mb-5 sm:mb-6 print:hidden">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Daily Lunch Report
                </h1>
                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Labaid Kalabagan Employee List for Lunch
                </p>
            </div>

            <div className="card bg-base-100 border mb-5 print:hidden">
                <div className="card-body p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input input-bordered w-full"
                    />

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

                    <select
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="select select-bordered w-full"
                    >
                        <option value="">All Designations</option>
                        {designations.map((d) => (
                            <option key={d._id} value={d._id}>
                                {d.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Office Station"
                        value={officeStation}
                        onChange={(e) => setOfficeStation(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <input
                        type="text"
                        placeholder="Religion"
                        value={religion}
                        onChange={(e) => setReligion(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <input
                        type="text"
                        placeholder="Search employee"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <div className="lg:col-span-6 flex flex-wrap gap-2">
                        <button
                            className="btn btn-primary"
                            onClick={runReport}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                "Search"
                            )}
                        </button>
                        <button className="btn" onClick={handleReset}>
                            Reset
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => window.print()}
                        >
                            Print
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
                        <h2 className="text-center font-bold text-lg">
                            Labaid Kalabagan Employee List for Lunch
                        </h2>
                        <p className="text-center text-sm text-base-content/60 mb-4">
                            Date: {report.dateString}
                            {report.isFriday && " (Friday - no lunch)"}
                            {report.isHoliday &&
                                ` (${
                                    report.holidayName || "Holiday"
                                } - no lunch)`}
                        </p>

                        <div className="overflow-x-auto">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th>Employee Name</th>
                                        <th>Employee ID</th>
                                        <th>Department</th>
                                        <th>Designation</th>
                                        <th>Office Station</th>
                                        <th>Phone</th>
                                        <th>Religion</th>
                                        <th className="text-right">
                                            Meal Rate
                                        </th>
                                        <th className="text-center">
                                            Meal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.rows.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={10}
                                                className="text-center text-base-content/60 py-8"
                                            >
                                                No countable meals for
                                                this date.
                                            </td>
                                        </tr>
                                    )}
                                    {report.rows.map((row) => (
                                        <tr key={row.sl}>
                                            <td>{row.sl}</td>
                                            <td>{row.employeeName}</td>
                                            <td>{row.employeeId}</td>
                                            <td>{row.department}</td>
                                            <td>{row.designation}</td>
                                            <td>{row.officeStation}</td>
                                            <td>{row.phone}</td>
                                            <td>{row.religion}</td>
                                            <td className="text-right">
                                                ৳{row.mealRate}
                                            </td>
                                            <td className="text-center">
                                                {row.meal}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {report.rows.length > 0 && (
                                    <tfoot>
                                        <tr className="font-semibold">
                                            <td colSpan={8}>
                                                Total Employee:{" "}
                                                {report.totalEmployees}
                                            </td>
                                            <td className="text-right">
                                                ৳{report.totalAmount}
                                            </td>
                                            <td className="text-center">
                                                {report.totalMeal}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyReport;
