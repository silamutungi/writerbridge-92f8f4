import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { formatCurrency, formatDate } from '../lib/utils'
import type { Job } from '../types'
import { Search, Briefcase } from 'lucide-react'

const CATEGORIES = ['All', 'Blog Writing', 'Copywriting', 'Technical Writing', 'SEO Content', 'Ghostwriting', 'Whitepapers', 'Social Media']

export default function Browse() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filtered, setFiltered] = useState<Job[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(50)
      if (err) { setError('Could not load jobs. Please try again.'); setLoading(false); return }
      setJobs(data ?? [])
      setFiltered(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let result = jobs
    if (category !== 'All') result = result.filter(j => j.category === category)
    if (search.trim()) result = result.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.description.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [search, category, jobs])

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">Browse Open Jobs</h1>
      <p className="text-muted-foreground mb-8">Find your next writing project from clients ready to hire.</p>

      <div className="space-y-4 mb-8">
        <div className="space-y-1.5">
          <Label htmlFor="search">Search jobs</Label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Blog posts, SEO, technical writing..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`min-h-[36px] px-3 py-1 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                category === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="animate-pulse h-40 bg-muted rounded-lg" />)}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-border rounded-lg py-20 text-center">
          <Briefcase size={40} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-foreground font-semibold text-lg mb-1">No jobs match your search</p>
          <p className="text-muted-foreground mb-4">Try a different keyword or browse all categories.</p>
          <Button variant="outline" onClick={() => { setSearch(''); setCategory('All') }}>Clear filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((job) => (
            <Card key={job.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold leading-snug">{job.title}</CardTitle>
                  <Badge variant="outline" className="shrink-0">{job.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{job.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground text-sm">{formatCurrency(job.budget_min)} – {formatCurrency(job.budget_max)}</span>
                  <span className="text-muted-foreground text-xs">{formatDate(job.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
