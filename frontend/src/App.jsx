
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, AlertCircle, ArrowDownToLine, ArrowRight, Bell, Bot,
  Check, CheckCircle2, ChevronDown, ChevronRight, CircleDot,
  Clock3, Code2, Command, Cpu, Download, FileCode2, FileJson,
  FileText, FlaskConical, Folder, FolderKanban, Gauge, GitBranch,
  LayoutDashboard, Menu, Moon, Network, Plus, RefreshCw, Search,
  Settings, ShieldCheck, Sun, Terminal, Workflow, X, Zap
} from "lucide-react";
import "./styles.css";

const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const AGENTS = [
  { key: "planner", name: "Project Planner", role: "Software Architect", detail: "Analysing requirements", icon: Network, color: "violet" },
  { key: "developer", name: "Python Developer", role: "Backend Developer", detail: "Generating source code", icon: Code2, color: "blue" },
  { key: "qa", name: "QA Engineer", role: "Software Tester", detail: "Running test cases", icon: FlaskConical, color: "amber" },
  { key: "reviewer", name: "Code Reviewer", role: "Senior Developer", detail: "Reviewing code quality", icon: ShieldCheck, color: "green" }
];

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "studio", label: "Agent Studio", icon: Workflow },
  { id: "projects", label: "Projects", icon: Folder },
  { id: "logs", label: "Execution Logs", icon: Terminal },
  { id: "artifacts", label: "Artifacts", icon: FileCode2 },
  { id: "analytics", label: "Analytics", icon: Gauge },
  { id: "settings", label: "Settings", icon: Settings }
];

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || `Request failed (${response.status})`);
  }
  return data;
}

