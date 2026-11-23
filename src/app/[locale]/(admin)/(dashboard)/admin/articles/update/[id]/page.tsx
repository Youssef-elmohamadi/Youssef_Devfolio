// app/admin/articles/[id]/edit/page.tsx
import { apiFetch } from "@/lib/api/config";
import { notFound } from "next/navigation";
import EditArticleForm from "./EditFormClient";
import { getArticleForEdit } from "@/lib/api/articles";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

// دالة لجلب مقال واحد للتعديل

export default async function EditPage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleForEdit(id);

  if (!article) {
    notFound();
  }

  return <EditArticleForm article={article} />;
}
