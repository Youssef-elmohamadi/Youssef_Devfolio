import { NextResponse } from "next/server";
import { getDashboardStatistics } from "@/lib/api/admin/statistics";

export async function GET() {
  try {
    const stats = await getDashboardStatistics();
    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error("Statistics API Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