function downloadFile(filename, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function formatDuration(ms) {
  if (!ms || ms < 0) return "—";
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function readTheme() {
  try {
    return localStorage.getItem("devteam-theme") || "dark";
  } catch {
    return "dark";
  }
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [theme, setTheme] = useState(readTheme);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [health, setHealth] = useState("checking");
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [requirement, setRequirement] = useState("");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("plan");
  const [startedAt, setStartedAt] = useState(null);
  const [duration, setDuration] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("devteam-theme", theme);
    } catch {
      // Theme remains available for this session.
    }
  }, [theme]);

  const checkHealth = useCallback(async () => {
    setHealth("checking");
    try {
      const data = await api("/api/health");
      setHealth(data.status === "ok" ? "online" : "offline");
    } catch {
      setHealth("offline");
    }
  }, []);

  const loadProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const data = await api("/api/projects");
      setProjects(Array.isArray(data) ? data : data.projects || []);
      setLastRefresh(new Date());
    } catch (err) {
      setError(`Could not load projects: ${err.message}`);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([checkHealth(), loadProjects()]);
  }, [checkHealth, loadProjects]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const openPage = (next) => {
    setPage(next);
    setMobileMenu(false);
    setError("");
    if (next === "projects" || next === "dashboard") loadProjects();
  };

  const runProject = async (event) => {
    event.preventDefault();
    if (requirement.trim().length < 20) {
      setError("Please enter a detailed requirement (at least 20 characters).");
      return;
    }

    setError("");
    setResult(null);
    setSelectedProject(null);
    setLoading(true);
    setPage("studio");
    setActiveTab("plan");
    setStartedAt(Date.now());
    setDuration(null);

    try {
      const data = await api("/api/workflow/run", {
        method: "POST",
        body: JSON.stringify({ requirement: requirement.trim() })
      });
      setResult(data);
      setDuration(Date.now() - (startedAt || Date.now()));
      setSelectedProject(data);
      await loadProjects();
    } catch (err) {
      setError(err.message || "Workflow could not be completed.");
    } finally {
      setLoading(false);
    }
  };

  const openProject = async (id) => {
    if (!id) return;
    setError("");
    try {
      const data = await api(`/api/projects/${encodeURIComponent(id)}`);
      setSelectedProject(data);
      setResult(data);
      setPage("studio");
      setActiveTab("plan");
    } catch (err) {
      setError(`Could not open project: ${err.message}`);
    }
  };

  const current = result || selectedProject;
  const plan = current?.plan || {};
  const implementation = current?.implementation || {};
  const qa = current?.qa || {};
  const execution = current?.test_execution || {};
  const review = current?.review || {};
  const report = current?.report || {};
  const files = implementation.files || [];
  const testFiles = qa.test_files || [];
  const allFiles = [...files, ...testFiles];
  const events = current?.agent_events || [];

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((item) =>
      `${item.title || ""} ${item.requirement || ""} ${item.status || ""}`
        .toLowerCase().includes(term)
    );
  }, [projects, search]);

  const totalRuns = projects.filter((p) => p.status === "completed").length;
  const passed = Number(execution.passed || 0);
  const failed = Number(execution.failed || 0);
  const elapsed = duration ? formatDuration(duration) : "—";

  const eventFor = (name) =>
    events.filter((event) => event.agent === name);

  const agentState = (agent) => {
    const matching = eventFor(agent.name);
    if (matching.some((e) => e.status === "completed")) return "completed";
    if (matching.some((e) => e.status === "running")) return "running";
    if (matching.some((e) => e.status === "failed")) return "failed";
    return "waiting";
  };

  const exportReport = () => {
    if (!current) return;
    downloadFile(
      "devteam-ai-report.json",
      JSON.stringify(current, null, 2),
      "application/json"
    );
  };

  const downloadAllFiles = () => {
    if (!allFiles.length) return;
    const bundle = allFiles.map((file) =>
      `# ===== ${file.path || "generated_file.py"} =====\n${file.content || ""}`
    ).join("\n\n");
    downloadFile("devteam-ai-generated-files.txt", bundle);
  };

  const downloadOne = (file) => {
    const safeName = (file.path || "generated_file.py").split("/").pop();
    downloadFile(safeName, file.content || "");
  };

  const title = {
    dashboard: "Dashboard",
    studio: "Agent Studio",
    new: "New Project",
    projects: "Projects",
    logs: "Execution Logs",
    artifacts: "Artifacts",
    analytics: "Analytics",
    settings: "Settings"
  }[page] || "Dashboard";

  return (
    <div className="app-shell">
      {mobileMenu && (
        <button className="mobile-backdrop" onClick={() => setMobileMenu(false)} aria-label="Close menu" />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-symbol"><Workflow size={23} /></div>
          <div className="brand-copy">
            <strong>DevTeam <span>AI</span></strong>
            <small>AGENT ORCHESTRATION</small>
          </div>
          <button className="icon-btn sidebar-mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-search">
          <Search size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workspace..."
          />
          <kbd>⌘ K</kbd>
        </div>

        <div className="nav-section-label">WORKSPACE</div>
        <nav className="main-nav">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => openPage(item.id)}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {item.id === "projects" && <span className="nav-count">{projects.length}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-divider" />
        <div className="nav-section-label registry-label">AGENT REGISTRY</div>

        <div className="sidebar-agents">
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            const state = current ? agentState(agent) : "waiting";
            return (
              <div className="sidebar-agent" key={agent.key}>
                <div className={`agent-avatar ${agent.color}`}><Icon size={17} /></div>
                <div className="sidebar-agent-copy">
                  <b>{agent.name}</b>
                  <small>{agent.role}</small>
                </div>
                <span className={`agent-indicator ${state}`} />
              </div>
            );
          })}
        </div>

        <div className="sidebar-bottom">
          <div className="runtime-mini">
            <div className="runtime-mini-heading">
              <span>AI RUNTIME</span>
              <b className={health}><i />{health === "online" ? "Online" : health === "offline" ? "Offline" : "Checking"}</b>
            </div>
            <div className="runtime-mini-row"><span>FastAPI</span><Check size={13} /></div>
            <div className="runtime-mini-row"><span>Workflow API</span><span className="runtime-value">{health === "online" ? "Ready" : "—"}</span></div>
            <div className="runtime-wave">
              <span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
            </div>
          </div>
          <div className="profile-block">
            <div className="profile-avatar">DT</div>
            <div><b>Developer workspace</b><small>Local environment</small></div>
            <button className="icon-btn" onClick={() => openPage("settings")} aria-label="Settings"><Settings size={16} /></button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-menu-btn" onClick={() => setMobileMenu(true)} aria-label="Open menu">
              <Menu size={19} />
            </button>
            <div className="breadcrumbs">
              <span>Workspace</span><ChevronRight size={14} /><b>{title}</b>
            </div>
          </div>
          <div className="topbar-right">
            <div className={`api-chip ${health}`}>
              <i /> API {health === "online" ? "Connected" : health === "offline" ? "Offline" : "Checking"}
            </div>
            <button className="icon-btn" onClick={refreshAll} title="Refresh workspace" aria-label="Refresh workspace">
              <RefreshCw size={17} className={projectsLoading ? "spin" : ""} />
            </button>
            <button
              className="icon-btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="notification-btn" title="No new notifications"><Bell size={17} /><i /></button>
            <div className="top-avatar">DT</div>
          </div>
        </header>

        {error && (
          <div className="global-error">
            <AlertCircle size={17} />
            <span>{error}</span>
            <button onClick={() => setError("")} aria-label="Dismiss error"><X size={16} /></button>
          </div>
        )}

        {page === "dashboard" && (
          <div className="page-content">
            <section className="welcome-row">
              <div>
                <div className="eyebrow"><span className="eyebrow-line" /> ENGINEERING CONTROL CENTER</div>
                <h1>Welcome back, Developer.</h1>
                <p>Your AI engineering team is ready to build, test and review software.</p>
              </div>
              <button className="primary-btn" onClick={() => openPage("new")}>
                <Plus size={17} /> New Project
              </button>
            </section>

            <section className="metrics-grid">
              <Metric icon={FolderKanban} label="Total Projects" value={projects.length} tone="violet" note="Saved sessions" />
              <Metric icon={CheckCircle2} label="Completed Runs" value={totalRuns} tone="green" note="Completed workflows" />
              <Metric icon={Bot} label="Active Agents" value="4" tone="blue" note="Configured agent roles" />
              <Metric icon={Zap} label="Last Execution" value={elapsed} tone="amber" note="This browser session" />
            </section>

            <section className="dashboard-grid">
              <div className="panel orchestration-panel">
                <div className="panel-topline">
                  <div className="panel-title">
                    <span className="live-dot" />
                    <div><b>Agent Orchestration Flow</b><small>Connected workflow architecture</small></div>
                    <span className={`run-badge ${loading ? "running" : ""}`}>{loading ? "Running" : current ? "Last run" : "Standby"}</span>
                  </div>
                  <button className="text-action" onClick={() => openPage("studio")}>Open Studio <ArrowRight size={15} /></button>
                </div>
                <OrchestrationGraph current={current} loading={loading} agentState={agentState} />
                <div className="graph-legend">
                  <span><i className="violet-dot" /> Planner</span>
                  <span><i className="blue-dot" /> Developer</span>
                  <span><i className="amber-dot" /> QA</span>
                  <span><i className="green-dot" /> Reviewer</span>
                </div>
              </div>

              <div className="right-stack">
                <div className="panel runtime-panel">
                  <div className="panel-heading"><h3>Runtime Status</h3><span className={`status-pulse ${health}`} /></div>
                  <RuntimeRow label="FastAPI Server" value={health === "online" ? "Healthy" : health === "offline" ? "Offline" : "Checking"} tone={health} />
                  <RuntimeRow label="Workflow API" value={health === "online" ? "Available" : "Unavailable"} tone={health} />
                  <RuntimeRow label="LangGraph" value="Workflow engine" tone="green" />
                  <div className="runtime-foot">Last checked: {lastRefresh ? lastRefresh.toLocaleTimeString() : "Not checked"}</div>
                </div>

                <div className="panel live-log-panel">
                  <div className="panel-heading"><h3>Live Logs</h3><button className="text-action" onClick={() => openPage("logs")}>View all <ArrowRight size={13} /></button></div>
                  {events.length ? events.slice(-4).reverse().map((event, index) => (
                    <LogLine key={`${event.timestamp}-${index}`} event={event} />
                  )) : <div className="muted-empty">Workflow events will appear here after a run.</div>}
                </div>
              </div>
            </section>

            <section className="bottom-grid">
              <div className="panel trace-panel">
                <div className="panel-heading"><div><h3>Execution Trace</h3><small>Agent activity from the latest workflow</small></div><span className="subtle-tag">{events.length} events</span></div>
                {events.length ? events.map((event, index) => (
                  <TraceRow key={`${event.timestamp}-${index}`} event={event} />
                )) : <EmptyState icon={GitBranch} title="No execution trace" text="Run a project to see actual agent events." />}
              </div>

              <div className="panel artifacts-panel">
                <div className="panel-heading"><div><h3>Generated Artifacts</h3><small>Files returned by the developer and QA agents</small></div><button className="text-action" onClick={() => openPage("artifacts")}>View all <ArrowRight size={13} /></button></div>
                {allFiles.length ? allFiles.slice(0, 4).map((file, index) => (
                  <ArtifactRow key={`${file.path}-${index}`} file={file} onDownload={downloadOne} />
                )) : <EmptyState icon={FileCode2} title="No artifacts yet" text="Generated files will appear after a successful workflow." />}
                {allFiles.length > 0 && <button className="download-all-btn" onClick={downloadAllFiles}><Download size={14} /> Download all generated files</button>}
              </div>

              <div className="panel project-overview-panel">
                <div className="panel-heading"><div><h3>Project Overview</h3><small>Latest workflow summary</small></div><span className="subtle-tag">{current ? current.status || "Returned" : "No run"}</span></div>
                {current ? (
                  <>
                    <h4>{current.title || plan.project_title || "Development project"}</h4>
                    <p className="overview-description">{plan.summary || current.requirement}</p>
                    <div className="overview-stats">
                      <div><small>Generated files</small><b>{allFiles.length}</b></div>
                      <div><small>Tests passed</small><b>{passed}</b></div>
                      <div><small>Tests failed</small><b>{failed}</b></div>
                    </div>
                    <button className="outline-btn full-btn" onClick={() => openPage("studio")}>Open project details <ArrowRight size={14} /></button>
                  </>
                ) : <EmptyState icon={FolderKanban} title="No active project" text="Start a workflow to populate this overview." />}
              </div>
            </section>

            <section className="recent-section panel">
              <div className="panel-heading"><div><h3>Recent Projects</h3><small>Latest saved workspace activity</small></div><button className="text-action" onClick={() => openPage("projects")}>View all <ArrowRight size={13} /></button></div>
              {projects.length ? projects.slice(0, 4).map((project) => (
                <ProjectRow key={project.id} project={project} onOpen={openProject} />
              )) : <EmptyState icon={Folder} title="No saved projects" text="Your completed workflows will be listed here." />}
            </section>
          </div>
        )}

        {page === "new" && (
          <div className="page-content narrow-content">
            <PageHeading eyebrow="NEW WORKFLOW" title="Create a project" subtitle="Define the software requirement. Your specialist agents will plan, implement, test and review it." />
            <form className="panel requirement-panel" onSubmit={runProject}>
              <div className="form-label-row"><label htmlFor="requirement">SOFTWARE REQUIREMENT</label><span>{requirement.length}/6000</span></div>
              <textarea
                id="requirement"
                value={requirement}
                maxLength={6000}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="Describe the software you want to build. Include features, expected behaviour, inputs, outputs and preferred technology..."
              />
              <div className="form-guidance"><Zap size={15} /> Specific requirements help agents produce more useful plans and code.</div>
              <div className="form-bottom">
                <span><ShieldCheck size={15} /> Four-agent LangGraph workflow</span>
                <button className="primary-btn" disabled={loading || requirement.trim().length < 20}>
                  {loading ? <><RefreshCw size={16} className="spin" /> Running agents...</> : <><Workflow size={16} /> Run AI Team <ArrowRight size={15} /></>}
                </button>
              </div>
            </form>
            <div className="panel team-preview">
              <div className="panel-heading"><div><h3>Agent execution sequence</h3><small>Workflow stages configured in your backend</small></div><span className="subtle-tag">4 agents + test runner</span></div>
              <div className="team-preview-grid">
                {AGENTS.map((agent, index) => <AgentPreview key={agent.key} agent={agent} index={index} />)}
              </div>
            </div>
          </div>
        )}

        {page === "studio" && (
          <div className="page-content">
            <PageHeading eyebrow="DEVELOPMENT SESSION" title={current?.title || plan.project_title || "Agent Studio"} subtitle={current?.requirement || "Inspect the outputs from each agent in your development workflow."} />
            <div className="studio-grid">
              <div className="panel studio-trace">
                <div className="panel-heading"><div><h3>Agent Execution</h3><small>Actual workflow events returned by the backend</small></div><span className={`run-badge ${loading ? "running" : ""}`}>{loading ? "Running" : current ? "Completed response" : "Standby"}</span></div>
                {AGENTS.map((agent) => {
                  const Icon = agent.icon;
                  const state = current ? agentState(agent) : "waiting";
                  return <div className="execution-agent-row" key={agent.key}>
                    <div className={`agent-avatar ${agent.color}`}><Icon size={17} /></div>
                    <div className="execution-agent-copy"><b>{agent.name}</b><small>{agent.detail}</small></div>
                    <span className={`execution-state ${state}`}>{state}</span>
                  </div>;
                })}
                <div className="execution-summary">
                  <div><small>Test status</small><b>{execution.status || "Not run"}</b></div>
                  <div><small>Passed</small><b>{passed}</b></div>
                  <div><small>Failed</small><b>{failed}</b></div>
                </div>
              </div>

              <div className="panel studio-output">
                <div className="panel-heading"><div><h3>Workflow Output</h3><small>Inspect each stage's returned data</small></div>{current && <button className="icon-btn" onClick={exportReport} title="Download report"><Download size={16} /></button>}</div>
                <div className="output-tabs">
                  {["plan", "code", "tests", "review", "report"].map((tab) => (
                    <button key={tab} className={activeTab === tab ? "selected" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>
                  ))}
                </div>
                {!current ? <EmptyState icon={Terminal} title="No workflow output" text="Start a new project to view the agent results." /> : (
                  <OutputContent tab={activeTab} plan={plan} implementation={implementation} qa={qa} execution={execution} review={review} report={report} current={current} />
                )}
              </div>
            </div>
            {current && <div className="panel studio-events">
              <div className="panel-heading"><div><h3>Execution Events</h3><small>Agent messages recorded by LangGraph</small></div><span className="subtle-tag">{events.length} records</span></div>
              {events.length ? events.map((event, index) => <LogLine key={`${event.timestamp}-${index}`} event={event} detailed />) : <EmptyState icon={Activity} title="No events returned" text="This workflow response contains no agent events." />}
            </div>}
          </div>
        )}

        {page === "projects" && (
          <div className="page-content">
            <PageHeading eyebrow="WORKSPACE ARCHIVE" title="Projects" subtitle="Browse saved projects returned by your FastAPI backend." />
            <div className="panel projects-panel">
              <div className="projects-toolbar">
                <div className="search-input"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." /></div>
                <button className="outline-btn" onClick={loadProjects} disabled={projectsLoading}><RefreshCw size={15} className={projectsLoading ? "spin" : ""} /> Refresh</button>
                <button className="primary-btn" onClick={() => openPage("new")}><Plus size={15} /> New Project</button>
              </div>
              {projectsLoading ? <EmptyState icon={RefreshCw} title="Refreshing projects" text="Loading records from the backend." /> :
                filteredProjects.length ? filteredProjects.map((project) => <ProjectRow key={project.id} project={project} onOpen={openProject} />) :
                <EmptyState icon={Folder} title="No matching projects" text="Try another search or create a new project." />}
            </div>
          </div>
        )}

        {page === "logs" && (
          <div className="page-content">
            <PageHeading eyebrow="OBSERVABILITY" title="Execution Logs" subtitle="Workflow events returned by the latest completed execution." />
            <div className="panel logs-panel">
              <div className="panel-heading"><div><h3>Agent Event Stream</h3><small>Recorded events — not simulated live logs</small></div><span className="subtle-tag">{events.length} events</span></div>
              {events.length ? events.map((event, index) => <LogLine key={`${event.timestamp}-${index}`} event={event} detailed />) :
                <EmptyState icon={Terminal} title="No execution logs" text="Run a workflow to populate this event log." />}
            </div>
          </div>
        )}

        {page === "artifacts" && (
          <div className="page-content">
            <PageHeading eyebrow="OUTPUT LIBRARY" title="Generated Artifacts" subtitle="Python source files and test files returned by the agents." />
            <div className="panel artifacts-library">
              <div className="panel-heading"><div><h3>Project files</h3><small>{allFiles.length} files in the selected workflow</small></div><button className="outline-btn" disabled={!allFiles.length} onClick={downloadAllFiles}><Download size={15} /> Download all</button></div>
              {allFiles.length ? allFiles.map((file, index) => <ArtifactRow key={`${file.path}-${index}`} file={file} onDownload={downloadOne} />) :
                <EmptyState icon={FileCode2} title="No generated files" text="Generated code and test files will appear after a successful run." />}
            </div>
          </div>
        )}

        {page === "analytics" && (
          <div className="page-content">
            <PageHeading eyebrow="WORKSPACE INSIGHTS" title="Analytics" subtitle="Metrics calculated from the project records and latest workflow response." />
            <div className="metrics-grid analytics-metrics">
              <Metric icon={FolderKanban} label="Saved Projects" value={projects.length} tone="violet" note="Database records" />
              <Metric icon={CheckCircle2} label="Completed Projects" value={totalRuns} tone="green" note="Status = completed" />
              <Metric icon={FileCode2} label="Latest Generated Files" value={allFiles.length} tone="blue" note="Latest selected run" />
              <Metric icon={FlaskConical} label="Latest Tests Passed" value={passed} tone="amber" note={`Failed: ${failed}`} />
            </div>
            <div className="panel analytics-panel">
              <div className="panel-heading"><div><h3>Latest workflow quality</h3><small>Values from the latest review and test execution response</small></div></div>
              <div className="quality-grid">
                <div><small>Review status</small><b>{review.overall_status || "Not available"}</b></div>
                <div><small>Quality score</small><b>{review.quality_score ?? "—"}</b></div>
                <div><small>Test execution</small><b>{execution.status || "Not available"}</b></div>
              </div>
              <p className="analytics-note">This page reports returned backend data only. It does not estimate unrecorded execution times or fabricate historical analytics.</p>
            </div>
          </div>
        )}

        {page === "settings" && (
          <div className="page-content narrow-content">
            <PageHeading eyebrow="WORKSPACE CONFIGURATION" title="Settings" subtitle="Manage the local dashboard appearance and inspect backend connectivity." />
            <div className="panel settings-panel">
              <SettingRow icon={theme === "dark" ? Moon : Sun} title="Appearance" description="Choose the dashboard colour scheme.">
                <button className="outline-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}{theme === "dark" ? "Light mode" : "Dark mode"}</button>
              </SettingRow>
              <SettingRow icon={Activity} title="Backend API" description={`API endpoint: ${API}`}>
                <span className={`setting-status ${health}`}>{health}</span>
              </SettingRow>
              <SettingRow icon={Workflow} title="Workflow engine" description="LangGraph workflow endpoint">
                <span className="setting-status">{health === "online" ? "Reachable API" : "Not verified"}</span>
              </SettingRow>
              <SettingRow icon={Cpu} title="AI provider" description="Provider configuration is managed on the backend.">
                <span className="setting-status">Backend managed</span>
              </SettingRow>
              <div className="settings-actions"><button className="primary-btn" onClick={refreshAll}><RefreshCw size={15} /> Check connection & refresh</button></div>
            </div>
          </div>
        )}

        <footer className="app-footer">
          <span>DEVTEAM AI <i>•</i> ENGINEERING CONTROL CENTER</span>
          <span>FastAPI <i>·</i> LangGraph <i>·</i> AI provider managed server-side</span>
        </footer>
      </main>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone, note }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}><Icon size={18} /></div>
      <div className="metric-label">{label}</div>
      <strong>{value}</strong>
      <small>{note}</small>
      <div className={`metric-accent ${tone}`} />
    </div>
  );
}

