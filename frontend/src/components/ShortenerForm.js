import React, { useState } from "react";
import axios from "axios";
import log from "../logger";

function ShortenerForm() {
  const [urls, setUrls] = useState([{ url: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const handleAdd = () => {
    if (urls.length < 5)
      setUrls([...urls, { url: "", validity: "", shortcode: "" }]);
  };

  const handleSubmit = async () => {
    const responseArray = [];
    for (const input of urls) {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE}/shorturls`,
          input
        );
        await log("frontend", "info", "component", `Shortened: ${input.url}`);
        responseArray.push(res.data);
      } catch (err) {
        await log("frontend", "error", "component", `Failed for: ${input.url}`);
      }
    }
    setResults(responseArray);
  };

  return (
    <div>
      <h2>URL Shortener</h2>
      {urls.map((input, index) => (
        <div key={index}>
          <input
            placeholder="URL"
            value={input.url}
            onChange={(e) => handleChange(index, "url", e.target.value)}
          />
          <input
            placeholder="Validity (min)"
            value={input.validity}
            onChange={(e) => handleChange(index, "validity", e.target.value)}
          />
          <input
            placeholder="Custom shortcode (optional)"
            value={input.shortcode}
            onChange={(e) => handleChange(index, "shortcode", e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleAdd}>Add more</button>
      <button onClick={handleSubmit}>Shorten</button>
      <ul>
        {results.map((r, idx) => (
          <li key={idx}>
            {r.shortLink} (expires: {r.expiry})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShortenerForm;
