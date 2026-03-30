import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { PenLine, ShieldCheck, Clock, Star, DollarSign, Users } from 'lucide-react'

const HERO_IMAGE_URL = 'https://gudiuktjzynkjvtqmuvi.supabase.co/storage/v1/object/public/hero-images/51253cf2-988d-4411-a074-c241e46753fb-hero.png'

const features = [
  { icon: '✍️', title: 'Expert Writers, Every Niche', body: 'Browse thousands of vetted writers in blog content, SEO copy, technical writing, whitepapers, and more.' },
  { icon: '🔒', title: 'Secure Escrow Payments', body: 'Funds are held in escrow until work is approved. Clients pay only when satisfied. Writers get paid every time.' },
  { icon: '⚡', title: 'Quick Turnaround', body: 'Post a job and receive proposals within hours. Set your deadline. We match you with writers who can deliver.' },
  { icon: '⭐', title: 'Verified Reviews', body: 'Every rating is from a real completed contract. Read honest feedback before you hire or accept an offer.' },
  { icon: '📋', title: 'Built-in Project Tools', body: 'Manage briefs, revisions, and deliverables in one place. No email chains. No confusion about what was agreed.' },
  { icon: '🤝', title: 'Dispute Resolution', body: 'A dedicated resolution team steps in if anything goes wrong. Your money and your work are always protected.' }
]

export default function Home() {
  return (
    <>
      <section
        style={{ backgroundImage: `url(${HERO_IMAGE_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Great writing starts<br />with the right writer.
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
            Post a job in minutes. Receive proposals from skilled freelance writers. Pay securely when the work is done.
          </p>
          <Link to="/signup">
            <Button size="lg" className="min-w-[180px] text-base font-semibold">
              Get started free
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need to hire well</h2>
          <p className="text-muted-foreground text-lg mb-16 max-w-2xl">
            WriterBridge handles the matching, contracts, payments, and reviews — so you can focus on what matters.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="border border-border rounded-lg p-6">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-muted/40">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', icon: <PenLine size={28} />, title: 'Post your project', body: 'Describe what you need, set your budget, and choose a deadline. It takes less than 5 minutes.' },
              { step: '02', icon: <Users size={28} />, title: 'Review proposals', body: 'Writers submit tailored proposals with their rate. Read their profiles, portfolios, and past reviews.' },
              { step: '03', icon: <ShieldCheck size={28} />, title: 'Pay when done', body: 'Funds are held in escrow. Release payment once you approve the final work. No risk, ever.' }
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-3xl font-bold text-primary">{item.step}</span>
                  <span className="text-primary">{item.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Users size={32} className="mx-auto text-primary mb-2" />, stat: '12,000+', label: 'Active writers' },
              { icon: <DollarSign size={32} className="mx-auto text-primary mb-2" />, stat: '$4.2M+', label: 'Paid out to writers' },
              { icon: <Star size={32} className="mx-auto text-primary mb-2" />, stat: '4.8 / 5', label: 'Average client rating' },
              { icon: <Clock size={32} className="mx-auto text-primary mb-2" />, stat: '< 4 hrs', label: 'Avg. first proposal' }
            ].map((s) => (
              <div key={s.label}>
                {s.icon}
                <div className="text-3xl font-bold text-foreground">{s.stat}</div>
                <div className="text-muted-foreground text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-primary">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to find your next great writer?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10">Join thousands of clients and writers already on WriterBridge.</p>
          <Link to="/signup">
            <Button variant="secondary" size="lg" className="min-w-[180px] text-base font-semibold">
              Create free account
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