function PageHeading({ eyebrow, title, subtitle }) {
  return <section className="page-heading">
    <div className="eyebrow">{eyebrow}</div>
    <h1>{title}</h1>
    <p>{subtitle}</p>
  </section>;
}

function OrchestrationGraph({ current, loading, agentState }) {
  const nodeState = (agent) => loading && agentState(agent) === "waiting" ? "waiting" : agentState(agent);
  return (
    <div className="graph-stage">
      <div className="graph-grid-bg" />
      <svg className="graph-lines" viewBox="0 0 900 340" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path d="M170 170 C225 170 220 65 290 65" />
        <path d="M170 170 C230 170 220 145 290 145" />
        <path d="M170 170 C230 170 220 225 290 225" />
        <path d="M170 170 C230 170 220 305 290 305" />
        <path d="M650 65 C710 65 700 170 760 170" />
        <path d="M650 145 C710 145 700 170 760 170" />
        <path d="M650 225 C710 225 700 170 760 170" />
        <path d="M650 305 C710 305 700 170 760 170" />
      </svg>

      <div className="graph-node input-node">
        <div className="node-icon"><FileText size={18} /></div>
        <b>Requirement</b>
        <small>{current ? "Software specification received" : "Awaiting software requirement"}</small>
      </div>

      {AGENTS.map((agent, index) => {
        const Icon = agent.icon;
        const state = nodeState(agent);
        return (
          <div className={`graph-node agent-node node-${index} ${agent.color} ${state}`} key={agent.key}>
            <div className={`node-icon ${agent.color}`}><Icon size={18} /></div>
            <div className="node-copy"><b>{agent.name}</b><small>{agent.detail}</small></div>
            <span className={`node-status ${state}`} />
          </div>
        );
      })}

      <div className={`graph-node output-node ${current ? "has-output" : ""}`}>
        <div className="output-check">{current ? <Check size={23} /> : <CircleDot size={23} />}</div>
        <b>Workflow output</b>
        <small>{current ? "Response received" : "Awaiting execution"}</small>
        <div className="output-progress"><span style={{ width: current ? "100%" : loading ? "45%" : "0%" }} /></div>
      </div>
      <div className="graph-watermark">LANGGRAPH · SEQUENTIAL EXECUTION</div>
    </div>
  );
}

