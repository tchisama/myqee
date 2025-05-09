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

import { toast, Toaster } from "sonner"
import { Search, ArrowLeft, Database, User } from "lucide-react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Pool {
  id: number
  name: string
  description: string
  server_url: string
  max_instances: number
  instances_number: number
  status: string
  created_at: string
  updated_at: string
}

interface Instance {
  id: number
  name: string
  logo_url: string
  language: string
  owner_id: number
  created_at: string
  pool_id: number | null
  owner?: {
    name: string
    email: string
  }
}

export default function PoolDetailsPage({ params }: { params: { id: string } }) {
  const supabase = useSupabase()
  const router = useRouter()
  const id = params.id // Access directly for now, will be fixed in Next.js 16
  const poolId = parseInt(id)

  const [pool, setPool] = useState<Pool | null>(null)
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredInstances, setFilteredInstances] = useState<Instance[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [instanceCount, setInstanceCount] = useState(0)
  const [maxInstances, setMaxInstances] = useState(10)

  // Fetch pool details
  const fetchPool = async () => {
    const { data, error } = await supabase
      .from('pools')
      .select('*')
      .eq('id', poolId)
      .single()

    if (error) {
      console.error('Error fetching pool:', error)
      toast.error("Failed to load pool details")
      router.push('/admin/pools')
      return
    }

    setPool(data)
    setMaxInstances(data.max_instances)
  }

  // Fetch instances in this pool
  const fetchInstances = async () => {
    setLoading(true)

    // Get instances in this pool with owner information
    const { data, error } = await supabase.rpc('get_pool_instances', { p_pool_id: poolId })

    // Update the instance count in the UI
    if (pool) {
      setInstanceCount(pool.instances_number || 0)
    }

    if (error) {
      console.error('Error fetching instances:', error)
      setLoading(false)
      return
    }

    // Format the data to match our Instance interface
    const formattedInstances = data.map((item: any) => ({
      id: item.instance_id,
      name: item.instance_name,
      owner_id: item.owner_id,
      pool_id: poolId,
      created_at: "", // We don't have this from the function
      logo_url: "", // We don't have this from the function
      language: "", // We don't have this from the function
      owner: {
        name: item.owner_name,
        email: item.owner_email
      }
    }))

    setInstances(formattedInstances)
    setFilteredInstances(formattedInstances)
    // We're now using the instances_number from the pool table
    // but we'll update it here as a fallback
    if (!pool) {
      setInstanceCount(formattedInstances.length)
    }
    setLoading(false)
  }

  // Filter instances based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredInstances(instances)
    } else {
      const filtered = instances.filter(instance =>
        instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (instance.owner?.name && instance.owner.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (instance.owner?.email && instance.owner.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredInstances(filtered)
    }
  }, [searchQuery, instances])

  // Load data on component mount
  useEffect(() => {
    fetchPool()
    fetchInstances()
  }, [poolId, supabase])

  // Handle removing instance from pool
  const handleRemoveInstance = async (instanceId: number) => {
    setIsSubmitting(true)

    try {
      // First, get the current pool_id to make sure it matches
      const { data: instanceData, error: fetchError } = await supabase
        .from('instances')
        .select('pool_id')
        .eq('id', instanceId)
        .single()

      if (fetchError) throw fetchError

      // Verify the instance is in this pool
      if (instanceData.pool_id !== poolId) {
        toast.error("Instance is not in this pool")
        setIsSubmitting(false)
        return
      }

      // Update instance to remove pool assignment
      const { error } = await supabase
        .from('instances')
        .update({ pool_id: null })
        .eq('id', instanceId)

      if (error) throw error

      // Decrement the instances_number in the pool
      const { error: updateError } = await supabase
        .from('pools')
        .update({
          instances_number: pool!.instances_number - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', poolId)

      if (updateError) throw updateError

      toast.success("Instance removed from pool successfully")

      // Update local state
      setInstanceCount(prev => Math.max(0, prev - 1))

      // Refresh instances list
      fetchInstances()

      // Refresh pool data
      fetchPool()
    } catch (error) {
      console.error('Error removing instance from pool:', error)
      toast.error("Failed to remove instance from pool")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Toaster />
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push('/admin/pools')} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pools
        </Button>
        <h1 className="text-2xl font-bold">{pool?.name || 'Pool Details'}</h1>
      </div>

      {pool && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Pool Information</CardTitle>
              <CardDescription>Details about this Odoo pool</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Name:</span> {pool.name}
                </div>
                <div>
                  <span className="font-medium">Description:</span> {pool.description || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Server URL:</span> {pool.server_url}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {pool.status}
                </div>
                <div>
                  <span className="font-medium">Created:</span> {new Date(pool.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capacity</CardTitle>
              <CardDescription>Instance usage in this pool</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-24">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {instanceCount} / {maxInstances}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    instances used
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(instanceCount / maxInstances) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pool Status</CardTitle>
              <CardDescription>Current pool status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-4 border rounded-md bg-gray-50">
                  <p className="text-sm text-muted-foreground">
                    Instances are automatically assigned to pools during creation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Instances in Pool</h2>
        <div className="flex items-center">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search instances..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <p>Loading instances...</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground mb-2">
            {filteredInstances.length} {filteredInstances.length === 1 ? 'instance' : 'instances'} in pool
          </div>
          {filteredInstances.length === 0 ? (
            <div className="text-center py-8 border rounded-lg">
              <Database className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No instances in this pool</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Instances are automatically assigned to pools during creation.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instance</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstances.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell className="font-medium">{instance.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{instance.owner?.name || 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground">{instance.owner?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveInstance(instance.id)}
                        disabled={isSubmitting}
                      >
                        Remove from Pool
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </div>
  )
}
