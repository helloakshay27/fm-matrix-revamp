import { useState, useEffect } from 'react'
import { getFullUrl, getAuthHeader } from '@/config/apiConfig'

interface UnexpectedVisitor {
  id: number
  guest_name: string
  guest_number: string
  status: string
  status_class: string
  visitor_image: string
  guest_from: string
  visit_purpose: string | null
  pass_number: string | null
  created_at: string
  created_at_formatted: string
  arrival_type: string
  pass_holder: boolean
  pass_valid: string | null
  primary_host: string
  additional_hosts: any[]
  additional_hosts_count: number
  guest_vehicle_number: string
  notes: string | null
  approve: number
  approve_status: string
  item_details: Array<{
    item_type: string | null
    item_number: string
    description: string
  }>
  check_in_available: boolean
  requires_approval: boolean
  is_walk_in: boolean
  created_by: string
}

interface UnexpectedVisitorsResponse {
  unexpected_visitors: UnexpectedVisitor[]
}

export const useUnexpectedVisitors = () => {
  const [visitors, setVisitors] = useState<UnexpectedVisitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUnexpectedVisitors = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(getFullUrl('/pms/admin/visitors/unexpected_visitors.json'), {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: UnexpectedVisitorsResponse = await response.json()
      setVisitors(data.unexpected_visitors || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch unexpected visitors')
      console.error('Error fetching unexpected visitors:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnexpectedVisitors()
  }, [])

  return {
    visitors,
    loading,
    error,
    refetch: fetchUnexpectedVisitors
  }
}