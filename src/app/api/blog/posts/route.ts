import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug, successResponse, errorResponse, parsePaginationParams, calculatePaginationMeta, calculateReadingTime } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

// GET /api/blog/posts - List all blog posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const { page, limit, sortBy, sortOrder } = parsePaginationParams(searchParams)
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}
    if (published !== null) {
      where.published = published === 'true'
    }
    if (featured !== null) {
      where.featured = featured === 'true'
    }
    if (category) {
      where.category = {
        slug: category
      }
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Handle tag filtering
    if (tag) {
      where.tagJoins = {
        some: {
          tag: {
            slug: tag
          }
        }
      }
    }

    // Get total count
    const total = await db.blogPost.count({ where })

    // Get blog posts
    const blogPosts = await db.blogPost.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tagJoins: {
          include: {
            tag: true
          }
        }
      }
    })

    // Format response
    const formattedPosts = blogPosts.map(post => ({
      ...post,
      tags: post.tagJoins.map(join => join.tag),
      tagJoins: undefined
    }))

    return NextResponse.json(
      successResponse(formattedPosts, calculatePaginationMeta(total, page, limit))
    )
  } catch (error: any) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch blog posts', error.message),
      { status: 500 }
    )
  }
}

// POST /api/blog/posts - Create a new blog post
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Title and content are required'),
        { status: 400 }
      )
    }

    // Generate slug from title if not provided
    const slug = body.slug || generateSlug(body.title)

    // Check if slug already exists
    const existing = await db.blogPost.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        errorResponse('DUPLICATE_SLUG', 'A blog post with this slug already exists'),
        { status: 409 }
      )
    }

    // Calculate reading time
    const readTime = body.readTime || calculateReadingTime(body.content)

    // Create blog post
    const blogPost = await db.blogPost.create({
      data: {
        slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        author: body.author,
        readTime,
        sharePlacement: body.sharePlacement || 'sidebar',
        featured: body.featured || false,
        published: body.published ?? false,
        publishedAt: body.published ? new Date() : null,
        categoryId: body.categoryId
      }
    })

    // Add tags if provided
    if (body.tags && body.tags.length > 0) {
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

    // Fetch the created blog post with relations
    const createdBlogPost = await db.blogPost.findUnique({
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
      successResponse(createdBlogPost, { message: 'Blog post created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create blog post', error.message),
      { status: 500 }
    )
  }
}
