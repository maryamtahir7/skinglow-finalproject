import React, { useEffect, useState } from "react";
import { getStocks, addStock } from "../../backend/database";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, PlusCircle } from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      const res = await getReports();
      setReports(res.documents || []);
    }
    fetchReports();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-600">
          <BarChart3 className="h-6 w-6" /> Reports
        </h1>
        <Button
          onClick={() =>
            addReport({
              type: "Monthly Sales",
              month: "September",
              year: 2025,
              totalSales: 45000,
              profit: 12000,
            }).then(() => window.location.reload())
          }
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Dummy Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.$id} className="shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-indigo-700">
                {report.type} - {report.month} {report.year}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                <strong>Sales:</strong> ${report.totalSales}
              </p>
              <p className="text-gray-700">
                <strong>Profit:</strong> ${report.profit}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
