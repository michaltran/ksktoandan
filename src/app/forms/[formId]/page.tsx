import { notFound } from "next/navigation";
import { getForm, FORM_OPTIONS } from "@/lib/forms/definitions";
import FormRenderer from "@/components/FormRenderer";

export default function NewFormPage({ params }: { params: { formId: string } }) {
  const form = getForm(params.formId);
  if (!form) notFound();
  return <FormRenderer form={form} formList={FORM_OPTIONS} />;
}
