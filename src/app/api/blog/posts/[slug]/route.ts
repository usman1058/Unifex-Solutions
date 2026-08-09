import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, generateSlug, calculateReadingTime } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

export const dynamic = 'force-dynamic'

// GET /api/blog/posts/[slug] - Get single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const blogPost = await db.blogPost.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true
          }
        },
        tagJoins: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!blogPost) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Blog post not found'),
        { status: 404 }
      )
    }

    // Increment view count
    await db.blogPost.update({
      where: { id: blogPost.id },
      data: { views: { increment: 1 } }
    })

    // Format response
    const responseData = {
      ...blogPost,
      tags: blogPost.tagJoins.map(join => join.tag),
      tagJoins: undefined
    }

    return NextResponse.json(successResponse(responseData))
  } catch (error: any) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch blog post', error.message),
      { status: 500 }
    )
  }
}

// PUT /api/blog/posts/[slug] - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { slug: paramSlug } = await params
    const body = await request.json()

    // Check if blog post exists
    const existing = await db.blogPost.findUnique({
      where: { slug: paramSlug }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Blog post not found'),
        { status: 404 }
      )
    }

    // Handle slug change
    if (body.slug && body.slug !== paramSlug) {
      const slugExists = await db.blogPost.findUnique({
        where: { slug: body.slug }
      })
      if (slugExists) {
        return NextResponse.json(
          errorResponse('DUPLICATE_SLUG', 'A blog post with this slug already exists'),
          { status: 409 }
        )
      }
    }

    const slug = body.slug || paramSlug

    // Update blog post
    const blogPost = await db.blogPost.update({
      where: { slug: paramSlug },
      data: {
        slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        author: body.author,
        readTime: body.readTime || (body.content ? calculateReadingTime(body.content) : undefined),
        sharePlacement: body.sharePlacement || existing.sharePlacement,
        featured: body.featured,
        published: body.published,
        publishedAt: body.published && !existing.published ? new Date() : existing.publishedAt,
        categoryId: body.categoryId
      }
    })

    // Handle tags
    if (body.tags !== undefined) {
      // Remove existing tags
      await db.blogPostTagJoin.deleteMany({
        where: { postId: blogPost.id }
      })

      // Add new tags
      if (body.tags.length > 0) {
        for (const tagName of body.tags) {
          let tag = await db.blogPostTag.findUnique({
            where: { slug: generateSlug(tagName) }
          })

          if (!tag) {
            tag = await db.blogPostTag.create({
              data: {
                name: tagName,
                slug: generateSlug(tagName)
              }
            })
          }

          await db.blogPostTagJoin.create({
            data: {
              postId: blogPost.id,
              tagId: tag.id
            }
          })
        }
      }
    }

    // Fetch updated blog post with relations
    const updatedBlogPost = await db.blogPost.findUnique({
      where: { id: blogPost.id },
      include: {
        category: true,
        tagJoins: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json(
      successResponse(updatedBlogPost, { message: 'Blog post updated successfully' })
    )
  } catch (error: any) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', 'Failed to update blog post', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/blog/posts/[slug] - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { slug } = await params
    // Check if blog post exists
    const existing = await db.blogPost.findUnique({
      where: { slug }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Blog post not found'),
        { status: 404 }
      )
    }

    // Delete blog post (cascade will handle tag joins)
    await db.blogPost.delete({
      where: { slug }
    })

    return NextResponse.json(
      successResponse(null, { message: 'Blog post deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete blog post', error.message),
      { status: 500 }
    )
  }
}
