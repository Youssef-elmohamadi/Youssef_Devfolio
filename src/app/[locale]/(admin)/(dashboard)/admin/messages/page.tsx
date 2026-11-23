import { getContacts } from "@/lib/api/admin/contacts";
import MessagesClient from "./MessagesClient";

export const metadata = {
  title: "Admin | Messages",
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function MessagesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const pageParam = (await searchParams)?.page;
  const page = typeof pageParam === "string" ? parseInt(pageParam) : 1;
  const contacts = await getContacts(page);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAr ? "صندوق الرسائل" : "Messages"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isAr
              ? "عرض وإدارة رسائل التواصل الواردة من زوار معرض أعمالك."
              : "View and manage contact messages from your portfolio visitors."}
          </p>
        </div>
      </div>
      <MessagesClient messages={contacts.data} meta={contacts.meta} />
    </div>
  );
}
