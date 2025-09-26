import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

// shadcn components
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Textarea } from "./components/ui/textarea";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Toaster } from "./components/ui/sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Separator } from "./components/ui/separator";
import { Download, LogIn, FileSpreadsheet, Sparkles, Eye, EyeOff, Mail } from "lucide-react";
import { API_BASE as API } from "./config";

function useAuthToken() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const save = (t) => {
    setToken(t);
    if (t) localStorage.setItem("token", t); else localStorage.removeItem("token");
  };
  return { token, setToken: save };
}

function Nav({ token, onLogout }) {
  return (
    <div className="w-full border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-white">
          <FileSpreadsheet className="w-5 h-5 text-rose-500" />
          <span>ExcelVision</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm text-neutral-300 hover:text-white transition-colors">Auth</Link>
          {token ? (
            <Button size="sm" variant="secondary" onClick={onLogout} className="bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10">Logout</Button>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="rounded-full bg-rose-500 hover:bg-rose-600 text-white">
                <LogIn className="w-4 h-4 mr-1" /> Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Home({ token }) {
  const [desc, setDesc] = useState("Create a cashflow forecast model with monthly revenue, costs and profit summary.");
  const [provider, setProvider] = useState("auto");
  const [busy, setBusy] = useState(false);

  const handleGenerate = async () => {
    if (!desc.trim()) {
      toast.error("Please describe the spreadsheet you want.");
      return;
    }
    try {
      setBusy(true);
      toast.loading("Generating .xlsx...", { id: "gen" });
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(
        `${API}/generate`,
        { description: desc, provider },
        { responseType: "blob", headers }
      );
      const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = new Date();
      a.href = url;
      a.download = `excelvision_${ts.getFullYear()}-${String(ts.getMonth()+1).padStart(2,'0')}-${String(ts.getDate()).padStart(2,'0')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download ready!", { id: "gen", description: "Your spreadsheet was generated." });
    } catch (e) {
      console.error(e);
      toast.error("Generation failed", { id: "gen", description: e?.response?.data?.detail || "Try again" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* decorative background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_20%_-10%,rgba(244,63,94,0.25),transparent_60%)]" aria-hidden />

      <section className="mx-auto max-w-6xl px-4 pt-12 md:pt-16 pb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">Build spreadsheets like a team of hundreds</h1>
          <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">Turn text into Excel in seconds. Describe what you need and choose your provider. We generate clean sheets with formulas, summaries and a starter dashboard.</p>
        </div>

        {/* Generator centered under heading */}
        <div className="mt-8 flex justify-center">
          <Card className="w-full max-w-3xl p-6 shadow-2xl border-white/10 bg-neutral-900/70">
            <div className="space-y-4">
              <div>
                <Label htmlFor="desc" className="text-neutral-200">What should we build?</Label>
                <Textarea id="desc" rows={6} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g., Create a sales dashboard with monthly trend, top 10 products, and ROI calculator." className="mt-2 bg-neutral-900/60 text-neutral-100 border-white/10" />
              </div>

              <div className="flex items-center gap-3">
                <Button disabled={busy} onClick={handleGenerate} className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-5">
                  <Download className="w-4 h-4 mr-1" /> Generate Excel
                </Button>
              </div>

              <div className="pt-1">
                <span className="text-xs text-neutral-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-rose-400" /> Non-AI stub now. AI next.</span>
                {/* Provider moved inside generator underneath stub note */}
                <div className="mt-3">
                  <Label htmlFor="provider" className="text-neutral-300">Provider</Label>
                  <Select value={provider} onValueChange={setProvider}>
                    <SelectTrigger id="provider" className="mt-1 w-full bg-neutral-900/80 border-white/10 text-neutral-100" aria-label="provider">
                      <SelectValue placeholder="Auto (recommended)" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-white/10 text-neutral-100">
                      <SelectItem value="auto">Auto (recommended)</SelectItem>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="gemini">Google Gemini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-3 gap-5">
          <Card className="p-5 bg-neutral-900/60 border-white/10">
            <h3 className="font-medium text-white">Instant Models</h3>
            <p className="text-sm text-neutral-400 mt-2">Finance, sales, ops – get starter tabs with formulas and a summary chart on download.</p>
          </Card>
          <Card className="p-5 bg-neutral-900/60 border-white/10">
            <h3 className="font-medium text-white">Provider Choice</h3>
            <p className="text-sm text-neutral-400 mt-2">Dropdown to choose OpenAI, Claude, or Gemini (AI wiring is the next step).</p>
          </Card>
          <Card className="p-5 bg-neutral-900/60 border-white/10">
            <h3 className="font-medium text-white">Export &amp; Save</h3>
            <p className="text-sm text-neutral-400 mt-2">Download as .xlsx and view your recent generations below.</p>
          </Card>
        </div>
      </section>

      <Separator className="bg-white/10" />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-xl font-semibold text-white">Recent generations</h2>
        <RecentList />
      </section>
    </div>
  );
}

function RecentList() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${API}/generations`);
        if (!cancelled) setItems(res.data || []);
      } catch (e) {
        // noop
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!items?.length) return (
    <p className="text-sm text-neutral-400 mt-2">No generations yet. Create your first above.</p>
  );
  return (
    <div className="mt-4 grid md:grid-cols-2 gap-4">
      {items.map((it) => (
        <Card key={it.id} className="p-4 flex items-center justify-between bg-neutral-900/60 border-white/10">
          <div>
            <p className="text-sm font-medium line-clamp-1 text-white">{it.description}</p>
            <p className="text-xs text-neutral-400 mt-1">{new Date(it.created_at).toLocaleString()} • {Math.round(it.size_bytes/1024)} KB</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">{it.provider}</span>
        </Card>
      ))}
    </div>
  );
}

function AuthPage({ setToken }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const submit = async () => {
    try {
      if (!email || !password) return toast.error("Enter email and password");
      setLoading(true);
      if (mode === "register") {
        await axios.post(`${API}/auth/register`, { email, password });
        toast.success("Registered. You can sign in now.");
        setMode("login");
      } else {
        const res = await axios.post(`${API}/auth/login`, { email, password });
        setToken(res.data.access_token);
        toast.success("Signed in");
        navigate("/");
      }
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  const startGoogle = async () => {
    try {
      const res = await axios.get(`${API}/auth/google/login`);
      if (res.data?.auth_url) {
        window.location.href = res.data.auth_url;
      }
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Google sign-in not configured yet");
    }
  };

  const startMicrosoft = async () => {
    try {
      const res = await axios.get(`${API}/auth/microsoft/login`);
      if (res.data?.auth_url) {
        window.location.href = res.data.auth_url;
      }
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Microsoft sign-in not configured yet");
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] grid md:grid-cols-2">
      {/* Left visual panel */}
      <div className="relative hidden md:block bg-black">
        <img
          src="https://images.unsplash.com/photo-1631556269791-fff05a526613?auto=format&amp;fit=crop&amp;w=1600&amp;q=80"
          alt="Abstract"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-10 left-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">Build like a team of hundreds<span className="text-rose-500">_</span></h2>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-[#0b0b0c]">
        <div className="w-full max-w-sm px-6 py-10">
          <h3 className="text-xl font-semibold text-white">{mode === "login" ? "Sign in" : "Create account"}</h3>

          {/* Social buttons */}
          <div className="mt-6 grid grid-cols-1 gap-3">
            <Button onClick={startGoogle} variant="secondary" className="w-full bg-neutral-900/70 border-white/10 text-neutral-100 hover:bg-neutral-800">Continue with Google</Button>
            <Button onClick={startMicrosoft} variant="secondary" className="w-full bg-neutral-900/70 border-white/10 text-neutral-100 hover:bg-neutral-800">Continue with Microsoft</Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-neutral-500 text-xs">
            <div className="h-px flex-1 bg-white/10" /> OR <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="space-y-3">
            <Label className="text-neutral-300">Email</Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9 bg-neutral-900/70 border-white/10 text-neutral-100" />
            </div>
            <Label className="text-neutral-300">Password</Label>
            <div className="relative">
              <Input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-9 bg-neutral-900/70 border-white/10 text-neutral-100" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200" aria-label="toggle password">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button onClick={submit} disabled={loading} className="w-full rounded-md bg-rose-500 hover:bg-rose-600 text-white">{mode === "login" ? "Sign in" : "Create account"}</Button>
            <div className="text-xs text-neutral-400 pt-2">
              {mode === "login" ? (
                <span>Don&apos;t have an account? <button onClick={() => setMode("register")} className="underline underline-offset-4 text-rose-400 hover:text-rose-300">Sign up</button></span>
              ) : (
                <span>Already have an account? <button onClick={() => setMode("login")} className="underline underline-offset-4 text-rose-400 hover:text-rose-300">Sign in</button></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { token, setToken } = useAuthToken();
  const onLogout = () => { setToken(""); toast.success("Logged out"); };

  useEffect(() => {
    // warm backend
    axios.get(`${API}/`).catch(() => {});
  }, []);

  return (
    <div className="dark min-h-screen bg-black text-white">
      <BrowserRouter>
        <Nav token={token} onLogout={onLogout} />
        <Routes>
          <Route path="/" element={<Home token={token} />} />
          <Route path="/auth" element={<AuthPage setToken={setToken} />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-center" />
    </div>
  );
}

export default App;