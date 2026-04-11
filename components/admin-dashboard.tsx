"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Check,
  X,
  Clock,
  UserCheck,
  Plus,
  Copy,
  Send,
  Trash2,
  Loader2,
  Pencil,
  MessageSquare,
  Phone,
} from "lucide-react"
import type { Id } from "@/convex/_generated/dataModel"

type Tab = "stats" | "invites" | "rsvps"
type RsvpFilter = "all" | "attending" | "declined"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("stats")

  const tabs: { id: Tab; label: string }[] = [
    { id: "stats", label: "Overview" },
    { id: "invites", label: "Invites" },
    { id: "rsvps", label: "Responses" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage invites and RSVP responses</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-muted p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "stats" && <StatsTab />}
        {activeTab === "invites" && <InvitesTab />}
        {activeTab === "rsvps" && <RsvpsTab />}
      </div>
    </div>
  )
}

function StatsTab() {
  const stats = useQuery(api.rsvps.getRsvpStats)

  if (!stats) {
    return <div className="text-center py-12 text-muted-foreground">Loading stats...</div>
  }

  const statCards = [
    { label: "Total Invited", value: stats.totalInvited, icon: Users, color: "text-blue-600" },
    { label: "Attending", value: stats.attending, icon: Check, color: "text-green-600" },
    { label: "Declined", value: stats.declined, icon: X, color: "text-red-500" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
    { label: "Total Guests", value: stats.totalGuests, icon: UserCheck, color: "text-primary" },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.label} className="p-5 text-center">
          <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </Card>
      ))}
    </div>
  )
}

