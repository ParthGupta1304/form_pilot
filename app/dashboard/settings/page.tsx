"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { ToastProvider } from "@/components/ui/Toast";
import TopBar from "@/components/dashboard/TopBar";
import {
  Settings,
  Users,
  Key,
  AlertTriangle,
  Upload,
  Check,
  Copy,
  Trash2,
  Plus,
  X,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

const ACCENT_COLORS = [
  { label: "Purple", value: "#534AB7" },
  { label: "Teal", value: "#0F6E56" },
  { label: "Coral", value: "#D85A30" },
  { label: "Blue", value: "#378ADD" },
  { label: "Green", value: "#639922" },
  { label: "Amber", value: "#BA7517" },
];

const TABS = [
  { label: "General", value: "general", icon: Settings },
  { label: "Members", value: "members", icon: Users },
  { label: "API Keys", value: "api-keys", icon: Key },
  { label: "Danger Zone", value: "danger", icon: AlertTriangle },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export default function SettingsPage() {
  return (
    <ToastProvider>
      <SettingsContent />
    </ToastProvider>
  );
}

function SettingsContent() {
  const [activeTab, setActiveTab] = useState<TabValue>("general");

  return (
    <div>
      <TopBar title="Settings" />

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-border/40 mb-6 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
              aria-label={`${tab.label} settings tab`}
              aria-selected={activeTab === tab.value}
              role="tab"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "general" && <GeneralTab />}
      {activeTab === "members" && <MembersTab />}
      {activeTab === "api-keys" && <ApiKeysTab />}
      {activeTab === "danger" && <DangerZoneTab />}
    </div>
  );
}

/* ─── GENERAL TAB ─── */
function GeneralTab() {
  const { toast } = useToast();
  const [orgName, setOrgName] = useState("My Workspace");
  const [accentColor, setAccentColor] = useState("#534AB7");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log("[Settings/General] Saving:", { orgName, accentColor });
      await new Promise((r) => setTimeout(r, 1000));
      toast("Settings saved!", "success");
    } catch (err) {
      console.error("[Settings/General] Save error:", err);
      toast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {/* Org name */}
        <div>
          <label htmlFor="org-name" className="block text-sm font-medium text-foreground mb-1.5">
            Workspace name
          </label>
          <input
            id="org-name"
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full max-w-md rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        {/* Logo upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Logo</label>
          <div
            className="flex max-w-md cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border/60 px-6 py-6 text-center transition-colors hover:border-border hover:bg-muted/30"
            role="button"
            aria-label="Upload logo"
            tabIndex={0}
          >
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click to upload logo</p>
          </div>
        </div>

        {/* Accent color */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Accent color</label>
          <div className="flex flex-wrap gap-3">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setAccentColor(color.value)}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150",
                  accentColor === color.value ? "ring-2 ring-offset-2 ring-offset-background" : "hover:scale-110"
                )}
                style={{ backgroundColor: color.value }}
                aria-label={`Select ${color.label}`}
                title={color.label}
              >
                {accentColor === color.value && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring/50"
          aria-label="Save changes"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {/* Live preview */}
      <div className="hidden lg:block">
        <label className="block text-sm font-medium text-foreground mb-2">Preview</label>
        <div className="rounded-xl border border-border/40 bg-muted/20 p-4 sticky top-24">
          <div className="rounded-lg bg-background p-5 border border-border/30">
            <div className="text-center mb-4">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold" style={{ backgroundColor: accentColor }}>
                {orgName.charAt(0) || "W"}
              </div>
              <p className="text-xs font-medium text-foreground">{orgName}</p>
            </div>
            <div className="space-y-3">
              <div className="h-3 w-28 mx-auto rounded bg-foreground/10" />
              <div className="rounded-lg border border-border/30 h-9 px-3 flex items-center">
                <span className="text-xs text-muted-foreground">Your answer...</span>
              </div>
              <div className="rounded-lg h-9 flex items-center justify-center text-white text-xs font-medium" style={{ backgroundColor: accentColor }}>
                Submit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MEMBERS TAB ─── */
function MembersTab() {
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  // Mock member data
  const members = [
    { id: "1", name: "Parth Gupta", email: "parth@example.com", role: "Admin", initials: "PG" },
    { id: "2", name: "Arjun Kumar", email: "arjun@example.com", role: "Member", initials: "AK" },
  ];

  const pendingInvites = [
    { id: "inv1", email: "newmember@example.com", role: "Member" },
  ];

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    console.log("[Settings/Members] Inviting:", inviteEmail, inviteRole);
    toast(`Invite sent to ${inviteEmail}`, "success");
    setInviteEmail("");
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Current members */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Current members</h3>
        <div className="rounded-xl border border-border/40 divide-y divide-border/40">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                  {member.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "rounded-md px-2 py-0.5 text-xs font-medium",
                  member.role === "Admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {member.role}
                </span>
                {member.role !== "Admin" && (
                  <button
                    className="text-xs text-destructive hover:underline"
                    aria-label={`Remove ${member.name}`}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite member */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Invite member</h3>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="email@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            aria-label="Invite email"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            aria-label="Invite role"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={!inviteEmail.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-label="Send invite"
          >
            <Plus className="h-3.5 w-3.5" /> Invite
          </button>
        </div>
      </div>

      {/* Pending invites */}
      {pendingInvites.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Pending invites</h3>
          <div className="rounded-xl border border-border/40 divide-y divide-border/40">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm text-foreground">{invite.email}</p>
                  <p className="text-xs text-muted-foreground">{invite.role}</p>
                </div>
                <button
                  className="text-xs text-destructive hover:underline"
                  aria-label={`Revoke invite for ${invite.email}`}
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── API KEYS TAB ─── */
function ApiKeysTab() {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);

  // Mock keys
  const [keys] = useState([
    {
      id: "1",
      label: "Production",
      lastFour: "a1b2",
      createdAt: "2025-11-15",
      lastUsedAt: "2025-12-01",
    },
  ]);

  const handleGenerateKey = () => {
    if (!newKeyLabel.trim()) return;
    const key = "fp_" + Array.from({ length: 32 }, () =>
      "abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 36))
    ).join("");
    console.log("[Settings/ApiKeys] Generated key:", key.slice(0, 10) + "...");
    setGeneratedKey(key);
  };

  const handleCopyKey = async () => {
    if (!generatedKey) return;
    try {
      await navigator.clipboard.writeText(generatedKey);
      setKeyCopied(true);
      toast("API key copied!", "success");
      setTimeout(() => setKeyCopied(false), 2000);
    } catch {
      toast("Failed to copy", "error");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">API Keys</h3>
        <button
          onClick={() => { setShowDialog(true); setGeneratedKey(null); setNewKeyLabel(""); }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/50"
          aria-label="Generate new API key"
        >
          <Plus className="h-3.5 w-3.5" /> Generate new key
        </button>
      </div>

      {/* Keys list */}
      <div className="rounded-xl border border-border/40 divide-y divide-border/40">
        {keys.map((apiKey) => (
          <div key={apiKey.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Key className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{apiKey.label}</p>
                <p className="text-xs text-muted-foreground">
                  fp_...{apiKey.lastFour} · Created {apiKey.createdAt}
                  {apiKey.lastUsedAt && ` · Last used ${apiKey.lastUsedAt}`}
                </p>
              </div>
            </div>
            <button
              className="text-xs text-destructive hover:underline"
              aria-label={`Revoke key: ${apiKey.label}`}
            >
              Revoke
            </button>
          </div>
        ))}
      </div>

      {/* Generate Key Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDialog(false)}>
          <div
            className="w-full max-w-md rounded-xl border border-border/60 bg-card p-6 shadow-xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Generate API key"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground">Generate API Key</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!generatedKey ? (
              <>
                <label htmlFor="key-label" className="block text-sm font-medium text-foreground mb-1.5">
                  Key label
                </label>
                <input
                  id="key-label"
                  type="text"
                  placeholder="e.g. Production, Staging"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 mb-4"
                />
                <button
                  onClick={handleGenerateKey}
                  disabled={!newKeyLabel.trim()}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring/50"
                  aria-label="Create key"
                >
                  Create key
                </button>
              </>
            ) : (
              <>
                <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-warning mb-1">
                    <Shield className="h-4 w-4" />
                    Save this key — it won&apos;t be shown again
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 mb-4">
                  <code className="flex-1 text-xs text-foreground break-all select-all">{generatedKey}</code>
                  <button
                    onClick={handleCopyKey}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                    aria-label="Copy API key"
                  >
                    {keyCopied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </div>

                <button
                  onClick={() => setShowDialog(false)}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/50"
                  aria-label="Done"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── DANGER ZONE TAB ─── */
function DangerZoneTab() {
  const { toast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const orgName = "My Workspace"; // In production, read from context

  const handleDelete = () => {
    if (confirmText !== orgName) return;
    console.log("[Settings/DangerZone] Deleting organization...");
    toast("Workspace deleted.", "success");
    setShowConfirm(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="rounded-xl border-2 border-destructive/30 p-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="text-base font-semibold text-destructive">Delete workspace</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Permanently delete this workspace and all its data. This action cannot be undone. All forms, responses, and AI summaries will be permanently removed.
        </p>
        <button
          onClick={() => setShowConfirm(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive/50"
          aria-label="Delete workspace"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete workspace
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowConfirm(false)}>
          <div
            className="w-full max-w-md rounded-xl border border-border/60 bg-card p-6 shadow-xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Confirm workspace deletion"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-semibold text-foreground">Are you sure?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently delete <strong>{orgName}</strong> and all its data.
              Type <strong>{orgName}</strong> below to confirm.
            </p>
            <input
              type="text"
              placeholder={orgName}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-lg border border-destructive/30 bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-destructive focus:outline-none focus:ring-2 focus:ring-destructive/30 mb-4"
              aria-label="Type workspace name to confirm deletion"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-lg border border-border/60 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={confirmText !== orgName}
                className="flex-1 rounded-lg bg-destructive py-2.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
                aria-label="Confirm delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