function RuntimeRow({ label, value, tone }) {
  return <div className="runtime-row"><span><i className={`runtime-dot ${tone}`} />{label}</span><b className={tone}>{value}</b></div>;
}

function LogLine({ event, detailed = false }) {
  return (
    <div className={`log-line ${detailed ? "detailed" : ""}`}>
      <span className={`log-dot ${event.status || "waiting"}`} />
      <span className="log-time">{event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : "—"}</span>
      <b>{event.agent || "Workflow"}</b>
      <span className="log-detail">{event.detail || event.status}</span>
      <span className={`log-status ${event.status}`}>{event.status}</span>
    </div>
  );
}

function TraceRow({ event }) {
  return (
    <div className="trace-row">
      <div className={`trace-marker ${event.status}`}><Check size={11} /></div>
      <div className="trace-copy"><b>{event.agent}</b><small>{event.detail}</small></div>
      <span className={`log-status ${event.status}`}>{event.status}</span>
      <time>{event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : "—"}</time>
    </div>
  );
}

function ArtifactRow({ file, onDownload }) {
  const isTest = (file.path || "").toLowerCase().includes("test");
  const Icon = isTest ? FlaskConical : FileCode2;
  return (
    <div className="artifact-row">
      <div className={`artifact-file-icon ${isTest ? "test" : ""}`}><Icon size={17} /></div>
      <div className="artifact-copy"><b>{file.path || "generated_file.py"}</b><small>{isTest ? "QA test file" : "Generated source file"}</small></div>
      <button className="icon-btn" onClick={() => onDownload(file)} title="Download file"><ArrowDownToLine size={16} /></button>
    </div>
  );
}