function InvitesTab() {
  const invites = useQuery(api.invites.listInvites)
  const createInvite = useMutation(api.invites.createInvite)
  const createBulkInvites = useMutation(api.invites.createBulkInvites)
  const deleteInviteMut = useMutation(api.invites.deleteInvite)
  const resendEmail = useMutation(api.invites.resendInviteEmail)
  const resendSms = useMutation(api.invites.resendInviteSms)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [maxGuests, setMaxGuests] = useState(2)
  const [sendEmailFlag, setSendEmailFlag] = useState(true)
  const [sendSmsFlag, setSendSmsFlag] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showBulk, setShowBulk] = useState(false)
  const [bulkCsv, setBulkCsv] = useState("")
  const [isBulkCreating, setIsBulkCreating] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!name.trim() || (!email.trim() && !phone.trim())) return
    setIsCreating(true)
    try {
      await createInvite({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        maxGuests,
        sendEmail: sendEmailFlag && !!email.trim(),
        sendSms: sendSmsFlag && !!phone.trim(),
      })
      setName("")
      setEmail("")
      setPhone("")
      setMaxGuests(2)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleBulkCreate = async () => {
    const lines = bulkCsv.trim().split("\n").filter(Boolean)
    const parsed = lines.map((line) => {
      const parts = line.split(",").map((p) => p.trim())
      return {
        name: parts[0] || "",
        email: parts[1] || "",
        maxGuests: parseInt(parts[2]) || 2,
      }
    })

    if (parsed.some((p) => !p.name || !p.email)) {
      alert("Each line must have at least name and email: name,email,maxGuests")
      return
    }

    setIsBulkCreating(true)
    try {
      await createBulkInvites({ invites: parsed, sendEmails: sendEmailFlag })
      setBulkCsv("")
      setShowBulk(false)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsBulkCreating(false)
    }
  }

  const copyInviteLink = (token: string) => {
    const url = `${window.location.origin}/invite?token=${token}`
    navigator.clipboard.writeText(url)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const handleDelete = async (inviteId: Id<"invites">) => {
    if (!confirm("Delete this invite?")) return
    try {
      await deleteInviteMut({ inviteId })
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleResendEmail = async (inviteId: Id<"invites">) => {
    try {
      await resendEmail({ inviteId })
      alert("Email sent!")
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleResendSms = async (inviteId: Id<"invites">) => {
    try {
      await resendSms({ inviteId })
      alert("SMS sent!")
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Create invite form */}
      <Card className="p-6">
        <h3 className="font-medium text-lg mb-4">Create Invite</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Guest name" />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="guest@email.com" type="email" />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890" type="tel" />
          </div>
          <div className="space-y-1">
            <Label>Max Guests</Label>
            <select
              value={maxGuests}
              onChange={(e) => setMaxGuests(Number(e.target.value))}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-end gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sendEmailFlag}
                onChange={(e) => setSendEmailFlag(e.target.checked)}
                className="rounded"
              />
              Send email
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sendSmsFlag}
                onChange={(e) => setSendSmsFlag(e.target.checked)}
                className="rounded"
              />
              Send SMS
            </label>
          </div>
          <div className="flex items-end">
            <Button onClick={handleCreate} disabled={isCreating} className="w-full">
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
              Create
            </Button>
          </div>
        </div>

        {/* Bulk create toggle */}
        <div className="mt-4">
          <button
            onClick={() => setShowBulk(!showBulk)}
            className="text-sm text-primary hover:underline"
          >
            {showBulk ? "Hide" : "Show"} bulk create (CSV)
          </button>
          {showBulk && (
            <div className="mt-3 space-y-3">
              <Textarea
                value={bulkCsv}
                onChange={(e) => setBulkCsv(e.target.value)}
                placeholder="name,email,maxGuests (one per line)&#10;John Doe,john@example.com,2&#10;Jane Smith,jane@example.com,3"
                rows={5}
              />
              <Button onClick={handleBulkCreate} disabled={isBulkCreating}>
                {isBulkCreating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Create All
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Invites table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Contact</th>
                <th className="text-center p-3 font-medium">Max</th>
                <th className="text-center p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites?.map((invite) => (
                <tr key={invite._id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3">{invite.name}</td>
                  <td className="p-3 text-muted-foreground">
                    <div className="space-y-0.5">
                      {invite.email && <div className="flex items-center gap-1"><Send className="h-3 w-3" />{invite.email}</div>}
                      {invite.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{invite.phone}</div>}
                    </div>
                  </td>
                  <td className="p-3 text-center">{invite.maxGuests}</td>
                  <td className="p-3 text-center">
                    {invite.rsvp ? (
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        invite.rsvp.attending
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {invite.rsvp.attending ? (
                          <><Check className="h-3 w-3" /> Attending</>
                        ) : (
                          <><X className="h-3 w-3" /> Declined</>
                        )}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyInviteLink(invite.token)}
                        title="Copy invite link"
                      >
                        {copiedToken === invite.token ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      {invite.email && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResendEmail(invite._id)}
                          title="Resend email"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      {invite.phone && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResendSms(invite._id)}
                          title="Resend SMS"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                      {!invite.used && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(invite._id)}
                          title="Delete invite"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {invites?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No invites created yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

const MEAL_OPTIONS = ["Chicken", "Steak", "Vegetarian"]

function RsvpEditForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial: {
    name: string
    attending: boolean
    guestCount: number
    guestNames: string[]
    mealChoices: string[]
    dietaryRestrictions: string
    message: string
  }
  onSave: (data: typeof initial) => void
  onCancel: () => void
  isSaving: boolean
}) {
  const [form, setForm] = useState(initial)

  const handleGuestCount = (n: number) => {
    if (n < 0 || n > 4) return
    const names = [...form.guestNames]
    const meals = [...form.mealChoices]
    while (names.length < n) { names.push(""); meals.push("") }
    setForm({ ...form, guestCount: n, guestNames: names.slice(0, n), mealChoices: meals.slice(0, n) })
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Attending</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={form.attending ? "default" : "outline"}
              onClick={() => setForm({ ...form, attending: true })}
            >
              Yes
            </Button>
            <Button
              type="button"
              size="sm"
              variant={!form.attending ? "default" : "outline"}
              onClick={() => setForm({ ...form, attending: false })}
            >
              No
            </Button>
          </div>
        </div>
      </div>

      {form.attending && (
        <>
          <div className="space-y-1">
            <Label>Guest Count</Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="icon" onClick={() => handleGuestCount(form.guestCount - 1)} disabled={form.guestCount <= 1}>
                <X className="h-3 w-3" />
              </Button>
              <span className="text-lg font-medium w-6 text-center">{form.guestCount}</span>
              <Button type="button" variant="outline" size="icon" onClick={() => handleGuestCount(form.guestCount + 1)} disabled={form.guestCount >= 4}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {form.guestNames.map((gn, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  placeholder={`Guest ${i + 1} name`}
                  value={gn}
                  onChange={(e) => {
                    const names = [...form.guestNames]
                    names[i] = e.target.value
                    setForm({ ...form, guestNames: names })
                  }}
                />
                <select
                  value={form.mealChoices[i] || ""}
                  onChange={(e) => {
                    const meals = [...form.mealChoices]
                    meals[i] = e.target.value
                    setForm({ ...form, mealChoices: meals })
                  }}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">Select meal</option>
                  {MEAL_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="space-y-1">
        <Label>Dietary Restrictions</Label>
        <Input value={form.dietaryRestrictions} onChange={(e) => setForm({ ...form, dietaryRestrictions: e.target.value })} />
      </div>

      <div className="space-y-1">
        <Label>Message</Label>
        <Input value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </Card>
  )
}

function RsvpsTab() {
  const rsvps = useQuery(api.rsvps.listRsvps)
  const adminUpdate = useMutation(api.rsvps.adminUpdateRsvp)
  const adminDelete = useMutation(api.rsvps.adminDeleteRsvp)
  const [filter, setFilter] = useState<RsvpFilter>("all")
  const [editingId, setEditingId] = useState<Id<"rsvps"> | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const filtered = rsvps?.filter((r) => {
    if (filter === "attending") return r.attending
    if (filter === "declined") return !r.attending
    return true
  })

  const handleSave = async (rsvpId: Id<"rsvps">, data: any) => {
    setIsSaving(true)
    try {
      await adminUpdate({
        rsvpId,
        name: data.name,
        attending: data.attending,
        guestCount: data.guestCount,
        guestNames: data.guestNames,
        mealChoices: data.mealChoices,
        dietaryRestrictions: data.dietaryRestrictions || undefined,
        message: data.message || undefined,
      })
      setEditingId(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (rsvpId: Id<"rsvps">) => {
    if (!confirm("Delete this RSVP? The invite will be marked as unused so the guest can RSVP again.")) return
    try {
      await adminDelete({ rsvpId })
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex gap-2">
        {(["all", "attending", "declined"] as RsvpFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {rsvps && (
              <span className="ml-1.5 text-xs opacity-70">
                ({f === "all"
                  ? rsvps.length
                  : f === "attending"
                    ? rsvps.filter((r) => r.attending).length
                    : rsvps.filter((r) => !r.attending).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* RSVP list */}
      {filtered?.map((rsvp) =>
        editingId === rsvp._id ? (
          <RsvpEditForm
            key={rsvp._id}
            initial={{
              name: rsvp.name,
              attending: rsvp.attending,
              guestCount: rsvp.guestCount,
              guestNames: rsvp.guestNames,
              mealChoices: rsvp.mealChoices || [],
              dietaryRestrictions: rsvp.dietaryRestrictions || "",
              message: rsvp.message || "",
            }}
            onSave={(data) => handleSave(rsvp._id, data)}
            onCancel={() => setEditingId(null)}
            isSaving={isSaving}
          />
        ) : (
          <Card key={rsvp._id} className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{rsvp.name}</span>
                    {rsvp.attending ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        <Check className="h-3 w-3" /> Attending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        <X className="h-3 w-3" /> Declined
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{rsvp.email}</p>

                  {rsvp.attending && (
                    <div className="mt-2 text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium text-foreground">Guests ({rsvp.guestCount}):</span> {rsvp.guestNames.join(", ") || "—"}</p>
                      <p><span className="font-medium text-foreground">Meals:</span> {rsvp.mealChoices?.join(", ") || "—"}</p>
                      {rsvp.dietaryRestrictions && <p><span className="font-medium text-foreground">Dietary:</span> {rsvp.dietaryRestrictions}</p>}
                    </div>
                  )}
                  {rsvp.message && (
                    <p className="mt-2 text-sm text-muted-foreground"><span className="font-medium text-foreground">Message:</span> {rsvp.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => setEditingId(rsvp._id)} title="Edit RSVP">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(rsvp._id)} title="Delete RSVP">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )
      )}

      {filtered?.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          No responses yet
        </Card>
      )}
    </div>
  )
}
