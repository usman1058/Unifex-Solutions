'use client'

import { useEffect, useState } from 'react'
import { Search, Mail, Phone, Building2, Clock, CheckCircle, XCircle } from 'lucide-react'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string | null
  message: string
  status: string
  notes: string | null
  source: string | null
  createdAt: string
  updatedAt: string
}

type StatusFilter = 'all' | 'new' | 'contacted' | 'converted' | 'closed'

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()
      if (data.success) {
        setSubmissions(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (submission: ContactSubmission, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${submission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: submission.notes })
      })
      if (response.ok) {
        setSubmissions(submissions.map(s =>
          s.id === submission.id ? { ...s, status: newStatus } : s
        ))
        if (selectedSubmission?.id === submission.id) {
          setSelectedSubmission({ ...selectedSubmission, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Error updating submission:', error)
    }
  }

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch =
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.company?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filter === 'all' || submission.status === filter

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-500'
      case 'contacted': return 'bg-yellow-500/10 text-yellow-500'
      case 'converted': return 'bg-green-500/10 text-green-500'
      case 'closed': return 'bg-gray-500/10 text-gray-500'
      default: return 'bg-muted'
    }
  }

  const statusCounts = {
    all: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    contacted: submissions.filter(s => s.status === 'contacted').length,
    converted: submissions.filter(s => s.status === 'converted').length,
    closed: submissions.filter(s => s.status === 'closed').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Forms</h1>
        <p className="text-muted-foreground">View and manage contact form submissions</p>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-4 py-2 rounded-lg ${filter === 'new' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              New ({statusCounts.new})
            </button>
            <button
              onClick={() => setFilter('contacted')}
              className={`px-4 py-2 rounded-lg ${filter === 'contacted' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              Contacted ({statusCounts.contacted})
            </button>
            <button
              onClick={() => setFilter('converted')}
              className={`px-4 py-2 rounded-lg ${filter === 'converted' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              Converted ({statusCounts.converted})
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-4 py-2 rounded-lg ${filter === 'closed' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              Closed ({statusCounts.closed})
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
              No submissions found
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                onClick={() => setSelectedSubmission(submission)}
                className={`bg-card border rounded-lg p-6 cursor-pointer transition-colors ${
                  selectedSubmission?.id === submission.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{submission.name}</h3>
                    <p className="text-sm text-muted-foreground">{submission.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                </div>

                {submission.subject && (
                  <p className="text-sm font-medium mb-2">{submission.subject}</p>
                )}

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {submission.message}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </div>
                  {submission.company && (
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {submission.company}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Submission Details */}
        <div className="lg:col-span-1">
          {selectedSubmission ? (
            <div className="bg-card border rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Submission Details</h2>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="font-medium">{selectedSubmission.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>

                {selectedSubmission.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${selectedSubmission.phone}`} className="font-medium">
                        {selectedSubmission.phone}
                      </a>
                    </div>
                  </div>
                )}

                {selectedSubmission.company && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                    <p className="font-medium">{selectedSubmission.company}</p>
                  </div>
                )}

                {selectedSubmission.subject && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subject</label>
                    <p className="font-medium">{selectedSubmission.subject}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Message</label>
                  <p className="text-sm bg-muted p-3 rounded-lg mt-1">
                    {selectedSubmission.message}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex gap-2 mt-2">
                    {(['new', 'contacted', 'converted', 'closed'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedSubmission, status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                          selectedSubmission.status === status
                            ? getStatusColor(status)
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <textarea
                    value={selectedSubmission.notes || ''}
                    onChange={(e) => {
                      const updated = { ...selectedSubmission, notes: e.target.value }
                      setSelectedSubmission(updated)
                    }}
                    onBlur={() => handleStatusChange(selectedSubmission, selectedSubmission.status)}
                    className="w-full px-3 py-2 border rounded-lg h-24 resize-none text-sm mt-1"
                    placeholder="Add notes..."
                  />
                </div>

                <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
                  <div>Received: {new Date(selectedSubmission.createdAt).toLocaleString()}</div>
                  <div>Last updated: {new Date(selectedSubmission.updatedAt).toLocaleString()}</div>
                  {selectedSubmission.source && (
                    <div>Source: {selectedSubmission.source}</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a submission to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
