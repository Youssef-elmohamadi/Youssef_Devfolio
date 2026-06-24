"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  FaEye,
  FaTrash,
  FaChevronRight,
  FaChevronLeft,
  FaEnvelope,
  FaEnvelopeOpen,
} from "react-icons/fa";
import { Modal } from "@/app/(admin)/components/ui/modal";
import {
  getContactDetailsAction,
  toggleContactReadAction,
  deleteContactAction,
} from "@/actions/contacts";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
};

export default function MessagesClient({
  messages: initialMessages,
  meta,
}: {
  messages: ContactMessage[];
  meta: Meta;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for optimistic UI updates
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // -- Pagination --
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.last_page) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // -- View Message (opens modal, auto-marks as read) --
  const handleView = async (msg: ContactMessage) => {
    setLoadingId(msg.id);
    const result = await getContactDetailsAction(msg.id);
    setLoadingId(null);

    if (result.success && result.data) {
      setSelectedMessage(result.data);
      setIsModalOpen(true);
      // Optimistically update the list item to read
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      );
    }
  };

  // -- Toggle Read/Unread --
  const handleToggleRead = async (msg: ContactMessage) => {
    setLoadingId(msg.id);
    // Optimistic update
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id ? { ...m, is_read: !m.is_read } : m
      )
    );
    const result = await toggleContactReadAction(msg.id);
    setLoadingId(null);

    if (result.success && result.data) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, is_read: result.data!.is_read } : m
        )
      );
    } else {
      // Revert on failure
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, is_read: msg.is_read } : m
        )
      );
    }
  };

  // -- Delete Message --
  const handleDelete = async (msg: ContactMessage) => {
    if (!confirm("Are you sure you want to delete this message permanently?"))
      return;

    setLoadingId(msg.id);
    const result = await deleteContactAction(msg.id);
    setLoadingId(null);

    if (result.success) {
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      startTransition(() => router.refresh());
    }
  };

  // -- Format date --
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // -- Empty State --
  if (!messages || messages.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 text-center dark:border-gray-800 dark:bg-dark/50">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <FaEnvelope className="text-3xl text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          No Messages Yet
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Messages from your contact form will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Messages Table */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-dark/50">
        {/* Top accent bar */}
        <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-primary/80 to-primary" />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-xs uppercase tracking-wider text-gray-500 dark:bg-white/5 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Sender</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Message</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  className={`group transition-colors hover:bg-gray-50/80 dark:hover:bg-white/5 ${
                    !msg.is_read
                      ? "bg-orange-50/40 dark:bg-orange-900/5"
                      : ""
                  }`}
                >
                  {/* Status Badge */}
                  <td className="whitespace-nowrap px-6 py-4">
                    {msg.is_read ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        <FaEnvelopeOpen className="text-[10px]" />
                        Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                        <FaEnvelope className="text-[10px]" />
                        New
                      </span>
                    )}
                  </td>

                  {/* Sender Name */}
                  <td
                    className={`whitespace-nowrap px-6 py-4 ${
                      !msg.is_read
                        ? "font-bold text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {msg.name}
                  </td>

                  {/* Email */}
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-400">
                    {msg.email}
                  </td>

                  {/* Message preview */}
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-[200px]">
                    <span className="block truncate">
                      {msg.message}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                    {formatDate(msg.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {/* View */}
                      <button
                        onClick={() => handleView(msg)}
                        disabled={loadingId === msg.id}
                        title="View Message"
                        className="group/btn flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black disabled:opacity-50"
                      >
                        <FaEye className="text-xs" />
                      </button>

                      {/* Toggle Read */}
                      <button
                        onClick={() => handleToggleRead(msg)}
                        disabled={loadingId === msg.id}
                        title={
                          msg.is_read ? "Mark as Unread" : "Mark as Read"
                        }
                        className="group/btn flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-600 hover:text-white transition-all dark:bg-blue-900/10 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white disabled:opacity-50"
                      >
                        {msg.is_read ? (
                          <FaEnvelope className="text-xs" />
                        ) : (
                          <FaEnvelopeOpen className="text-xs" />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(msg)}
                        disabled={loadingId === msg.id}
                        title="Delete Message"
                        className="group/btn flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white disabled:opacity-50"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-white/5 dark:text-gray-400">
          Showing {messages.length} of {meta.total} messages
        </div>
      </div>

      {/* Pagination */}
      {meta.total > meta.per_page && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {meta.from}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {meta.to}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {meta.total}
            </span>{" "}
            results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-500 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400 transition-colors"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(meta.last_page)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === meta.last_page ||
                  (page >= meta.current_page - 1 &&
                    page <= meta.current_page + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        page === meta.current_page
                          ? "bg-[#ff6a00] text-white shadow-lg shadow-orange-500/20"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400 dark:hover:bg-white/5"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                if (
                  page === meta.current_page - 2 ||
                  page === meta.current_page + 2
                ) {
                  return (
                    <span key={page} className="px-1 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            <button
              onClick={() => handlePageChange(meta.current_page + 1)}
              disabled={meta.current_page === meta.last_page}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-500 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400 transition-colors"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMessage(null);
        }}
        className="max-w-lg mx-4 sm:mx-auto"
      >
        {selectedMessage && (
          <div className="p-6 sm:p-8">
            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Message Details
              </h2>
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-orange-400 rounded-full" />
            </div>

            {/* Sender Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {selectedMessage.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedMessage.name}
                  </p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Received on {formatDate(selectedMessage.created_at)}
              </div>
            </div>

            {/* Message Content */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                Message
              </h3>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Your message on The Forge`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-orange-600 text-white rounded-xl font-medium transition-colors text-sm"
              >
                <FaEnvelope className="text-xs" />
                Reply via Email
              </a>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedMessage(null);
                }}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
