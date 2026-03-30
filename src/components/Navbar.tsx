import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from './ui/button'
import { Menu, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between" role="navigation" aria-label="Main navigation">
        <Link to="/" className="font-bold text-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded">
          WriterBridge
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded">Browse Jobs</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded">Dashboard</Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded">Sign in</Link>
              <Link to="/signup"><Button size="sm">Get started</Button></Link>
            </>
          )}
        </div>
        <button
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-4 flex flex-col gap-3">
          <Link to="/browse" className="text-sm text-foreground py-2" onClick={() => setOpen(false)}>Browse Jobs</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-foreground py-2" onClick={() => setOpen(false)}>Dashboard</Link>
              <Button variant="outline" size="sm" onClick={() => { handleSignOut(); setOpen(false) }}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-foreground py-2" onClick={() => setOpen(false)}>Sign in</Link>
              <Link to="/signup" onClick={() => setOpen(false)}><Button size="sm" className="w-full">Get started</Button></Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
