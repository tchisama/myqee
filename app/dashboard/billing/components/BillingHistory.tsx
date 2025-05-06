"use client"

import { useState } from "react"
import { Calendar, CreditCard, Download, FileText, Filter, Search, CheckCircle2, Clock, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Mock billing history data
const billingHistory = [
  {
    id: "INV-2023-005",
    date: "May 15, 2023",
    amount: 79.00,
    status: "paid",
    paymentMethod: "Visa ending in 4242",
    downloadUrl: "#",
    items: "Professional Plan - Monthly Subscription",
  },
  {
    id: "INV-2023-004",
    date: "April 15, 2023",
    amount: 79.00,
    status: "paid",
    paymentMethod: "Visa ending in 4242",
    downloadUrl: "#",
    items: "Professional Plan - Monthly Subscription",
  },
  {
    id: "INV-2023-003",
    date: "March 15, 2023",
    amount: 79.00,
    status: "paid",
    paymentMethod: "Visa ending in 4242",
    downloadUrl: "#",
    items: "Professional Plan - Monthly Subscription",
  },
  {
    id: "INV-2023-002",
    date: "February 15, 2023",
    amount: 59.00,
    status: "paid",
    paymentMethod: "Visa ending in 4242",
    downloadUrl: "#",
    items: "Basic Plan - Monthly Subscription",
  },
  {
    id: "INV-2023-001",
    date: "January 15, 2023",
    amount: 59.00,
    status: "pending",
    paymentMethod: "Visa ending in 4242",
    downloadUrl: "#",
    items: "Basic Plan - Monthly Subscription",
  },
  {
    id: "INV-2022-012",
    date: "December 15, 2022",
    amount: 59.00,
    status: "failed",
    paymentMethod: "Visa ending in 4242",
    downloadUrl: "#",
    items: "Basic Plan - Monthly Subscription",
  },
]

export function BillingHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter invoices based on search query and status filter
  const filteredInvoices = billingHistory.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.items.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleDownload = (invoiceId: string) => {
    toast.success(`Invoice ${invoiceId} downloaded successfully`)
  }

  // Get status counts
  const statusCounts = {
    all: billingHistory.length,
    paid: billingHistory.filter(inv => inv.status === "paid").length,
    pending: billingHistory.filter(inv => inv.status === "pending").length,
    failed: billingHistory.filter(inv => inv.status === "failed").length,
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br  from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Paid Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-400">{statusCounts.paid}</div>
            <p className="text-xs text-green-700/70 dark:text-green-500/70 mt-1">Total paid invoices</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-400 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-400">{statusCounts.pending}</div>
            <p className="text-xs text-amber-700/70 dark:text-amber-500/70 mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-400 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-400">
              ${billingHistory.reduce((sum, inv) => inv.status === "paid" ? sum + inv.amount : sum, 0).toFixed(2)}
            </div>
            <p className="text-xs text-blue-700/70 dark:text-blue-500/70 mt-1">Lifetime spending</p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden pt-0 border-[#3435FF]/10">
        <div className="bg-gradient-to-r from-[#3435FF]/5 to-transparent px-6 py-3 border-b">
          <h3 className="text-lg font-semibold text-[#3435FF]">Billing History</h3>
        </div>
        <CardContent className="p-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search invoices by ID, date, or items..."
                className="pl-9 w-full border-slate-200 dark:border-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#3435FF]" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses ({statusCounts.all})</SelectItem>
                  <SelectItem value="paid">Paid ({statusCounts.paid})</SelectItem>
                  <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                  <SelectItem value="failed">Failed ({statusCounts.failed})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="rounded-lg border overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Payment Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3435FF]/10">
                            <FileText className="h-4 w-4 text-[#3435FF]" />
                          </div>
                          <div>
                            <div className="font-medium">{invoice.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {invoice.date}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{invoice.items}</TableCell>
                      <TableCell className="font-medium">${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(invoice.status)}
                          <Badge
                            variant={invoice.status === "paid" ? "default" : invoice.status === "pending" ? "outline" : "destructive"}
                            className={invoice.status === "paid" ? "bg-green-500 hover:bg-green-600" : ""}
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-[8px] text-white font-bold flex items-center justify-center">
                            VISA
                          </div>
                          <span className="text-sm">{invoice.paymentMethod.split(" ").pop()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-xs border-[#3435FF] text-[#3435FF] hover:bg-[#3435FF]/5"
                          onClick={() => handleDownload(invoice.id)}
                        >
                          <Download className="h-3 w-3" />
                          <span>PDF</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileText className="h-8 w-8 mb-2 opacity-20" />
                        <p>No invoices found matching your filters.</p>
                        <Button
                          variant="link"
                          className="mt-2 text-[#3435FF]"
                          onClick={() => {
                            setSearchQuery("")
                            setStatusFilter("all")
                          }}
                        >
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
