import React from 'react'

const UserDashboard = () => {
    return (
     
        <div className="w-full">

            {/* Page Header */}
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Dashboard
                </h1>

                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                    Welcome back! Here is your meal summary.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">

                {/* Today's Meal */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">
                        <p className="text-sm text-base-content/60">
                            Today's Meal
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold">
                            1
                        </h2>

                        <p className="text-sm text-success">
                            Meal counted
                        </p>
                    </div>
                </div>

                {/* Meal Status */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">
                        <p className="text-sm text-base-content/60">
                            Meal Status
                        </p>

                        <h2 className="text-2xl font-bold text-success">
                            ON
                        </h2>

                        <p className="text-sm text-base-content/60">
                            Active until you turn it off
                        </p>

                        <button className="btn btn-sm btn-error mt-2 w-full sm:w-fit">
                            Turn Off Meal
                        </button>
                    </div>
                </div>

                {/* Monthly Bill */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">
                        <p className="text-sm text-base-content/60">
                            This Month Bill
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold">
                            ৳720
                        </h2>

                        <p className="text-sm text-base-content/60">
                            12 meals × ৳60
                        </p>
                    </div>
                </div>

                {/* Balance */}
                <div className="card bg-base-100 border">
                    <div className="card-body p-4 sm:p-5">
                        <p className="text-sm text-base-content/60">
                            Current Balance
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold text-success">
                            ৳280
                        </h2>

                        <p className="text-sm text-base-content/60">
                            Available balance
                        </p>
                    </div>
                </div>

            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 mt-5 sm:mt-6">

                {/* Recent Meals */}
                <div className="card bg-base-100 border min-w-0">
                    <div className="card-body p-4 sm:p-5">

                        <h2 className="card-title text-base sm:text-lg">
                            Recent Meals
                        </h2>

                        <div className="overflow-x-auto -mx-1">
                            <table className="table table-sm sm:table-md min-w-[420px]">

                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Meal</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>08 Aug 2026</td>
                                        <td>Lunch</td>
                                        <td>৳60</td>
                                    </tr>

                                    <tr>
                                        <td>07 Aug 2026</td>
                                        <td>Lunch</td>
                                        <td>৳60</td>
                                    </tr>

                                    <tr>
                                        <td>06 Aug 2026</td>
                                        <td>Lunch</td>
                                        <td>৳60</td>
                                    </tr>
                                </tbody>

                            </table>
                        </div>

                    </div>
                </div>

                {/* Recent Payments */}
                <div className="card bg-base-100 border min-w-0">
                    <div className="card-body p-4 sm:p-5">

                        <h2 className="card-title text-base sm:text-lg">
                            Recent Payments
                        </h2>

                        <div className="overflow-x-auto -mx-1">
                            <table className="table table-sm sm:table-md min-w-[420px]">

                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>01 Aug 2026</td>
                                        <td>৳1000</td>
                                        <td>
                                            <span className="badge badge-success badge-sm">
                                                Paid
                                            </span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>01 Jul 2026</td>
                                        <td>৳500</td>
                                        <td>
                                            <span className="badge badge-success badge-sm">
                                                Paid
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>

                            </table>
                        </div>

                    </div>
                </div>

            </div>

        </div>

    )
}

export default UserDashboard
