import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProviders";

const MyMeal = () => {
const { user } = useContext(AuthContext);

const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
if (!user?.email) return;

fetch(`http://localhost:5000/users/${user.email}`)
.then((res) => res.json())
.then((data) => {
setProfile(data);
setLoading(false);
})
.catch((error) => {
console.error(error);
setLoading(false);
});
}, [user?.email]);

if (loading) {
return (
<div>
    <h1 className="text-2xl font-bold">
        My Meal
    </h1>

    <p className="text-base-content/60 mt-1">
        Manage your meal.
    </p>

    <div className="flex justify-center py-12">
        <span className="loading loading-spinner"></span>
    </div>
</div>
);
}

return (
<div>

    {/* Page Header */}

    <h1 className="text-2xl font-bold">
        My Meal
    </h1>

    <p className="text-base-content/60 mt-1">
        Manage your meal.
    </p>

    <p>Hello</p>


    {/* Profile Incomplete */}

    {!profile?.profileCompleted && (
    <div className="alert alert-warning mt-6">

        <div>
            <h3 className="font-semibold">
                Complete your profile first
            </h3>

            <p className="text-sm">
                You must complete your profile
                before using the meal facility.
            </p>
        </div>

    </div>
    )}


    {/* Meal Section */}

    {profile?.profileCompleted && (
    <div className="card bg-base-100 border mt-6 max-w-xl">

        <div className="card-body">

            <h2 className="card-title">
                Today's Meal
            </h2>

            <p className="text-base-content/60">
                Your meal status will appear here.
            </p>

            <div className="divider"></div>

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm text-base-content/60">
                        Meal Status
                    </p>

                    <p className="text-2xl font-bold text-success">
                        ON
                    </p>
                </div>

                <button className="btn btn-error">
                    Turn Off
                </button>

            </div>

        </div>

    </div>
    )}

</div>
);
};

export default MyMeal;