import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects';
import MyTasks from './pages/MyTasks';
import TeamMembers from './pages/TeamMember';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';

function Home() {
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