function ProjectRow({ project, onOpen }) {
  return (
    <button className="project-row" onClick={() => onOpen(project.id)}>
      <div className="project-file-icon"><FileCode2 size={17} /></div>
      <div className="project-row-copy">
        <b>{project.title || "Untitled project"}</b>
        <small>{(project.requirement || "").slice(0, 115)}{(project.requirement || "").length > 115 ? "…" : ""}</small>
      </div>
      <span className={`project-status ${project.status}`}>{project.status || "saved"}</span>
      <time>{formatDate(project.created_at)}</time>
      <ChevronRight size={16} />
    </button>
  );
}

function AgentPreview({ agent, index }) {
  const Icon = agent.icon;
  return (
    <div className="agent-preview">
      <div className={`agent-avatar ${agent.color}`}><Icon size={18} /></div>
      <div><b>0{index + 1} · {agent.name}</b><small>{agent.role}</small></div>
    </div>
  );
}

function OutputContent({ tab, plan, implementation, qa, execution, review, report, current }) {
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(false);

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(typeof value === "string" ? value : JSON.stringify(value, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const pretty = (value) => typeof value === "string" ? value : JSON.stringify(value ?? {}, null, 2);

  if (tab === "code") {
    const files = implementation.files || [];
    return <div className="output-body">
      <div className="output-section-heading"><b>Generated source files</b><span>{files.length} files</span></div>
      {files.length ? files.map((file, index) => (
        <div className="code-file" key={`${file.path}-${index}`}>
          <button className="code-file-heading" onClick={() => setExpanded(expanded === index ? null : index)}>
            <FileCode2 size={15} /><b>{file.path}</b><ChevronDown size={15} />
          </button>
          {expanded === index && <><pre className="code-content">{file.content || ""}</pre><button className="copy-code-btn" onClick={() => copy(file.content || "")}>{copied ? <Check size={13} /> : <Command size={13} />} {copied ? "Copied" : "Copy code"}</button></>}
        </div>
      )) : <EmptyState icon={FileCode2} title="No source files returned" text="The developer agent did not return any files." />}
    </div>;
  }

  if (tab === "tests") {
    return <div className="output-body">
      <div className="test-summary">
        <div><small>Execution status</small><b>{execution.status || "Not available"}</b></div>
        <div><small>Passed</small><b>{execution.passed ?? "—"}</b></div>
        <div><small>Failed</small><b>{execution.failed ?? "—"}</b></div>
      </div>
      <h4>Test strategy</h4><pre className="output-pre">{qa.test_strategy || "No test strategy returned."}</pre>
      <h4>Test cases</h4><pre className="output-pre">{pretty(qa.test_cases || [])}</pre>
      <h4>Test files</h4><pre className="output-pre">{pretty(qa.test_files || [])}</pre>
      {execution.output && <><h4>Runner output</h4><pre className="output-pre">{execution.output}</pre></>}
    </div>;
  }

  if (tab === "review") return <div className="output-body">
    <div className="review-status"><ShieldCheck size={19} /><b>{review.overall_status || "Review not available"}</b><span>Quality score: {review.quality_score ?? "—"}</span></div>
    <h4>Findings</h4><pre className="output-pre">{pretty(review.findings || [])}</pre>
    <h4>Missing requirements</h4><pre className="output-pre">{pretty(review.missing_requirements || [])}</pre>
    <h4>Recommendations</h4><pre className="output-pre">{pretty(review.recommendations || [])}</pre>
  </div>;

  if (tab === "report") return <div className="output-body">
    <div className="output-section-heading"><b>Final development report</b><button className="copy-code-btn" onClick={() => copy(report || current)}>{copied ? "Copied" : "Copy JSON"}</button></div>
    <pre className="output-pre">{pretty(report || current)}</pre>
  </div>;

  return <div className="output-body">
    <h4>Project summary</h4><pre className="output-pre">{plan.summary || "No project summary returned."}</pre>
    <h4>Planned features</h4><pre className="output-pre">{pretty(plan.features || [])}</pre>
    <h4>Architecture modules</h4><pre className="output-pre">{pretty(plan.modules || [])}</pre>
    <h4>Implementation steps</h4><pre className="output-pre">{pretty(plan.implementation_steps || [])}</pre>
    <h4>Assumptions and risks</h4><pre className="output-pre">{pretty({ assumptions: plan.assumptions || [], risks: plan.risks || [] })}</pre>
  </div>;
}

function EmptyState({ icon: Icon, title, text }) {
  return <div className="empty-state"><div><Icon size={21} /></div><b>{title}</b><p>{text}</p></div>;
}

function SettingRow({ icon: Icon, title, description, children }) {
  return <div className="setting-row">
    <div className="setting-icon"><Icon size={18} /></div>
    <div className="setting-copy"><b>{title}</b><small>{description}</small></div>
    {children}
  </div>;
}

export default App;
