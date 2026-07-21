"use client";

import { useActionState } from "react";
import {
  updateLeadEngagementStatus,
  type UpdateLeadEngagementState,
} from "./actions";

const initialState: UpdateLeadEngagementState = { error: null };

const STATUS_OPTIONS = [
  { value: "pending_response", label: "Pending response" },
  { value: "quoted", label: "Quoted" },
  { value: "hired", label: "Hired" },
  { value: "not_progressing", label: "Not progressing" },
];

export default function LeadEngagementStatusSelect({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const [state, formAction] = useActionState(
    updateLeadEngagementStatus.bind(null, leadId),
    initialState
  );

  return (
    <form action={formAction}>
      <select
        name="engagement_status"
        defaultValue={currentStatus}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-line bg-white px-2 py-1.5 text-sm text-navy-950 focus:border-navy-700 focus:outline-none"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {state.error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
