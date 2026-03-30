import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const CATEGORIES = ['Blog Writing', 'Copywriting', 'Technical Writing', 'SEO Content', 'Ghostwriting', 'Whitepapers', 'Social Media', 'Other']

export default function PostJob() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [deadline, setDeadline] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!title.trim() || !description.trim()) { setError('Please fill in all required fields.'); return }
    const min = parseFloat(budgetMin)
    const max = parseFloat(budgetMax)
    if (isNaN(min) || isNaN(max) || min < 0 || max < min) { setError('Please enter a valid budget range.'); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be signed in to post a job.'); setLoading(false); return }
    const { error: insertErr } = await supabase.from('jobs').insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      budget_min: min,
      budget_max: max,
      deadline: deadline || null,
      status: 'open',
      skills_required: []
    })
    setLoading(false)
    if (insertErr) { setError('Could not post your job. Please try again.'); return }
    navigate('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">Post a Job</h1>
      <p className="text-muted-foreground mb-8">Tell writers what you need. Clear briefs get better proposals.</p>
      <Card>
        <CardHeader>
          <CardTitle>Job details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">Job title <span className="text-destructive">*</span></Label>
              <Input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. 10 SEO blog posts for SaaS product" maxLength={120} disabled={loading} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your project, tone, audience, and any requirements..."
                rows={5}
                maxLength={3000}
                disabled={loading}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="budgetMin">Budget min (USD)</Label>
                <Input id="budgetMin" type="number" min="1" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} placeholder="50" disabled={loading} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="budgetMax">Budget max (USD)</Label>
                <Input id="budgetMax" type="number" min="1" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} placeholder="500" disabled={loading} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deadline">Deadline (optional)</Label>
              <Input id="deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} disabled={loading} />
            </div>
            {error && (
              <div role="alert" aria-live="polite" className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Posting...' : 'Post job'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
