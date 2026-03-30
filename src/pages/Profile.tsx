import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import type { Profile as ProfileType } from '../types'

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).is('deleted_at', null).maybeSingle()
      if (data) {
        setProfile(data)
        setFullName(data.full_name ?? '')
        setBio(data.bio ?? '')
        setHourlyRate(data.hourly_rate?.toString() ?? '')
        setPortfolioUrl(data.portfolio_url ?? '')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated.'); setSaving(false); return }
    const payload = {
      user_id: user.id,
      full_name: fullName.trim(),
      bio: bio.trim(),
      hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
      portfolio_url: portfolioUrl.trim() || null,
      role: profile?.role ?? 'client',
      specialties: profile?.specialties ?? []
    }
    const { error: upsertErr } = await supabase.from('profiles').upsert(payload, { onConflict: 'user_id' })
    setSaving(false)
    if (upsertErr) { setError('Could not save your profile. Please try again.'); return }
    setSuccess(true)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">Your Profile</h1>
      <p className="text-muted-foreground mb-8">How clients and writers see you on WriterBridge.</p>
      <Card>
        <CardHeader><CardTitle>Profile information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} maxLength={80} disabled={saving} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={4}
                maxLength={600}
                disabled={saving}
                placeholder="Tell clients about your experience and writing style..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hourlyRate">Hourly rate (USD, optional)</Label>
              <Input id="hourlyRate" type="number" min="1" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="e.g. 75" disabled={saving} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="portfolioUrl">Portfolio URL (optional)</Label>
              <Input id="portfolioUrl" type="url" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} placeholder="https://yourportfolio.com" disabled={saving} />
            </div>
            {error && (
              <div role="alert" aria-live="polite" className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">{error}</div>
            )}
            {success && (
              <div role="status" aria-live="polite" className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-md px-3 py-2">Profile saved successfully.</div>
            )}
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Save profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
