import React, { useState, useEffect } from "react";

export default ({ noChars, getwpmCallback }) => {
  const [ms, setMs] = useState(0);
  const [wpm, setwpm] = useState(0);

  useEffect(() => {
    const calculatedwpm = Math.round(noChars / 5 / (ms / 60));

    setwpm(calculatedwpm);
    getwpmCallback(calculatedwpm);
  }, [noChars, ms]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMs(ms + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [ms]);

  return <p style={{ color: "white" }}>wpm: {isFinite(wpm) ? wpm : 0}</p>;
};
