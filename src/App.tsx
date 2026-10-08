import { useState } from "react";
import {
  ArrowRight, Boxes, ChartNoAxesColumn, Check, ClipboardCheck, Code2,
  FileSpreadsheet, Link2, Mail, Menu, MessageSquare, Search, Settings,
  Sparkles, UserRound, X, Zap,
} from "lucide-react";

const NAV = [
  { href: "#home", label: "Home" }, { href: "#about", label: "About" },
  { href: "#services", label: "Services" }, { href: "#process", label: "Process" },
  { href: "#examples", label: "Examples" }, { href: "#contact", label: "Contact" },
];

const STEPS = [
  { icon: MessageSquare, title: "Understand", text: "Learn how your business actually works." },
  { icon: Search, title: "Identify", text: "Find what can be improved." },
  { icon: ClipboardCheck, title: "Assess", text: "Focus on what brings real value." },
  { icon: Boxes, title: "Design", text: "Plan the right solution." },
  { icon: Code2, title: "Build", text: "Create and implement." },
  { icon: ChartNoAxesColumn, title: "Improve", text: "Keep refining as you grow." },
];

const SERVICES = [
  { icon: Zap, title: "AI Automation", text: "Make repetitive work happen automatically across your tools and processes." },
  { icon: Boxes, title: "Custom Web Applications", text: "Build simple, powerful applications around your exact requirements." },
  { icon: Link2, title: "System Integration", text: "Connect the systems your business already uses." },
  { icon: UserRound, title: "Implementation & Support", text: "Get end-to-end support to implement and improve over time." },
];

const CHALLENGES = [
  { icon: Mail, text: "My team enters the same information multiple times." },
  { icon: ChartNoAxesColumn, text: "I don’t know what’s happening across my business." },
  { icon: FileSpreadsheet, text: "Our reports take hours to prepare." },
  { icon: Boxes, text: "Our existing software doesn’t handle our process." },
];

const BEFORE = ["Email", "Excel", "Copy & Paste", "Check", "Report", "Follow up"];
const AFTER = [
  { icon: Mail, label: "Input" }, { icon: Settings, label: "Automation" },
  { icon: Sparkles, label: "Intelligence" }, { icon: Boxes, label: "Application" },
  { icon: Check, label: "Result" },
];

