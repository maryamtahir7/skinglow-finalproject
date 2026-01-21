import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, RefreshCcw, Loader2, FilePlus, Pencil, Trash2 } from "lucide-react";
import { getReports, addReport, getOrders, updateReport, deleteReport } from "../../backend/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Manual Report / Edit State
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [manualForm, setManualForm] = useState({
    month: "",
    year: new Date().getFullYear().toString(),
    sales: "",
    profit: ""
  });
  const [savingManual, setSavingManual] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await getReports();
      setReports(res.documents);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      // 1. Fetch all orders
      const orderRes = await getOrders();
      const orders = orderRes.documents;

      // 2. Identify current month/year
      const now = new Date();
      const currentMonth = now.toLocaleString('default', { month: 'long' });
      const currentYear = now.getFullYear();

      // 3. Filter orders for this month & Calculate totals
      const thisMonthOrders = orders.filter(o => {
        const d = new Date(o.$createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === currentYear;
      });

      const totalSales = thisMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      // specific logic: assume 25% profit margin for now as we don't have cost price in orders
      const profit = totalSales * 0.25;

      // 4. Create Report Object
      const newReport = {
        type: "Monthly Sales",
        month: currentMonth,
        year: currentYear,
        totalSales: parseFloat(totalSales.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
      };

      // 5. Check if report already exists for this month (basic check)
      const exists = reports.find(r => r.month === currentMonth && r.year === currentYear && r.type === "Monthly Sales");
      if (exists) {
        alert(`Report for ${currentMonth} ${currentYear} already exists!`);
        setGenerating(false);
        return;
      }

      // 6. Save to DB
      await addReport(newReport);

      // 7. Refresh
      await fetchReports();
      alert("Report generated successfully!");

    } catch (error) {
      console.error("Report generation failed:", error);

      // Permission Error Handling
      if (error.message && error.message.includes('Missing "create" permission')) {
        // Try to get current user ID to helper user
        let userId = "unknown";
        try {
          const { account } = await import("../../backend/appwrite");
          const user = await account.get();
          userId = user.$id;
        } catch (uErr) { console.error(uErr); }

        alert(`PERMISSION DENIED: You do not have 'create' permissions for Reports.\n\nPlease go to Appwrite Console > Database > Reports > Settings > Permissions.\n\nAdd this User ID to 'Create':\n${userId}\n\nTechnical Details:\n${error.message}`);
        console.log("Your User ID is:", userId);
      } else {
        alert("Failed to generate report: " + error.message);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenManual = () => {
    setEditingId(null);
    setManualForm({ month: "", year: new Date().getFullYear().toString(), sales: "", profit: "" });
    setIsManualOpen(true);
  };

  const handleEditClick = (report) => {
    setEditingId(report.$id);
    setManualForm({
      month: report.month,
      year: report.year.toString(),
      sales: report.totalSales,
      profit: report.profit
    });
    setIsManualOpen(true);
  };

  const handleDeleteReport = async (id) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      await deleteReport(id);
      setReports(reports.filter((r) => r.$id !== id));
    } catch (error) {
      console.error("Failed to delete report:", error);
      alert("Failed to delete report.");
    }
  };

  const handleManualSubmit = async () => {
    if (!manualForm.month || !manualForm.year || !manualForm.sales || !manualForm.profit) {
      alert("Please fill in all fields.");
      return;
    }

    setSavingManual(true);
    try {
      const reportData = {
        type: "Monthly Sales",
        month: manualForm.month,
        year: parseInt(manualForm.year),
        totalSales: parseFloat(manualForm.sales),
        profit: parseFloat(manualForm.profit),
      };

      if (editingId) {
        await updateReport(editingId, reportData);
        alert("Report updated successfully!");
      } else {
        await addReport(reportData);
        alert("Manual report created!");
      }

      await fetchReports();
      setIsManualOpen(false);
      setManualForm({ month: "", year: new Date().getFullYear().toString(), sales: "", profit: "" });

    } catch (error) {
      console.error("Failed to save manual report:", error);

      // Permission Error Handling
      if (error.message && error.message.includes('Missing "create" permission')) {
        let userId = "unknown";
        try {
          const { account } = await import("../../backend/appwrite");
          const user = await account.get();
          userId = user.$id;
        } catch (uErr) { console.error(uErr); }

        alert(`PERMISSION DENIED: You cannot create/update reports.\n\nPlease update Appwrite Permissions for User ID:\n${userId}\n\nTechnical Details:\n${error.message}`);
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setSavingManual(false);
    }
  };

  const summary = useMemo(() => {
    if (!reports.length) {
      return {
        totalRevenue: 0,
        totalProfit: 0,
        monthsTracked: 0,
        trendLabel: "No data yet",
        trendValue: 0,
      };
    }

    const totalRevenue = reports.reduce((sum, r) => sum + (r.totalSales || 0), 0);
    const totalProfit = reports.reduce((sum, r) => sum + (r.profit || 0), 0);

    // Sort reports by year + month index to find latest vs previous
    const sorted = [...reports].sort((a, b) => {
      const ai = (a.year || 0) * 12 + (MONTHS.indexOf(a.month) || 0);
      const bi = (b.year || 0) * 12 + (MONTHS.indexOf(b.month) || 0);
      return ai - bi;
    });

    const latest = sorted[sorted.length - 1];
    const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;

    let trendLabel = "Stable";
    let trendValue = 0;

    if (prev && latest?.totalSales && prev.totalSales) {
      const diff = latest.totalSales - prev.totalSales;
      trendValue = Math.round((diff / prev.totalSales) * 100);
      if (trendValue > 0) trendLabel = "Up from last month";
      else if (trendValue < 0) trendLabel = "Down from last month";
      else trendLabel = "Same as last month";
    } else {
      trendLabel = "First month of data";
    }

    return {
      totalRevenue,
      totalProfit,
      monthsTracked: reports.length,
      trendLabel,
      trendValue,
    };
  }, [reports]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Health & Sales Reports</h1>
          <p className="text-muted-foreground text-sm md:text-[13px]">
            Monitor monthly performance, revenue, and profit in one clean view.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={generateReport}
            disabled={generating || loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
            {generating ? "Generating..." : "Auto-Generate Current Month"}
          </Button>

          <Button variant="outline" className="border-border hover:bg-secondary" onClick={handleOpenManual}>
            <FilePlus className="h-4 w-4 mr-2" /> Manual Entry
          </Button>

          <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Report" : "Add Manual Report"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select value={manualForm.month} onValueChange={(val) => setManualForm({ ...manualForm, month: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input
                      type="number"
                      value={manualForm.year}
                      onChange={(e) => setManualForm({ ...manualForm, year: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Total Sales (Rs)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={manualForm.sales}
                    onChange={(e) => setManualForm({ ...manualForm, sales: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Net Profit (Rs)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={manualForm.profit}
                    onChange={(e) => setManualForm({ ...manualForm, profit: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsManualOpen(false)}>Cancel</Button>
                <Button onClick={handleManualSubmit} disabled={savingManual} className="bg-primary text-white">
                  {savingManual ? "Saving..." : (editingId ? "Update Report" : "Save Report")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Total Revenue
              </span>
              <div className="text-2xl font-bold text-foreground">
                Rs. {summary.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all recorded months.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border border-primary/10 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Total Net Profit (Est.)
              </span>
              <div className="text-2xl font-bold text-primary">
                Rs. {summary.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-primary/80">
                Based on your saved monthly reports.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Performance Trend
              </span>
              <div className="flex items-center gap-2">
                {summary.trendValue >= 0 ? (
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 text-rose-600">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {summary.trendValue > 0 && <>+{summary.trendValue}% vs. last month</>}
                    {summary.trendValue < 0 && <>{summary.trendValue}% vs. last month</>}
                    {summary.trendValue === 0 && "No change vs. last month"}
                  </div>
                  <p className="text-xs text-muted-foreground">{summary.trendLabel}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tracking <span className="font-semibold">{summary.monthsTracked}</span> month
                {summary.monthsTracked === 1 ? "" : "s"} of data.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No reports generated yet.</p>
          <p className="text-xs text-slate-400">Click generate to calculate sales or add manually.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card
              key={report.$id}
              className="relative border border-border shadow-sm hover:shadow-md transition bg-card overflow-hidden group rounded-2xl"
            >
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/0 border-b border-border/60 py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-[0.18em] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> {report.type}
                </CardTitle>
                <div className="flex gap-1 opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleEditClick(report)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteReport(report.$id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-semibold text-muted-foreground">
                    {report.month} {report.year}
                  </div>
                  <span className="inline-flex items-center rounded-full bg-secondary/60 px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Monthly Summary
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Total Revenue
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      Rs. {report.totalSales?.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Net Profit (Est.)
                      </div>
                      <div className="text-lg font-semibold text-primary">
                        Rs. {report.profit?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
