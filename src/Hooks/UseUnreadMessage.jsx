import React, { useEffect, useState } from "react";

const UseUnreadMessage = () => {
  const [unread, setUnread] = useState([]);
  useEffect(() => {
    fetch("https://porfolio-server-five.vercel.app/unread-messages")
      .then((res) => res.json())
      .then((data) => {
        setUnread(data);
      });
  }, []);
  return unread;
};

export default UseUnreadMessage;
