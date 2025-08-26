import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_KEY = "QNJA9IUTJJTYXGUD"; // Replace with your Alpha Vantage API key

export default function App() {
  const [symbol, setSymbol] = useState("IBM");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStockData(symbol);
  }, []);

  const fetchStockData = async (stockSymbol) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${API_KEY}`
      );
      const json = await response.json();
      const timeSeries = json["Time Series (Daily)"];

      if (!timeSeries) {
        setData([]);
        setError("⚠️ Invalid symbol or API limit reached");
        setLoading(false);
        return;
      }

      const chartData = Object.keys(timeSeries)
        .slice(0, 30)
        .reverse()
        .map((date) => ({
          date,
          open: parseFloat(timeSeries[date]["1. open"]),
          close: parseFloat(timeSeries[date]["4. close"]),
          volume: parseInt(timeSeries[date]["5. volume"]),
        }));

      setData(chartData);
    } catch (err) {
      setError("⚠️ Failed to fetch data");
      console.error(err);
    }
    setLoading(false);
  };
return (
  <div className="min-h-screen bg-gradient-to-br from-[#1a0033] via-[#3b0099] to-[#00bcd4] p-8 font-mono flex flex-col items-center">
   


	{/* Title */}
	<h1
	  className="text-5xl font-extrabold mb-6 text-center uppercase tracking-widest"
	  style={{
	    background: "linear-gradient(90deg, #00d4ff, #ff00a8)",
	    WebkitBackgroundClip: "text",
	    WebkitTextFillColor: "transparent",
	    textShadow: "0 1px 2px rgba(0,0,0,0.25)", // subtle crisp shadow
	    WebkitFontSmoothing: "antialiased",
	    MozOsxFontSmoothing: "grayscale",
	  }}
	>
	  Financial Data Visualization Tool
	</h1>

	{/* Subheading */}
	<h2
	  className="text-3xl font-semibold italic tracking-wide mb-10 text-center"
	  style={{
	    background: "linear-gradient(90deg, #ff6ec7, #6a5acd)",
	    WebkitBackgroundClip: "text",
	    WebkitTextFillColor: "transparent",
	    textShadow: "0 1px 1px rgba(0,0,0,0.2)", // softer shadow
	    WebkitFontSmoothing: "antialiased",
	    MozOsxFontSmoothing: "grayscale",
	  }}
	>
	  {symbol} - Last 30 Days
	</h2>

    {/* Input and Button */}
    <div className="mb-10 w-full max-w-xl">
      <label
        htmlFor="symbol"
        className="block font-semibold mb-2 text-lg tracking-wider"
        style={{
          background: "linear-gradient(to right, #39ff14, #00ffea)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 6px #39ff14, 0 0 12px #00ffea",
        }}
      >
        Stock Symbol
      </label>

      <div className="flex flex-col sm:flex-row items-stretch gap-6">
        {/* Input Box */}
        <input
          id="symbol"
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="e.g., IBM, AAPL"
          className="flex-1 p-4 rounded-md border-2 border-[#39ff14] bg-[#130a33] text-[#39ff14] placeholder-[#39ff14] font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#39ff14]"
          style={{
            boxShadow: "0 0 10px #39ff14",
          }}
        />

        {/* Button */}
        <button
          onClick={() => fetchStockData(symbol)}
          className="px-4 py-2 rounded-md bg-[#ff00aa] text-white text-sm font-semibold shadow-md hover:bg-[#ff33bb] transition-all ml-2 mt-2"
          style={{boxShadow: "0 0 6px #ff00aa, 0 0 12px #ff00aa, 0 0 18px #ff33bb",
	  }}

        >
          Fetch Data
        </button>
      </div>
    </div>

    {/* Loading */}
    {loading && (
      <p className="text-center font-bold text-lg animate-pulse"
        style={{
          color: "#00ffea",
          textShadow: "0 0 6px #00ffea, 0 0 10px #00fff7",
        }}
      >
        Loading data...
      </p>
    )}

    {/* Error */}
    {error && (
      <p className="text-center font-bold text-lg"
        style={{
          color: "#ff073a",
          textShadow: "0 0 6px #ff073a, 0 0 10px #ff0000",
        }}
      >
        {error}
      </p>
    )}

    {/* Chart */}
    {data.length > 0 && !loading && !error && (
      <div
        className="rounded-3xl p-8 w-full max-w-5xl bg-black bg-opacity-40 border-2 border-neon-purple shadow-neon-glow"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <h3
          className="text-center text-xl font-semibold mb-4"
          style={{
            background: "linear-gradient(90deg, #00fff7, #39ff14)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 6px #00fff7, 0 0 10px #39ff14",
          }}
        >
          Stock Prices
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#3b0077" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#00fff7", fontWeight: "bold" }}
              tickFormatter={(str) => str.slice(5)}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#39ff14", fontWeight: "bold" }}
              domain={["dataMin", "dataMax"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 255, 247, 0.1)",
                borderRadius: 10,
                borderColor: "#00fff7",
                boxShadow: "0 0 10px #00fff7",
                color: "#00fff7",
              }}
              labelStyle={{ fontWeight: "bold", color: "#00fff7" }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ color: "#00fff7", fontWeight: "bold" }}
            />
            <Line
              type="monotone"
              dataKey="open"
              stroke="#8a2be2"
              strokeWidth={3}
              name="Open Price"
              dot={{ r: 3, stroke: "#8a2be2", strokeWidth: 2, fill: "#0f0c29" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#39ff14"
              strokeWidth={3}
              name="Close Price"
              dot={{ r: 3, stroke: "#39ff14", strokeWidth: 2, fill: "#0f0c29" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <p className="mt-6 text-center font-semibold text-lg"
          style={{
            color: "#39ff14",
            textShadow: "0 0 6px #39ff14, 0 0 12px #00ff00",
          }}
        >
          Latest Volume:{" "}
          <span className="font-bold">
            {data[data.length - 1].volume.toLocaleString()}
          </span>
        </p>
      </div>
    )}
  </div>
);

}
