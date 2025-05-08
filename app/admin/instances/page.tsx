"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw, Globe, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
                        <Button variant="ghost" size="icon" asChild>
                          <a href="https://app.qee.pro" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
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
    </div>
  )
}
