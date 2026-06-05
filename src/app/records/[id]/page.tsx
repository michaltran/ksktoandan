import { notFound } from "next/navigation";
import { getRecord } from "@/lib/db";
import { getForm } from "@/lib/forms/definitions";
import FormRenderer from "@/components/FormRenderer";
import type { RecordValues } from "@/lib/forms/schema";

export const dynamic = "force-dynamic";

export default async function EditRecordPage({ params }: { params: { id: string } }) {
  const rec = await getRecord(Number(params.id));
  if (!rec) notFound();
  const form = getForm(rec.form_id);
  if (!form) notFound();

  return <FormRenderer form={form} initialValues={rec.values as RecordValues} recordId={rec.id} />;
}
