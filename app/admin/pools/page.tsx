"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast, Toaster } from "sonner"
import { Search, Plus, Edit, Trash2, Server, Database } from "lucide-react"

interface Pool {
  id: number
  name: string
  description: string
  server_url: string
  max_instances: number
  status: string
  created_at: string
  updated_at: string
  instance_count?: number
}

// Form schema for creating/editing pools
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  server_url: z.string().url("Must be a valid URL"),
  max_instances: z.coerce.number().int().min(1).max(20),
})

export default function PoolsPage() {
  const supabase = useSupabase()
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPools, setFilteredPools] = useState<Pool[]>([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentPool, setCurrentPool] = useState<Pool | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Create form
  const createForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      server_url: "",
      max_instances: 10,
    },
  })

  // Edit form
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      server_url: "",
      max_instances: 10,
    },
  })

  // Fetch pools from Supabase
  const fetchPools = async () => {
    setLoading(true)

    // Get pools with their instances_number field
    const { data, error } = await supabase
      .from('pools')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pools:', error)
      setLoading(false)
      return
    }

    setPools(data || [])
    setFilteredPools(data || [])
    setLoading(false)
  }

  // Filter pools based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPools(pools)
    } else {
      const filtered = pools.filter(pool =>
        pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pool.description && pool.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredPools(filtered)
    }
  }, [searchQuery, pools])

  // Load pools on component mount
  useEffect(() => {
    fetchPools()
  }, [supabase])

  // Handle create pool form submission
  const onCreateSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('pools')
        .insert({
          name: values.name,
          description: values.description || "",
          server_url: values.server_url,
          max_instances: values.max_instances,
          status: 'active'
        })

      if (error) throw error

      toast.success("Pool created successfully")
      setCreateDialogOpen(false)
      createForm.reset()
      fetchPools()
    } catch (error) {
      console.error('Error creating pool:', error)
      toast.error("Failed to create pool")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit pool form submission
  const onEditSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentPool) return
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('pools')
        .update({
          name: values.name,
          description: values.description || "",
          server_url: values.server_url,
          max_instances: values.max_instances,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentPool.id)

      if (error) throw error

      toast.success("Pool updated successfully")
      setEditDialogOpen(false)
      setCurrentPool(null)
      fetchPools()
    } catch (error) {
      console.error('Error updating pool:', error)
      toast.error("Failed to update pool")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete pool
  const handleDeletePool = async () => {
    if (!currentPool) return
    setIsSubmitting(true)

    try {
      // First check if pool has instances
      const { data, error: checkError } = await supabase
        .from('instances')
        .select('id')
        .eq('pool_id', currentPool.id)
        .limit(1)

      if (checkError) throw checkError

      if (data && data.length > 0) {
        toast.error("Cannot delete pool with assigned instances")
        setDeleteDialogOpen(false)
        setCurrentPool(null)
        setIsSubmitting(false)
        return
      }

      // Delete the pool
      const { error } = await supabase
        .from('pools')
        .delete()
        .eq('id', currentPool.id)

      if (error) throw error

      toast.success("Pool deleted successfully")
      setDeleteDialogOpen(false)
      setCurrentPool(null)
      fetchPools()
    } catch (error) {
      console.error('Error deleting pool:', error)
      toast.error("Failed to delete pool")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open edit dialog and populate form
  const openEditDialog = (pool: Pool) => {
    setCurrentPool(pool)
    editForm.reset({
      name: pool.name,
      description: pool.description || "",
      server_url: pool.server_url,
      max_instances: pool.max_instances
    })
    setEditDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pools</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Pool
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Pool</DialogTitle>
              <DialogDescription>
                Create a new Odoo pool that can host up to 10 instances.
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pool Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Production Pool 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Main production server for client instances" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="server_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://odoo-server.example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The base URL of the Odoo server
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="max_instances"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Instances</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={20} {...field} />
                      </FormControl>
                      <FormDescription>
                        Maximum number of instances this pool can host (default: 10)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Pool"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center mb-4">
        <Search className="mr-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <p>Loading pools...</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground mb-2">
            {filteredPools.length} {filteredPools.length === 1 ? 'pool' : 'pools'} found
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Server URL</TableHead>
                <TableHead>Instances</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPools.map((pool) => (
                <TableRow key={pool.id}>
                  <TableCell className="font-medium">{pool.name}</TableCell>
                  <TableCell>{pool.description}</TableCell>
                  <TableCell>{pool.server_url}</TableCell>
                  <TableCell>
                    {pool.instances_number || 0} / {pool.max_instances}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pool.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pool.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(pool)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentPool(pool)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {/* Edit Pool Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pool</DialogTitle>
            <DialogDescription>
              Update the pool details.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pool Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="server_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="max_instances"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Instances</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Pool Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Pool</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this pool? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePool} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Pool"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
