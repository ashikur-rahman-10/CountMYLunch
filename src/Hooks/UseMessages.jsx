import React, { useEffect, useState } from "react";

const UseMessages = () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    fetch("https://porfolio-server-five.vercel.app/messages")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      });
  }, []);
  return messages;
};

export default UseMessages;
