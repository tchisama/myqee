"use client"

import { useState, useEffect } from "react"
import { Calendar, Download, FileText, Filter, Search, CheckCircle2, Clock, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent   } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useSupabase } from "@/hooks/use-supabase"
import { useSession } from "next-auth/react"
import { format, parseISO, isPast } from "date-fns"



interface BillingHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: string;
  paymentMethod: string;
  downloadUrl: string;
  items: string;
  end_date?: string; // Add end_date field to track subscription expiration
}

export function BillingHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useSupabase()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!session?.user?.email) return;

      setLoading(true);

      // First get the user
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (!userData) {
        setLoading(false);
        return;
      }

      // Get the instance for this user
      const { data: instanceData } = await supabase
        .from('instances')
        .select('id')
        .eq('owner_id', userData.id)
        .single();

      if (!instanceData) {
        setLoading(false);
        return;
      }

      // Get the subscriptions for this instance
      const { data: subscriptionsData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('instance_id', instanceData.id)
        .order('created_at', { ascending: false });

      if (subscriptionsData && subscriptionsData.length > 0) {
        // Convert subscriptions to billing history format
        const history = subscriptionsData.map((sub, index) => {
          const invoiceId = `INV-${format(parseISO(sub.created_at), 'yyyy')}-${String(index + 1).padStart(3, '0')}`;
          const planName = sub.plan_name.charAt(0).toUpperCase() + sub.plan_name.slice(1);

          // Check if the subscription has an end date and if it's in the past
          let status = sub.status;
          if (sub.end_date) {
            const endDate = parseISO(sub.end_date);
            if (isPast(endDate)) {
              // If end date is in the past, mark as expired regardless of database status
              status = 'expired';
            }
          }

          return {
            id: invoiceId,
            date: format(parseISO(sub.created_at), 'MMMM d, yyyy'),
            amount: sub.amount || (sub.plan_name === 'basic' ? 29.00 : sub.plan_name === 'pro' ? 79.00 : 199.00),
            status: status, // Use the potentially updated status
            paymentMethod: "Visa ending in 4242", // Placeholder
            downloadUrl: "#",
            items: `${planName} Plan - Monthly Subscription`,
            end_date: sub.end_date, // Store the end date for potential future use
          };
        });

        setBillingHistory(history);
      } else {
        // If no subscriptions, set empty array
        setBillingHistory([]);
      }

      setLoading(false);
    };

    fetchSubscriptions();
  }, [supabase, session]);

  // Filter invoices based on search query and status filter
  const filteredInvoices = billingHistory.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.items.toLowerCase().includes(searchQuery.toLowerCase());

    // Handle status mapping for filtering
    let matchesStatus = statusFilter === "all";
    if (statusFilter === "active" && (invoice.status === "active" || invoice.status === "paid")) {
      matchesStatus = true;
    } else if (statusFilter === "pending" && invoice.status === "pending") {
      matchesStatus = true;
    } else if (statusFilter === "expired" && (invoice.status === "expired" || invoice.status === "failed")) {
      matchesStatus = true;
    }

    return matchesSearch && matchesStatus;
  });

  const handleDownload = (invoiceId: string) => {
    toast.success(`Invoice ${invoiceId} downloaded successfully`);
  };

  // Get status counts - map database statuses to display statuses
  // This will now correctly count subscriptions that were marked as expired due to past end dates
  const statusCounts = {
    all: billingHistory.length,
    paid: billingHistory.filter(inv => inv.status === "active" || inv.status === "paid").length,
    pending: billingHistory.filter(inv => inv.status === "pending").length,
    failed: billingHistory.filter(inv => inv.status === "failed" || inv.status === "expired").length,
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "failed":
      case "expired":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
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
                  <SelectItem value="active">Active ({statusCounts.paid})</SelectItem>
                  <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                  <SelectItem value="expired">Expired ({statusCounts.failed})</SelectItem>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <div className="animate-spin h-8 w-8 mb-2 border-2 border-[#3435FF] border-t-transparent rounded-full"></div>
                        <p>Loading subscription data...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredInvoices.length > 0 ? (
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
                      <TableCell className="font-medium">{invoice.amount.toFixed(2)} Dh</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(invoice.status)}
                          <Badge
                            className={
                              invoice.status === "active" || invoice.status === "paid"
                                ? "bg-green-500 hover:bg-green-600"
                                : invoice.status === "expired" || invoice.status === "failed"
                                  ? "bg-red-500 hover:bg-red-600"
                                  : ""
                            }
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
                        <p>
                          {searchQuery || statusFilter !== "all"
                            ? "No invoices found matching your filters."
                            : "No subscription history found."}
                        </p>
                        {(searchQuery || statusFilter !== "all") && (
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
                        )}
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
