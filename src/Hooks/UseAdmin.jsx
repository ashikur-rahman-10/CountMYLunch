import React, { useEffect, useState } from "react";
import useAuth from "./UseAuth";

const useAdmin = () => {
  const [admin, setAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.email) {
      // Check if user and user.email are defined
      if (user.email === "ashikur.rahman3912@gmail.com") {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    }
    setAdminLoading(false); // Set loading to false after checking
  }, [user]);

  return { admin, adminLoading };
};

export default useAdmin;
