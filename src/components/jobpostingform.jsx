'use client';

import { useState } from 'react';
import regionsData from '../nz-regions.json';
import { createJob } from '@/app/(site)/post-a-job/actions';
import { TRADE_CATEGORIES } from '@/lib/tradeCategories';
import { TIMEFRAMES } from '@/lib/timeframes';

export default function JobPostingForm() {
  const [form, setForm] = useState({
    title: '',
    category: '',
    region: '',
    town: '',
    description: '',
    budget: '',
    timeframe: '',
    name: '',
    email: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Towns for the currently selected region
  const selectedRegion = regionsData.regions.find((r) => r.name === form.region);
  const towns = selectedRegion ? selectedRegion.towns : [];

  function updateField(field, value) {
    setForm((prev) => {
      // If the region changes, clear the town so they can't mismatch
      if (field === 'region') return { ...prev, region: value, town: '' };
      return { ...prev, [field]: value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await createJob(form);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  const inputClass =
    'w-full rounded-lg border border-[#0B1F3A]/15 bg-white px-4 py-3 text-[#0B1F3A] outline-none transition focus:border-[#FF6A00] focus:ring-2 focus:ring-[#FF6A00]/20';
  const labelClass = 'mb-1.5 block text-sm font-semibold text-[#0B1F3A]';

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#3F7A4F]/30 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#3F7A4F]/15 text-2xl">
          ✅
        </div>
        <h2 className="mb-2 text-2xl font-bold text-[#0B1F3A]">Job posted!</h2>
        <p className="text-[#0B1F3A]/70">
          Your job &ldquo;{form.title}&rdquo; has been posted for tradies in {form.town}, {form.region}. Verified tradies in your area will be in touch directly.
        </p>
        <button
          onClick={() => {
            setForm({ title: '', category: '', region: '', town: '', description: '', budget: '', timeframe: '', name: '', email: '', phone: '' });
            setSubmitted(false);
            setTermsAccepted(false);
          }}
          className="mt-6 rounded-lg bg-[#FF6A00] px-6 py-3 font-semibold text-white transition hover:bg-[#e85f00]"
        >
          Post another job
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-2xl border border-[#0B1F3A]/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0B1F3A]">Post a job</h2>
        <p className="mt-1 text-[#0B1F3A]/60">Tell us what you need done and get connected with verified Kiwi tradies.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className={labelClass}>What do you need done?</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. Repaint two-bedroom house exterior"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Trade category</label>
          <select required value={form.category} onChange={(e) => updateField('category', e.target.value)} className={inputClass}>
            <option value="">Select a category…</option>
            {TRADE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Region</label>
            <select required value={form.region} onChange={(e) => updateField('region', e.target.value)} className={inputClass}>
              <option value="">Select region…</option>
              {regionsData.regions.map((r) => (
                <option key={r.slug} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Town / city</label>
            <select
              required
              disabled={!form.region}
              value={form.town}
              onChange={(e) => updateField('town', e.target.value)}
              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-[#0B1F3A]/5`}
            >
              <option value="">{form.region ? 'Select town…' : 'Pick a region first'}</option>
              {towns.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Describe the job</label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Size of the job, materials, access, timing — anything that helps tradies understand the work."
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Budget (optional)</label>
            <input
              type="text"
              value={form.budget}
              onChange={(e) => updateField('budget', e.target.value)}
              placeholder="e.g. $2,000–$3,000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Timeframe</label>
            <select required value={form.timeframe} onChange={(e) => updateField('timeframe', e.target.value)} className={inputClass}>
              <option value="">Select timeframe…</option>
              {TIMEFRAMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl bg-[#0B1F3A]/[0.03] p-4">
          <p className="mb-4 text-sm font-semibold text-[#0B1F3A]">Your contact details</p>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@example.co.nz"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="021 123 4567"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm text-[#0B1F3A]/80">
          <input
            type="checkbox"
            required
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#FF6A00]"
          />
          I understand my job will be shared with verified tradies in my
          region. I&apos;ll review their quotes and choose which tradies to
          contact.
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting || !termsAccepted}
          className="w-full rounded-lg bg-[#FF6A00] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#e85f00] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Posting…' : 'Post job'}
        </button>
        <p className="text-center text-xs text-[#0B1F3A]/50">It&apos;s free to post. Verified tradies will contact you directly.</p>
      </div>
    </form>
  );
}