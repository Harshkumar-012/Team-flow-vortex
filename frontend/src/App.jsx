import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
const bars = [25, 42, 40, 58, 70, 82, 90];

return (
<div className="min-h-screen w-full overflow-hidden bg-[#03120e] text-white">

{/* Navbar */}  
  <nav className="w-full border-b border-white/5">  
    <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-5">  
      <h2 className="text-2xl font-bold">  
        <span className="mr-2 inline-block rounded-lg bg-gradient-to-br from-blue-400 to-emerald-400 p-2">◆</span>  
        TeamFlow  
      </h2>  

      <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">  
        <a href="#">Home</a>  
        <a href="#features">Features</a>  
        <a href="#about">About</a>  
        <a href="#pricing">Pricing</a>  
        <a href="#contact">Contact</a>  
      </div>  

      <div className="flex items-center gap-3">  
        <button className="hidden rounded-full border border-white/10 p-3 sm:block">☼</button>  
        <button className="hidden rounded-full border border-white/10 px-5 py-3 sm:block">Login</button>  
        <button className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-bold text-black">  
          Get Started →  
        </button>  
      </div>  
    </div>  
  </nav>  

  {/* Hero */}  
  <main className="relative mx-auto grid min-h-[650px] max-w-[1320px] items-center gap-12 px-6 py-16 lg:grid-cols-2">  

    {/* Left content */}  
    <section className="text-left">  
      <div className="mb-7 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">  
        ✦ The Ultimate Team Productivity Platform  
      </div>  

      <h1 className="text-5xl font-bold leading-[1.08] tracking-tight md:text-7xl">  
        Plan. Organize.  
        <br />  
        <span className="text-emerald-400">Achieve More.</span>  
      </h1>  

      <p className="mt-7 max-w-xl text-base leading-8 text-gray-400">  
        TeamFlow brings your team, tasks and projects together in one  
        powerful platform. Plan smarter, stay aligned, and turn every  
        idea into meaningful progress.  
      </p>  

      <div className="mt-9 flex flex-wrap items-center gap-5">  
        <button className="rounded-full bg-emerald-400 px-7 py-4 font-bold text-black">  
          Get Started Free →  
        </button>  
        <button className="flex items-center gap-3 text-white">  
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400 text-emerald-400">▶</span>  
          Watch Demo  
        </button>  
      </div>  

      <div className="mt-9 flex items-center gap-4 text-xs text-gray-400">  
        <div className="flex -space-x-2">  
          {["I", "H", "V", "S"].map((item) => (  
            <span key={item} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#03120e] bg-stone-300 font-bold text-gray-800">  
              {item}  
            </span>  
          ))}  
        </div>  
        Trusted by 10K+ teams worldwide  
      </div>  
    </section>  

    {/* Right Dashboard */}  
    <section className="relative rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-[#172b25] via-[#101f1b] to-[#07130f] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_45px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/10 [transform-style:preserve-3d] lg:[transform:perspective(1400px)_rotateY(-5deg)_rotateX(2deg)] lg:hover:[transform:perspective(1400px)_rotateY(-2deg)_rotateX(1deg)_translateY(-4px)] transition-transform duration-500">

      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">  
        <h3 className="font-bold">🔷 TeamFlow</h3>  
        <span className="text-xs text-gray-500">● Ⅱ ···</span>  
      </div>  

      <div className="grid gap-4 sm:grid-cols-2">  

        {/* Project Overview */}  
        <div className="rounded-2xl border border-white/5 bg-[#142620] p-5">  
          <p className="text-sm text-gray-400">Project Overview</p>  
          <div className="mt-5 flex items-center gap-4">  
            <div  
              className="flex h-20 w-20 items-center justify-center rounded-full"  
              style={{ background: "conic-gradient(#34d399 0% 78%, #253b34 78% 100%)" }}  
            >  
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#142620] font-bold">78%</div>  
            </div>  
            <div>  
              <h2 className="text-2xl font-bold">12</h2>  
              <p className="text-xs text-gray-400">Active projects</p>  
              <p className="mt-2 font-bold text-emerald-400">+18%</p>  
              <p className="text-xs text-gray-500">This month</p>  
            </div>  
          </div>  
        </div>  

        {/* Weekly Productivity */}  
        <div className="rounded-2xl border border-white/5 bg-[#142620] p-5">  
          <p className="text-sm text-gray-400">Weekly Productivity</p>  
          <div className="mt-6 flex h-24 items-end justify-between gap-2">  
            {bars.map((height, i) => (  
              <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-300" style={{ height: `${height}%` }} />  
            ))}  
          </div>  
          <div className="mt-3 flex justify-between text-[10px] text-gray-500">  
            <span>Mon</span><span>Tue</span><span>Wed</span>  
            <span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>  
          </div>  
        </div>  
      </div>  

      {/* Recent Tasks */}  
      <div className="mt-4 rounded-2xl border border-white/5 bg-[#142620] p-5">  
        <div className="mb-4 flex justify-between">  
          <h3 className="text-sm font-bold">Recent Tasks</h3>  
          <span className="text-xs text-emerald-400">View all ↗</span>  
        </div>  

        {[  
          ["Finalize landing page design", "Completed"],  
          ["Review API integration", "In progress"],  
          ["Prepare sprint roadmap", "In review"]  
        ].map(([task, status]) => (  
          <div key={task} className="flex items-center justify-between border-t border-white/5 py-3 text-xs">  
            <span className="text-gray-300">{task}</span>  
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-400">{status}</span>  
          </div>  
        ))}  
      </div>  

      {/* Team Members */}  
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/5 bg-[#142620] p-5">  
        <div>  
          <h3 className="text-sm font-bold">Team Members</h3>  
          <p className="mt-1 text-xs text-gray-500">Your team is working together</p>  
        </div>  
        <div className="flex items-center gap-2">  
          {["A", "B", "C", "D"].map((item) => (  
            <span key={item} className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-gray-800">{item}</span>  
          ))}  
          <span className="text-xs font-bold text-emerald-400">+3</span>  
        </div>  
      </div>  

      <div className="absolute -right-3 top-20 rounded-xl border border-emerald-500/30 bg-[#10251e] px-4 py-3 text-xs text-emerald-300 shadow-xl">  
        ↗ +12% productivity  
      </div>  

      <div className="absolute -left-5 bottom-24 rounded-xl border border-emerald-500/30 bg-[#10251e] px-4 py-3 text-xs text-emerald-300 shadow-xl">  
        ✓ Sprint goals on track  
      </div>  
    </section>  
  </main>  

  {/* Feature Bar */}  
  <section id="features" className="mx-auto mb-8 grid max-w-[1160px] grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-[#0d1e18] p-5 sm:grid-cols-2 lg:grid-cols-4">  
    {[  
      ["▣", "Smart Task Management", "Stay organized"],  
      ["◉", "Project Tracking", "Track progress"],  
      ["♧", "Team Collaboration", "Work together"],  
      ["▥", "Powerful Analytics", "Make data-driven decisions"]  
    ].map(([icon, title, subtitle]) => (  
      <div key={title} className="flex items-center gap-4 border-white/5 px-4 py-3 lg:border-r">  
        <span className="rounded-xl bg-emerald-500/15 p-4 text-xl text-emerald-400">{icon}</span>  
        <div>  
          <h3 className="text-sm font-bold">{title}</h3>  
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>  
        </div>  
      </div>  
    ))}  
  </section>  

</div>

);
}

export default App;