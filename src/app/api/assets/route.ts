import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
// return NextResponse.json([
//   { name: "AAPL", price: "$174.50", change: 2.5, chartData: [{ value: 170 }, { value: 0 }, { value: 174 }] },
//   { name: "GOOGL", price: "$132.30", change: -1.2, chartData: [{ value: 134 }, { value: 133 }, { value: 132 }] },
//   { name: "AMZN", price: "$98.20", change: 0.8, chartData: [{ value: 97 }, { value: 98 }, { value: 98.2 }] },
//   { name: "TSLA", price: "$245.10", change: -0.5, chartData: [{ value: 247 }, { value: 246 }, { value: 245.1 }] },
//   { name: "MSFT", price: "$310.75", change: 1.1, chartData: [{ value: 308 }, { value: 309 }, { value: 310.75 }] },
//   { name: "TSLA", price: "$245.10", change: -0.5, chartData: [{ value: 247 }, { value: 246 }, { value: 245.1 }] },
//   { name: "MSFT", price: "$310.75", change: 1.1, chartData: [{ value: 308 }, { value: 309 }, { value: 310.75 }] },
//   { name: "TSLA", price: "$245.10", change: -0.5, chartData: [{ value: 247 }, { value: 246 }, { value: 245.1 }] },
//   { name: "MSFT", price: "$310.75", change: 1.1, chartData: [{ value: 308 }, { value: 309 }, { value: 310.75 }] },
// ]);
  const token = req.cookies.get("token")?.value;

  const res = await fetch("http://127.0.0.1:8000/api/v1/asset", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data);
}