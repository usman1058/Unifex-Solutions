import VideoClipper from '@/components/admin/video-clipper'
import AutoClipPanel from '@/components/admin/autoclip-panel'

export default function AdminVideoPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Media workstation</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Video clipping</h1>
        <p className="mt-2 text-muted-foreground">Make short clips without sending source footage to the server.</p>
      </div>
      <div className="space-y-6">
        <AutoClipPanel />
        <VideoClipper />
      </div>
    </div>
  )
}
