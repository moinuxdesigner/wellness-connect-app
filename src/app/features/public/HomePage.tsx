import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, BriefcaseBusiness, Heart, Leaf, Menu, ShieldCheck, Smile, Star, TrendingUp, X } from 'lucide-react';
import homepageIllustration from '../../../assets/Homepage_Illustration_Asset.png';
import brandLogo from '../../../assets/brand/aura-connect-logo.png';

const FEATURES = [
  { icon: Leaf, label: ['Personalized', 'for You'] },
  { icon: ShieldCheck, label: ['Private &', 'Secure'] },
  { icon: TrendingUp, label: ['Track &', 'Grow'] },
];

const QUICK_STATS = [
  { icon: Smile, value: '10K+', label: 'Happy Members' },
  { icon: Star, value: '500+', label: 'Expert Resources' },
  { icon: ShieldCheck, value: '100%', label: 'Privacy Focused' },
];

const NAV_LINKS = [
  { label: 'Home', href: '#home', active: true },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#home' },
  { label: 'About Us', href: '#features' },
];

function BrandMark() {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <img
        src={brandLogo}
        alt="WellnessConnect"
        className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
      />
      <div className="min-w-0 leading-tight">
        <div className="truncate text-[1.12rem] font-semibold tracking-[-0.03em] text-[#0d1c67] sm:text-[1.5rem]">
          WellnessConnect
        </div>
        <div className="truncate text-[0.9rem] text-[#55649d] sm:text-[1.04rem]">
          Connect. Heal. Thrive.
        </div>
      </div>
    </Link>
  );
}

function MobileMenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Toggle menu"
      className="ml-auto inline-flex items-center justify-center rounded-full border border-[#ddd7f5] bg-white/70 p-3 text-[#20307a] shadow-sm lg:hidden"
      onClick={onClick}
    >
      {open ? <X size={20} /> : <Menu size={20} />}
    </button>
  );
}

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main
      id="home"
      className="relative h-screen overflow-hidden px-4 py-3 text-[#121a5d] sm:px-6 sm:py-4 lg:px-10 lg:py-6"
      style={{
        background:
          'radial-gradient(circle at 16% 8%, rgba(192, 178, 255, 0.42), transparent 22%), radial-gradient(circle at 92% 10%, rgba(176, 194, 255, 0.16), transparent 18%), radial-gradient(circle at 50% 100%, rgba(170, 140, 255, 0.08), transparent 20%), linear-gradient(180deg, #f9f7ff 0%, #fbfaff 44%, #f7f6ff 100%)',
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1700px] flex-col">
        <header className="shrink-0">
          <div className="flex items-center gap-4 lg:gap-8">
            <BrandMark />

            <nav className="hidden flex-1 items-center justify-center gap-14 lg:flex">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`relative text-[1.1rem] transition-colors ${
                    item.active ? 'font-medium text-[#5f47ff]' : 'text-[#4d5b90] hover:text-[#5f47ff]'
                  }`}
                >
                  {item.label}
                  {item.active && (
                    <span className="absolute left-1/2 top-[calc(100%+0.65rem)] h-[3px] w-14 -translate-x-1/2 rounded-full bg-[#5f47ff]" />
                  )}
                </a>
              ))}
            </nav>

            <div className="ml-auto hidden items-center gap-5 lg:flex">
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 rounded-[18px] border border-[#cfe7d6] bg-[#eafaf0] px-6 py-4 text-[1rem] font-semibold text-[#1f7a3f] shadow-[0_10px_25px_rgba(34,197,94,0.08)] transition-transform hover:-translate-y-0.5 hover:bg-[#dff7e8]"
              >
                <BriefcaseBusiness size={18} />
                Careers
              </Link>
              <Link
                to="/login"
                className="rounded-[18px] border border-[#d6d1f2] bg-white/60 px-7 py-4 text-[1.02rem] font-semibold text-[#122056] shadow-[0_10px_25px_rgba(116,93,214,0.06)] transition-transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
              <Link
                to="/get-started"
                className="rounded-[18px] bg-[linear-gradient(135deg,#6b4cff_0%,#4d3aed_100%)] px-8 py-4 text-[1.02rem] font-semibold text-white shadow-[0_18px_36px_rgba(84,68,235,0.3)] transition-transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>

            <MobileMenuButton open={mobileOpen} onClick={() => setMobileOpen((value) => !value)} />
          </div>

          {mobileOpen && (
            <div className="mt-4 rounded-[22px] border border-[#ebe6ff] bg-white/90 p-4 shadow-[0_20px_40px_rgba(116,93,214,0.1)] lg:hidden">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-xl px-4 py-3 text-[0.98rem] ${
                      item.active ? 'bg-[#f1edff] font-medium text-[#5f47ff]' : 'text-[#4d5b90]'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex gap-3 border-t border-[#f0ecff] pt-4">
                <Link
                  to="/careers"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#cfe7d6] bg-[#eafaf0] px-4 py-3 text-center text-[0.96rem] font-semibold text-[#1f7a3f]"
                >
                  <BriefcaseBusiness size={16} />
                  Careers
                </Link>
                <Link
                  to="/login"
                  className="flex-1 rounded-xl border border-[#d6d1f2] bg-white px-4 py-3 text-center text-[0.96rem] font-semibold text-[#122056]"
                >
                  Sign In
                </Link>
                <Link
                  to="/get-started"
                  className="flex-1 rounded-xl bg-[linear-gradient(135deg,#6b4cff_0%,#4d3aed_100%)] px-4 py-3 text-center text-[0.96rem] font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </header>

        <section className="flex min-h-0 flex-1 items-center">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:gap-10">
            <div className="max-w-[760px]">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f0ebff] px-4 py-2 text-[0.92rem] font-medium text-[#5b46ff] shadow-[0_10px_24px_rgba(110,82,240,0.08)]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#6349ff] text-white">
                  <Heart size={11} fill="currentColor" />
                </span>
                <span>Your well-being, our priority</span>
              </div>

              <h1 className="mt-6 max-w-[760px] text-[clamp(2.6rem,4.1vw,4.4rem)] font-semibold leading-[0.97] tracking-[-0.065em] text-[#111a62]">
                Better well-being
                <br />
                starts with <span className="text-[#6247ff]">you</span>
              </h1>

              <p className="mt-5 max-w-[670px] text-[1rem] leading-[1.65] text-[#516091] sm:text-[1.08rem]">
                WellnessConnect brings everything you need for a healthier mind, body, and life—together in one place.
                You don’t have to do it alone. We’re here for you.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/get-started"
                  className="inline-flex items-center gap-3 rounded-[18px] bg-[linear-gradient(135deg,#6d4cff_0%,#5138ee_100%)] px-8 py-4 text-[1rem] font-medium text-white shadow-[0_20px_36px_rgba(86,70,225,0.26)] transition-transform hover:-translate-y-0.5"
                >
                  <Leaf size={18} />
                  Start Your Journey
                  <ArrowRight size={18} className="ml-1" />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 rounded-[18px] border border-[#ddd6fb] bg-white/75 px-7 py-4 text-[1rem] font-medium text-[#5f4dff] shadow-[0_10px_24px_rgba(112,90,225,0.08)] transition-transform hover:-translate-y-0.5"
                >
                  Know More
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div id="features" className="mt-8 grid gap-4 sm:grid-cols-3">
                {FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.label.join(' ')} className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f1ecff] text-[#6247ff] shadow-[0_14px_30px_rgba(120,95,226,0.1)]">
                        <Icon size={26} />
                      </div>
                      <span className="max-w-[110px] text-[0.98rem] leading-[1.45] text-[#243263]">
                        {feature.label.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 grid max-w-[650px] grid-cols-3 gap-3 rounded-[24px] bg-white/55 p-4 shadow-[0_18px_55px_rgba(113,92,210,0.08)] backdrop-blur-md">
                {QUICK_STATS.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center gap-3 rounded-[18px] px-2 py-1">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f1ebff] text-[#6247ff]">
                        <Icon size={22} />
                      </div>
                      <div>
                        <div className="text-[1.1rem] font-semibold text-[#111a62]">{stat.value}</div>
                        <div className="text-[0.92rem] text-[#566497]">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[925px]">
                <img
                  src={homepageIllustration}
                  alt="WellnessConnect hero illustration"
                  className="h-auto w-full select-none object-contain"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
