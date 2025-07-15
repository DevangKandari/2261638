import React, { useState } from "react";
import axios from "axios";
import log from "../logger";

function StatsViewer() {
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE}/shorturls/${code}`
      );
      await log("frontend", "info", "component", `Fetched stats for: ${code}`);
      setData(res.data);
    } catch (err) {
      await log(
        "frontend",
        "error",
        "component",
        `Stats fetch failed for: ${code}`
      );
    }
  };

  return (
    <div>
      <h2>Short URL Stats</h2>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter shortcode"
      />
      <button onClick={fetchStats}>Fetch Stats</button>
      {data && (
        <div>
          <p>Original: {data.originalURL}</p>
          <p>Clicks: {data.clicks}</p>
          <ul>
            {data.clickData.map((c, i) => (
              <li key={i}>
                {c.timestamp} — {c.referrer} — {c.location}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StatsViewer;
