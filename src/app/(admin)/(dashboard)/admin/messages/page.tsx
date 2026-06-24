import { getContacts } from "@/lib/api/admin/contacts";
import MessagesClient from "./MessagesClient";

export const metadata = {
  title: "Admin | Messages",
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function MessagesPage({ searchParams }: Props) {
  const pageParam = (await searchParams)?.page;
  const page = typeof pageParam === "string" ? parseInt(pageParam) : 1;
  const contacts = await getContacts(page);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Messages
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and manage contact messages from your portfolio visitors.
          </p>
        </div>
      </div>
      <MessagesClient messages={contacts.data} meta={contacts.meta} />
    </div>
  );
}
