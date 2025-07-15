import React from "react";
import ShortenerForm from "./components/ShortenerForm";
import StatsViewer from "./components/StatsViewer";

function App() {
  return (
    <div>
      <h1>Affordmed URL Shortener</h1>
      <ShortenerForm />
      <hr />
      <StatsViewer />
    </div>
  );
}

export default App;
