"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw, Globe, ExternalLink, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { toast, Toaster } from "sonner"

interface Instance {
  id: number
  name: string
  logo_url: string
  language: string
  owner_id: number
  created_at: string
  owner?: {
    name: string
    email: string
  }
}

export default function InstancesPage() {
  const supabase = useSupabase()
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredInstances, setFilteredInstances] = useState<Instance[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [instanceToDelete, setInstanceToDelete] = useState<Instance | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchInstances = async () => {
    setLoading(true)

    // First get all instances
    const { data: instancesData, error: instancesError } = await supabase
      .from('instances')
      .select('*')
      .order('created_at', { ascending: false })

    if (instancesError) {
      console.error('Error fetching instances:', instancesError)
      setLoading(false)
      return
    }

    // For each instance, get the owner information
    const instancesWithOwners = await Promise.all((instancesData || []).map(async (instance) => {
      const { data: ownerData, error: ownerError } = await supabase
        .from('users')
        .select('name, email')
        .eq('id', instance.owner_id)
        .single()

      if (ownerError) {
        console.error(`Error fetching owner for instance ${instance.id}:`, ownerError)
        return instance
      }

      return {
        ...instance,
        owner: ownerData
      }
    }))

    setInstances(instancesWithOwners)
    setFilteredInstances(instancesWithOwners)
    setLoading(false)
  }

  useEffect(() => {
    fetchInstances()
  }, [supabase])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredInstances(instances)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = instances.filter(
        instance =>
          (instance.name && instance.name.toLowerCase().includes(query)) ||
          (instance.owner?.name && instance.owner.name.toLowerCase().includes(query)) ||
          (instance.owner?.email && instance.owner.email.toLowerCase().includes(query))
      )
      setFilteredInstances(filtered)
    }
  }, [searchQuery, instances])

  // Handle opening the delete dialog
  const handleDeleteClick = (instance: Instance) => {
    setInstanceToDelete(instance)
    setDeleteDialogOpen(true)
  }

  // Handle instance deletion
  const handleDeleteInstance = async () => {
    if (!instanceToDelete) return

    setIsDeleting(true)
    try {
      // Delete the instance
      const { error } = await supabase
        .from('instances')
        .delete()
        .eq('id', instanceToDelete.id)

      if (error) throw error

      // Show success message
      toast.success(`Instance "${instanceToDelete.name || 'Unnamed'}" deleted successfully`)

      // Refresh the instances list
      fetchInstances()
    } catch (error) {
      console.error('Error deleting instance:', error)
      toast.error("Failed to delete instance")
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setInstanceToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Instances</h1>
        <p className="text-muted-foreground">
          Manage and view all instances in the system.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>All Instances</CardTitle>
            <CardDescription>
              A list of all instances created in the application.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchInstances}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search instances by name or owner..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-6">
              <p>Loading instances...</p>
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-2">
                {filteredInstances.length} {filteredInstances.length === 1 ? 'instance' : 'instances'} found
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instance</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstances.map((instance) => (
                    <TableRow key={instance.id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={instance.logo_url || ""} alt={instance.name || "Instance"} />
                          <AvatarFallback className="text-xs">
                            {instance.name
                              ? instance.name.substring(0, 2).toUpperCase()
                              : "IN"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{instance.name || "Unnamed Instance"}</span>
                      </TableCell>
                      <TableCell>
                        {instance.owner ? (
                          <div className="flex flex-col">
                            <span>{instance.owner.name}</span>
                            <span className="text-xs text-muted-foreground">{instance.owner.email}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unknown owner</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {instance.language || "en"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {instance.created_at
                          ? formatDistanceToNow(new Date(instance.created_at), { addSuffix: true })
                          : "Unknown"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <a href="https://app.qee.pro" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(instance)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredInstances.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No instances found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      {/* Toaster for notifications */}
      <Toaster position="top-center" />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the instance "{instanceToDelete?.name || 'Unnamed'}" and all associated data.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteInstance}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
