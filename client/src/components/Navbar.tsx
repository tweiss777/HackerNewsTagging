import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/top', label: 'Top' },
  { to: '/new', label: 'New' },
  { to: '/best', label: 'Best' },
  { to: '/user', label: 'User' },
] as const

export function Navbar() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/top" className="text-lg font-semibold tracking-tight">
          Hacker News
        </NavLink>
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
