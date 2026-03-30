import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { formatCurrency, formatDate } from '../lib/utils'
import type { Job, Profile } from '../types'
import { Briefcase, PlusCircle, User } from 'lucide-react'

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .maybeSingle()
      setProfile(prof)
      const { data: jobData, error: jobErr } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (jobErr) { setError('Could not load your jobs. Please refresh.'); setLoading(false); return }
      setJobs(jobData ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const statusColor: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    open: 'default',
    in_progress: 'secondary',
    completed: 'outline',
    cancelled: 'destructive'
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-muted rounded-lg" />)}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {profile ? `Welcome back, ${profile.full_name.split(' ')[0]}` : 'Your Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-1">{profile?.role === 'writer' ? 'Find new projects and manage your work.' : 'Manage your jobs and find great writers.'}</p>
        </div>
        <div className="flex gap-3">
          {profile?.role === 'client' && (
            <Link to="/post-job"><Button><PlusCircle size={16} className="mr-2" />Post a Job</Button></Link>
          )}
          <Link to="/browse"><Button variant="outline"><Briefcase size={16} className="mr-2" />Browse Jobs</Button></Link>
        </div>
      </div>

      {!profile && (
        <Card className="mb-8 border-primary/40">
          <CardContent className="py-6 flex items-center gap-4">
            <User size={32} className="text-primary shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Complete your profile</p>
              <p className="text-muted-foreground text-sm">A complete profile gets 3x more responses. Add your bio, skills, and rate.</p>
            </div>
            <Link to="/profile" className="ml-auto"><Button variant="outline" size="sm">Set up profile</Button></Link>
          </CardContent>
        </Card>
      )}

      <h2 className="text-xl font-semibold text-foreground mb-4">
        {profile?.role === 'writer' ? 'Open Jobs for You' : 'Your Posted Jobs'}
      </h2>

      {jobs.length === 0 ? (
        <div className="border border-border rounded-lg py-20 text-center">
          <Briefcase size={40} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-foreground font-semibold text-lg mb-1">No jobs yet</p>
          <p className="text-muted-foreground mb-6">
            {profile?.role === 'writer' ? 'Browse open jobs and submit a proposal.' : 'Post your first job to find a writer today.'}
          </p>
          {profile?.role === 'client'
            ? <Link to="/post-job"><Button><PlusCircle size={16} className="mr-2" />Post a Job</Button></Link>
            : <Link to="/browse"><Button>Browse Jobs</Button></Link>
          }
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold leading-snug">{job.title}</CardTitle>
                  <Badge variant={statusColor[job.status] ?? 'outline'} className="capitalize shrink-0">{job.status.replace('_', ' ')}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{job.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{formatCurrency(job.budget_min)} – {formatCurrency(job.budget_max)}</span>
                  <span className="text-muted-foreground">{formatDate(job.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