export default function App() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [chat, setChat] = useState({ service: "", problem: "", name: "", email: "", phone: "" });

  return (
    <div className="min-h-screen bg-ink text-fg">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="#home" className="font-display text-lg font-semibold tracking-tight">SNA AI</a>
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex" aria-label="Primary">
            {NAV.map((item) => <a key={item.href} href={item.href} className="hover:text-fg">{item.label}</a>)}
          </nav>
          <a href="#contact" className="hidden h-11 items-center gap-2 rounded-full bg-violet px-4 text-sm font-semibold text-fg md:inline-flex">
            Start a conversation <ArrowRight className="size-4" />
          </a>
          <button type="button" className="grid size-11 place-items-center rounded-xl border border-line md:hidden"
            aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(v => !v)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && <nav className="border-t border-line px-4 py-3 md:hidden" aria-label="Mobile">
          {NAV.map(item => <a key={item.href} href={item.href} className="block py-3 text-base" onClick={() => setOpen(false)}>{item.label}</a>)}
        </nav>}
      </header>

      <main>
        <section id="home" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-violet-soft uppercase">AI automation · Custom web applications · System integration</p>
            <h1 className="mt-4 font-display text-5xl leading-none font-semibold tracking-tight sm:text-6xl">
              Make the work<span className="block text-violet">work better.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">We understand how your business works, identify what can be improved, and build practical technology around it.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#contact" className="inline-flex h-12 items-center gap-2 rounded-full bg-violet px-5 font-semibold">Start a conversation <ArrowRight className="size-4" /></a>
              <a href="#process" className="inline-flex h-12 items-center gap-2 px-2 font-medium text-muted">
                <span className="grid size-8 place-items-center rounded-full border border-line"><span className="ml-0.5 size-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-fg" /></span>
                See how it works
              </a>
            </div>
          </div>
          <figure className="overflow-hidden rounded-card border border-line bg-ink-2 shadow-[0_0_80px_rgba(124,92,255,0.18)]">
            <img src="/hero-system.svg" alt="A glowing system connecting people, process, tools and data to automation, applications and integration" className="h-auto w-full" />
          </figure>
        </section>

        <section id="process" className="border-t border-line py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-xs font-semibold tracking-[0.18em] text-violet-soft uppercase">Our approach</p>
                <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">From understanding to a better way of working.</h2></div>
              <a href="#contact" className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm">See the full process <ArrowRight className="size-4" /></a>
            </div>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {STEPS.map(step => <li key={step.title} className="rounded-card border border-line bg-panel/70 p-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-ink text-violet-soft shadow-[0_0_24px_rgba(124,92,255,0.35)]"><step.icon className="size-5" /></span>
                <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
              </li>)}
            </ol>
          </div>
        </section>

        <section id="services" className="bg-paper py-16 text-paper-fg">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-violet uppercase">Our services</p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">Practical technology for real business needs.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {SERVICES.map(item => <article key={item.title} className="flex flex-col rounded-card bg-fg/80 p-6 shadow-sm">
                <span className="grid size-11 place-items-center rounded-2xl bg-violet/15 text-violet"><item.icon className="size-5" /></span>
                <h3 className="mt-5 font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-paper-muted">{item.text}</p>
                <a href="#contact" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-violet">Learn more <ArrowRight className="size-4" /></a>
              </article>)}
            </div>
          </div>
        </section>

        <section id="about" className="py-16">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-violet-soft uppercase">Real business situations</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Common challenges we help solve.</h2>
            <ul className="mt-8 grid gap-3 md:grid-cols-2">
              {CHALLENGES.map(item => <li key={item.text} className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-4 py-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-violet-soft"><item.icon className="size-5" /></span>
                <span className="text-sm leading-relaxed sm:text-base">{item.text}</span>
              </li>)}
            </ul>
          </div>
        </section>

        <section id="examples" className="bg-paper py-16 text-paper-fg">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-violet uppercase">Real-world example</p>
            <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">From a manual process to an automated workflow.</h2>
            <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-card bg-ink p-5 text-fg">
                <h3 className="font-display text-lg">Before</h3>
                <ul className="mt-4 space-y-2">{BEFORE.map(label => <li key={label} className="rounded-xl bg-panel px-4 py-3 text-sm">{label}</li>)}</ul>
              </div>
              <div className="hidden items-center justify-center text-violet lg:flex" aria-hidden><ArrowRight className="size-8" /></div>
              <div className="rounded-card border border-violet/30 bg-ink p-5 text-fg shadow-[0_0_40px_rgba(124,92,255,0.2)]">
                <h3 className="font-display text-lg">After with SNA AI</h3>
                <ul className="mt-4 space-y-2">{AFTER.map(item => <li key={item.label} className="flex items-center gap-3 rounded-xl bg-panel px-4 py-3 text-sm"><item.icon className="size-4 text-violet-soft" />{item.label}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-ink-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(124,92,255,0.22),transparent_35%)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-24">
            <p className="text-xs font-semibold tracking-[0.18em] text-violet-soft uppercase">Let’s build a better way</p>
            <h2 className="mt-3 max-w-lg font-display text-4xl font-semibold tracking-tight sm:text-5xl">Technology should fit your business.</h2>
            <p className="mt-4 max-w-md text-muted">Whether you want to automate a process, build a custom tool or connect your existing systems, we can help you find the right way forward.</p>
            <a href="#contact" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-violet px-5 font-semibold">Start a conversation <ArrowRight className="size-4" /></a>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Start a conversation</h2>
          <p className="mt-2 text-muted">Tell us what is taking too much time. Our assistant will ask a few questions and capture the requirement for us.</p>
          <div className="mt-8 overflow-hidden rounded-card border border-line bg-panel">
            <div className="border-b border-line px-6 py-5">
              <p className="font-semibold">SNA AI Assistant</p>
              <p className="mt-1 text-sm text-muted">A simple guided conversation — no complicated form.</p>
            </div>
            <div className="space-y-5 px-6 py-7">
              <div className="rounded-2xl bg-ink-2 px-5 py-4 text-sm leading-6">
                Hi 👋 I’m the SNA AI assistant. What would you like help with?
              </div>
              {chatStep === 0 && <div className="grid gap-3 sm:grid-cols-2">
                {["Automate a repetitive process","Build a custom web application","Connect existing systems","I’m not sure — explain my problem"].map(option => (
                  <button key={option} type="button" onClick={() => { setChat({ ...chat, service: option }); setChatStep(1); }} className="rounded-2xl border border-line px-5 py-4 text-left text-sm font-medium transition hover:border-violet hover:bg-ink-2">{option}</button>
                ))}
              </div>}
              {chatStep >= 1 && <div className="rounded-2xl bg-violet px-5 py-4 text-sm leading-6">{chat.service}</div>}
              {chatStep === 1 && <div>
                <p className="mb-3 text-sm">What problem or process would you like us to improve?</p>
                <textarea className="w-full rounded-xl border border-line bg-ink-2 px-4 py-3" rows={4} value={chat.problem} onChange={e => setChat({ ...chat, problem: e.target.value })} placeholder="For example: We enter the same customer information in Excel and another system." />
                <button type="button" onClick={() => setChatStep(2)} disabled={!chat.problem.trim()} className="mt-3 rounded-full bg-violet px-5 py-3 font-semibold disabled:opacity-40">Continue <ArrowRight className="inline ml-1" size={17} /></button>
              </div>}
              {chatStep >= 2 && <div className="rounded-2xl bg-ink-2 px-5 py-4 text-sm leading-6">{chat.problem}</div>}
              {chatStep === 2 && <div className="grid gap-4">
                <p className="text-sm">Great. How can we contact you?</p>
                <input className="h-12 rounded-xl border border-line bg-ink-2 px-4" placeholder="Your name" value={chat.name} onChange={e => setChat({ ...chat, name: e.target.value })} />
                <input className="h-12 rounded-xl border border-line bg-ink-2 px-4" placeholder="Email address" type="email" value={chat.email} onChange={e => setChat({ ...chat, email: e.target.value })} />
                <input className="h-12 rounded-xl border border-line bg-ink-2 px-4" placeholder="WhatsApp / phone number" value={chat.phone} onChange={e => setChat({ ...chat, phone: e.target.value })} />
                <button type="button" onClick={() => {
                  const body = "New SNA AI enquiry\n\nService: " + chat.service + "\nProblem: " + chat.problem + "\nName: " + chat.name + "\nEmail: " + chat.email + "\nPhone / WhatsApp: " + chat.phone;
                  window.location.href = "mailto:snaomkproject@gmail.com?subject=" + encodeURIComponent("New SNA AI enquiry from " + chat.name) + "&body=" + encodeURIComponent(body);
                  setSent(true); setChatStep(3);
                }} disabled={!chat.name.trim() || !chat.email.trim()} className="rounded-full bg-violet px-5 py-3 font-semibold disabled:opacity-40">Send requirement <ArrowRight className="inline ml-1" size={17} /></button>
              </div>}
              {chatStep === 3 && <div className="rounded-2xl border border-line bg-ink-2 px-5 py-4 text-sm leading-6">Thanks, {chat.name}. Your requirement is ready to send to SNA AI. If your email app did not open, you can also reach us on WhatsApp using the button below.</div>}
            </div>
          </div>
        </section>
      </main>

      <a href="https://wa.me/918903604189?text=Hi%20SNA%20AI%2C%20I%27d%20like%20to%20discuss%20a%20business%20process." target="_blank" rel="noreferrer" aria-label="Chat with SNA AI on WhatsApp" className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105">
        <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7 fill-current"><path d="M16 3.2A12.7 12.7 0 0 0 5.2 22.5L3.4 28.8l6.5-1.7A12.7 12.7 0 1 0 16 3.2Zm0 23.1h-.1a10.3 10.3 0 0 1-5.2-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a10.3 10.3 0 1 1 8.7 4.7Zm5.7-7.7c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.3Z"/></svg>
      </a>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-fg">SNA AI</span><span>Karaikudi · Tamil Nadu · India</span><span>© {new Date().getFullYear()} SNA AI</span>
        </div>
      </footer>
    </div>
  );
}

function Stat({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return <div><dt className={`font-display text-2xl font-semibold ${accent ? "text-violet" : ""}`}>{k}</dt><dd className="mt-1 text-xs leading-snug text-muted sm:text-sm">{v}</dd></div>;
}
