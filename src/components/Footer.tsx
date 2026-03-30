import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>&copy; {year} WriterBridge. All rights reserved.</span>
        <nav className="flex gap-6" aria-label="Footer navigation">
          <Link to="/browse" className="hover:text-foreground transition-colors focus:outline-none focus:underline">Browse Jobs</Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors focus:outline-none focus:underline">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors focus:outline-none focus:underline">Terms</Link>
        </nav>
      </div>
    </footer>
  )
}
