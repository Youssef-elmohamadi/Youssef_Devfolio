// app/admin/articles/[id]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api/config";
import ArticleDetailsClient from "./ArticleDetailsClient";
import { getArticleForEdit } from "@/lib/api/articles";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};



export default async function ShowArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleForEdit(id);

  if (!article) {
    notFound();
  }

  return <ArticleDetailsClient article={article} />;
}