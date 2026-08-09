'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ServiceForm from '@/components/admin/service-form'

export default function EditServicePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchService()
  }, [slug])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services/${slug}`)
      const data = await response.json()

      if (data.success) {
        setService(data.data)
      } else {
        router.push('/admin/services')
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      router.push('/admin/services')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!service) {
    return <div>Service not found</div>
  }

  return <ServiceForm service={service} isEditing />
}
