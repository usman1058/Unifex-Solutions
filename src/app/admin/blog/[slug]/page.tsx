'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BlogForm from '@/components/admin/blog-form'

export default function EditBlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${slug}`)
      const data = await response.json()

      if (data.success) {
        setPost(data.data)
      } else {
        router.push('/admin/blog')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      router.push('/admin/blog')
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

  if (!post) {
    return <div>Post not found</div>
  }

  return <BlogForm post={post} isEditing />
}
