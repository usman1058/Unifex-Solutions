# Admin Dashboard Testing Guide

## ✅ Status: Admin Dashboard is Complete and Working

The admin login page and dashboard have been successfully created and tested.

## 🔐 Access the Admin Panel

1. **Navigate to**: `/admin/login`
2. **Login Credentials**:
   - Email: `admin@unifex.com`
   - Password: `admin123`

3. After logging in, you'll be redirected to `/admin/dashboard`

## 📋 Pages and Features

### 1. Dashboard (`/admin/dashboard`)
- Overview statistics
- Quick actions
- System info

### 2. Services (`/admin/services`)
- View all services in a table
- Search and filter by status
- Toggle publish status
- Create, Edit, Delete services
- Features: Auto-slug, dynamic arrays for features/tech stack

### 3. Blog (`/admin/blog`)
- View all blog posts
- Search and filter
- Create, Edit, Delete posts
- Categories and tags support
- Reading time and author info

### 4. Testimonials (`/admin/testimonials`)
- Card grid view
- Interactive star rating
- Client information
- Create, Edit, Delete testimonials

### 5. Contact Forms (`/admin/contact`)
- List view with details panel
- Status workflow (New → Contacted → Converted → Closed)
- Notes management
- Search and filter

### 6. Orders (`/admin/orders`)
- List client service orders with status + payment badges
- Search and filter by status (pending / processing / completed / rejected / cancelled)
- View order details, project brief, and uploaded payment receipts
- Approve payment (marks order as paid + processing), reject, or mark completed
- Send a message to the client (shown on their order-status page)

### 7. Social Scheduler (`/admin/social`)
- AI-powered social post scheduling
- Connect social accounts, generate posts with AI, schedule auto-publishing
- Auto-publisher runs via `npm run scheduler`

### 8. Settings (`/admin/settings`)
- AI provider configuration (OpenAI / Anthropic / Google / custom) with connection test
- Bank account details shown to clients at checkout (account name, number, sort code, IBAN, SWIFT, instructions)

## 🧪 Testing Checklist

### Login Page
- [x] Page loads (200 status)
- [x] Form displays correctly
- [x] Demo credentials shown
- [x] Back to Website link works

### Authentication
- [x] Valid credentials login successfully
- [x] Invalid credentials show error
- [x] Redirects to dashboard on success
- [x] Redirects to login when not authenticated
- [x] Session is a signed, httpOnly cookie (`unifex_admin_session`, 7-day expiry)
- [x] All admin APIs reject unauthenticated requests with 401
- [x] Logout clears the session cookie

### Dashboard
- [x] Statistics display correctly
- [x] Quick action links work
- [x] Responsive layout

### Services CRUD
- [x] List page shows all services
- [x] Search and filter work
- [x] Toggle publish status works
- [x] Create new service works
- [x] Edit existing service works
- [x] Delete service with confirmation

### Blog CRUD
- [x] List page shows all posts
- [x] Search and filter work
- [x] Toggle publish status works
- [x] Create new post works
- [x] Edit existing post works
- [x] Delete post with confirmation
- [x] Categories load correctly
- [x] Tags can be added/removed

### Testimonials CRUD
- [x] List page shows all testimonials
- [x] Search and filter work
- [x] Toggle publish status works
- [x] Create new testimonial works
- [x] Edit existing testimonial works
- [x] Delete testimonial with confirmation
- [x] Star rating selector works

### Contact Forms
- [x] List shows all submissions
- [x] Search and filter work
- [x] Click to view details
- [x] Status can be changed
- [x] Notes can be added/edited
- [x] Color-coded status badges

## 🐛 Troubleshooting

### If login page appears blank:
1. **Hard refresh**: Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser cache**
3. **Check browser console** (F12) for JavaScript errors
4. **Verify the page loads**: Check that you see "200" status in the dev server logs

### If you're redirected back to login:
1. Check that you're using correct credentials
2. Clear localStorage and try again
3. Check browser console for errors

### If pages don't load:
1. Check the dev server is running: `tail -f dev.log`
2. Look for error messages in the logs
3. Try accessing `/admin/login` directly

## 📊 Backend API Status

All backend APIs are working and connected:

- ✅ `/api/services` - Services CRUD
- ✅ `/api/blog/posts` - Blog Posts CRUD
- ✅ `/api/blog/categories` - Categories
- ✅ `/api/blog/tags` - Tags
- ✅ `/api/testimonials` - Testimonials CRUD
- ✅ `/api/contact` - Contact Forms
- ✅ `/api/orders` - Service Orders (admin) + public checkout creation
- ✅ `/api/orders/status` - Public order tracking
- ✅ `/api/uploads` - Receipt file upload
- ✅ `/api/settings` - AI + Bank settings
- ✅ `/api/scheduled-posts` - Social post scheduling
- ✅ `/api/admin/login` - Session login (sets httpOnly cookie)
- ✅ `/api/admin/logout` - Session logout
- ✅ `/api/admin/session` - Session verification

## 🎯 Next Steps

The admin dashboard is **fully functional**. You can now:

1. **Manage Content**: Create, edit, delete services, blog posts, and testimonials
2. **Monitor Inquiries**: View and manage contact form submissions
3. **Track Status**: Change status of contact submissions and add notes
4. **Publish Content**: Toggle published status for all content types

## 📱 Responsive Design

The admin dashboard is fully responsive:
- **Desktop**: Full sidebar with all features
- **Tablet**: Sidebar overlays content
- **Mobile**: Floating menu button, single-column layout

## 🔐 Security Notes

**Current Implementation:**
- Server-side session authentication via signed, httpOnly cookie (`unifex_admin_session`)
- HMAC-SHA256 signed tokens with 7-day expiry and timing-safe comparison
- All admin APIs protected by `requireAdmin()` middleware — unauthenticated requests get 401
- Credentials configured via environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`)

**For Production:**
- Set a strong `ADMIN_SESSION_SECRET` in environment variables
- Enforce HTTPS (cookies are already `secure` in production)
- Consider rate-limiting the login endpoint
- Add CSRF protection for state-changing operations

---

**The admin dashboard is ready for use!** All features have been implemented and tested.
