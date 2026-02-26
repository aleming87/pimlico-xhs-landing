"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from './useAdminAuth';
import { ArticlesProvider } from './ArticlesContext';
import { WorkflowProvider } from './WorkflowContext';

const NAV_ITEMS = [
  { href: '/admin',            label: 'Dashboard',   icon: '📊', exact: true, group: 'overview' },
  { type: 'divider', label: 'Pipeline' },
  { href: '/admin/ideas',      label: 'Ideas',       icon: '💡', group: 'pipeline', step: 1 },
  { href: '/admin/drafting',   label: 'Drafting',    icon: '✏️', group: 'pipeline', step: 2 },
  { href: '/admin/collateral', label: 'Collateral',  icon: '🎨', group: 'pipeline', step: 3 },
  { href: '/admin/copy',       label: 'Copy',        icon: '📝', group: 'pipeline', step: 4 },
  { href: '/admin/publishing', label: 'Publishing',  icon: '🚀', group: 'pipeline', step: 5 },
  { type: 'divider', label: 'Library' },
  { href: '/admin/articles',   label: 'Articles',    icon: '📁', group: 'library' },
  { type: 'divider', label: 'Feedback' },
  { href: '/admin/surveys',    label: 'Surveys',     icon: '📋', group: 'feedback' },
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
            <div className="px-5 py-5 border-b border-gray-700/40">
              <Link href="/admin" className="flex items-center gap-2">
                <Image src="/Pimlico_Logo_Inverted.png" alt="Pimlico" width={90} height={24} className="h-6 w-auto" />
              </Link>
              <p className="text-[9px] text-gray-500 mt-1.5 font-semibold tracking-[0.15em] uppercase">Content Workflow</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
              {NAV_ITEMS.map((item, i) => {
                // Section divider
                if (item.type === 'divider') {
                  return (
                    <div key={item.label} className={`${i > 0 ? 'mt-5' : ''} mb-2 px-3`}>
                      <span className="text-[9px] font-bold text-gray-500/80 tracking-[0.15em] uppercase">{item.label}</span>
                    </div>
                  );
                }

                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                const isPipeline = item.group === 'pipeline';
                const isLastPipeline = item.step === 5;

                return (
                  <div key={item.href} className="relative">
                    {/* Vertical pipeline connector */}
                    {isPipeline && !isLastPipeline && (
                      <div className="absolute left-[21px] top-[36px] w-[2px] h-[12px] bg-gray-700/60 rounded-full" />
                    )}
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all relative ${
                        isActive
                          ? 'bg-indigo-600/15 text-white shadow-[inset_0_0_0_1px_rgba(99,102,241,0.25)]'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-indigo-500" />}
                      {/* Step number for pipeline items */}
                      {isPipeline ? (
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-colors ${
                          isActive
                            ? 'bg-indigo-500/30 text-indigo-300'
                            : 'bg-gray-700/50 text-gray-500 group-hover:bg-gray-700 group-hover:text-gray-300'
                        }`}>{item.step}</span>
                      ) : (
                        <span className="text-base w-6 text-center flex-shrink-0">{item.icon}</span>
                      )}
                      <span>{item.label}</span>
                      {isPipeline && isActive && <span className="ml-auto text-[10px]">{item.icon}</span>}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-3 border-t border-gray-700/40 space-y-0.5">
              <Link href="/" className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 rounded-lg hover:bg-white/[0.04] transition-colors">
                <span className="w-5 text-center">←</span> Back to Site
              </Link>
              <Link href="/insights" className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 rounded-lg hover:bg-white/[0.04] transition-colors">
                <span className="w-5 text-center">📰</span> View Insights
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400/60 hover:text-red-300 rounded-lg hover:bg-white/[0.04] transition-colors text-left">
                <span className="w-5 text-center">🚪</span> Logout
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
