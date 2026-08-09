import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { MouseFollower } from "@/components/ui/mouse-follower";
import AmbientCursorGlow from '@/components/ui/ambient-cursor-glow'
import { buildMetadata, siteDescription, siteName, siteUrl } from '@/lib/seo'

// Content is database-backed. Keep Prisma out of the build-time prerender
// phase and render these pages against the deployment database at request time.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  ...buildMetadata({ title: siteName, description: siteDescription }),
  metadataBase: new URL(siteUrl),
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.webp`, width: 675, height: 663 },
      description: siteDescription,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      publisher: { '@id': `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground min-h-screen flex flex-col"
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
        <AmbientCursorGlow />
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Toaster />
        <MouseFollower />
      </body>
    </html>
  );
}
