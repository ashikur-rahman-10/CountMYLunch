import React, { useEffect, useState } from "react";

const UseAbout = () => {
  const [about, setAbout] = useState({});
  useEffect(() => {
    fetch("https://porfolio-server-five.vercel.app/about-me")
      .then((res) => res.json())
      .then((data) => {
        setAbout(data);
      });
  }, []);
  return about;
};

export default UseAbout;
