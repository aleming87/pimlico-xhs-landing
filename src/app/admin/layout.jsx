"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from './useAdminAuth';
import { ArticlesProvider } from './ArticlesContext';
import { WorkflowProvider } from './WorkflowContext';

const NAV_ITEMS = [
  { href: '/admin',            label: 'Dashboard',   icon: '📊', exact: true },
  { href: '/admin/ideas',      label: 'Ideas',       icon: '💡' },
  { href: '/admin/articles',   label: 'Articles',    icon: '📁' },
  { href: '/admin/drafting',   label: 'Drafting',    icon: '✏️' },
  { href: '/admin/collateral', label: 'Collateral',  icon: '🎨' },
  { href: '/admin/copy',       label: 'Copy',        icon: '📝' },
  { href: '/admin/publishing', label: 'Publishing',  icon: '🚀' },
];

function LoginScreen({ password, setPassword, passwordError, handleLogin }) {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-3xl">🔐</span></div>
          <h1 className="text-2xl font-bold text-white">Admin Console</h1>
          <p className="text-gray-400 text-sm mt-1">Pimlico XHS™ Content Workflow</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)} autoFocus
            placeholder="Enter admin password"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const { isAuthenticated, password, setPassword, passwordError, handleLogin, handleLogout } = useAdminAuth();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return <LoginScreen password={password} setPassword={setPassword} passwordError={passwordError} handleLogin={handleLogin} />;
  }

  return (
    <ArticlesProvider>
      <WorkflowProvider>
        <div className="bg-gray-900 min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-56 bg-gray-800/80 border-r border-gray-700/50 flex flex-col fixed inset-y-0 left-0 z-30">
            {/* Logo */}
            <div className="px-4 py-4 border-b border-gray-700/50">
              <Link href="/admin" className="flex items-center gap-2">
                <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={90} height={24} className="h-6 w-auto" />
              </Link>
              <p className="text-[10px] text-gray-500 mt-1 font-medium tracking-wider uppercase">Content Workflow</p>
            </div>

            {/* Process Flow Nav */}
            <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map((item, i) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                const isStageItem = i > 0 && i !== 2; // Not dashboard and not articles
                return (
                  <div key={item.href} className="relative">
                    {/* Flow connector line */}
                    {isStageItem && i > 1 && (
                      <div className="absolute left-5 -top-0.5 w-px h-1 bg-gray-700" />
                    )}
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                    {/* Stage flow arrow */}
                    {isStageItem && i < NAV_ITEMS.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-3 border-t border-gray-700/50 space-y-1">
              <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 rounded-lg hover:bg-gray-700/30 transition-colors">
                ← Back to Site
              </Link>
              <Link href="/insights" className="flex items-center gap-2 px-3 py-2 text-xs text-blue-400/60 hover:text-blue-300 rounded-lg hover:bg-gray-700/30 transition-colors">
                📰 View Insights
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400/60 hover:text-red-300 rounded-lg hover:bg-gray-700/30 transition-colors text-left">
                🚪 Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 ml-56">
            {children}
          </main>
        </div>
      </WorkflowProvider>
    </ArticlesProvider>
  );
}
