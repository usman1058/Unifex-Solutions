'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TestimonialForm from '@/components/admin/testimonial-form'

export default function EditTestimonialPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [testimonial, setTestimonial] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchTestimonial()
  }, [id])

  const fetchTestimonial = async () => {
    try {
      const response = await fetch(`/api/testimonials/${id}`)
      const data = await response.json()

      if (data.success) {
        setTestimonial(data.data)
      } else {
        router.push('/admin/testimonials')
      }
    } catch (error) {
      console.error('Error fetching testimonial:', error)
      router.push('/admin/testimonials')
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

  if (!testimonial) {
    return <div>Testimonial not found</div>
  }

  return <TestimonialForm testimonial={testimonial} isEditing />
}
