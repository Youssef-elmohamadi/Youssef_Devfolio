"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  PhotoIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  UserIcon,
  MapPinIcon,
  GlobeAltIcon,
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
  FaTiktok,
  FaSnapchat,
  FaBehance,
  FaDribbble,
  FaMedium,
  FaPinterest,
  FaDiscord,
  FaStackOverflow,
  FaLink,
} from "react-icons/fa";
import { saveProfileData } from "@/actions/profile";
import { createSocialLink, updateSocialLink, deleteSocialLink } from "@/actions/socialLinks";
import type { Profile } from "@/lib/api/home";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  facebook: FaFacebook,
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,
  tiktok: FaTiktok,
  snapchat: FaSnapchat,
  behance: FaBehance,
  dribbble: FaDribbble,
  medium: FaMedium,
  pinterest: FaPinterest,
  discord: FaDiscord,
  stackoverflow: FaStackOverflow,
};

function getPlatformIcon(platform: string): React.ElementType {
  return PLATFORM_ICONS[platform?.toLowerCase()] ?? FaLink;
}

interface SettingsFormProps {
  initialData: Profile | null;
  socialLinks: any[];
  supportedPlatforms: string[];
}

const SettingsForm = ({ initialData, socialLinks: initialSocialLinks, supportedPlatforms }: SettingsFormProps) => {
  const [activeTab, setActiveTab] = useState<"profile" | "social">("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Profile Form State
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null,
  );
  const [formState, setFormState] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });

  // Social Links State
  const [socialLinks, setSocialLinks] = useState(initialSocialLinks || []);
  const [newLink, setNewLink] = useState({ platform: supportedPlatforms[0] || "", url: "" });
  const [editingLink, setEditingLink] = useState<{ id: number; platform: string; url: string } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const showStatus = (type: "success" | "error", message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formRef.current) return;

    try {
      const formData = new FormData(formRef.current);
      
      const imageFile = formData.get("image") as File;
      if (imageFile) {
        if (imageFile.size === 0) {
          formData.delete("image");
        } else if (imageFile.size > 2 * 1024 * 1024) {
          showStatus("error", "Profile photo size must be less than 2MB.");
          setIsLoading(false);
          return;
        }
      }

      const result = await saveProfileData(formData, initialData?.id);

      if (result.success) {
        showStatus("success", "Profile settings updated successfully!");
      } else {
        let errMsg = result.message;
        if (errMsg === "validation.max.file") {
          errMsg = "The image exceeds the allowed size limit of 2MB.";
        } else if (errMsg === "validation.mimes") {
          errMsg = "Invalid image type. Please upload a valid image (jpg, jpeg, png, webp).";
        }
        showStatus("error", errMsg);
      }
    } catch (error) {
      showStatus("error", "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.url.trim()) return;
    setIsLoading(true);

    try {
      const result = await createSocialLink(newLink.platform, newLink.url);
      if (result.success) {
        // Optimistically update list or fetch latest (the action response contains the new link)
        const added = result.data.data;
        setSocialLinks([...socialLinks, added]);
        setNewLink({ platform: supportedPlatforms[0] || "", url: "" });
        showStatus("success", "Social link added successfully!");
      } else {
        showStatus("error", result.message);
      }
    } catch (error) {
      showStatus("error", "Failed to add social link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSocialLink = async (id: number) => {
    if (!editingLink || !editingLink.url.trim()) return;
    setIsLoading(true);

    try {
      const result = await updateSocialLink(id, editingLink.platform, editingLink.url);
      if (result.success) {
        setSocialLinks(socialLinks.map(link => link.id === id ? result.data.data : link));
        setEditingLink(null);
        showStatus("success", "Social link updated successfully!");
      } else {
        showStatus("error", result.message);
      }
    } catch (error) {
      showStatus("error", "Failed to update social link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSocialLink = async (id: number) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;
    setIsLoading(true);

    try {
      const result = await deleteSocialLink(id);
      if (result.success) {
        setSocialLinks(socialLinks.filter(link => link.id !== id));
        showStatus("success", "Social link deleted successfully!");
      } else {
        showStatus("error", result.message);
      }
    } catch (error) {
      showStatus("error", "Failed to delete social link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {status && (
        <div
          className={`fixed top-4 right-4 z-[100000] px-6 py-4 rounded-lg flex items-center gap-3 transition-all duration-300 shadow-xl ${
            status.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircleIcon className="w-6 h-6" />
          ) : (
            <XCircleIcon className="w-6 h-6" />
          )}
          <span className="font-semibold">{status.message}</span>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 space-x-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "profile"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <UserIcon className="w-4 h-4" />
          Profile Details
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "social"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <GlobeAltIcon className="w-4 h-4" />
          Social Links
        </button>
      </div>

      {activeTab === "profile" ? (
        <form
          ref={formRef}
          onSubmit={handleProfileSubmit}
          className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          {/* Left Side: Editor */}
          <div className="space-y-6">
            {/* Text Fields */}
            <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                Edit Profile Details
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Youssef Elmohamadi"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                    Bio / Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={6}
                    value={formState.description}
                    onChange={handleInputChange}
                    placeholder="Describe yourself..."
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Media Uploads */}
            <div className="bg-white dark:bg-[#111] p-6 pb-8 rounded-xl border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                Profile Image
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                    Photo (jpg, jpeg, png, webp)
                  </label>
                  <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ArrowUpTrayIcon className="w-8 h-8 text-white" />
                    </div>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <p>• Max size: 2MB</p>
                  <p>• Format: JPG, JPEG, PNG, WEBP</p>
                  <p>• Changing image will replace the previous profile picture.</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Right Side: Live Preview */}
          <div className="space-y-6">
            <div className="sticky top-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <EyeIcon className="w-4 h-4" /> Live Preview
              </h3>

              <div className="bg-white dark:bg-[#111] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="h-28 bg-primary"></div>

                <div className="px-8 pb-8 relative">
                  <div className="relative -mt-14 mb-5">
                    <div className="w-28 h-28 rounded-2xl border-4 border-white dark:border-[#111] overflow-hidden bg-gray-100">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Profile"
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                    {formState.name || "Your Name"}
                  </h1>

                  <div className="flex items-center gap-2 text-primary font-medium mb-6 text-sm">
                    <MapPinIcon className="w-4 h-4" />
                    <span>Based in Cairo, Egypt</span>
                  </div>

                  <div className="prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-6">
                    {formState.description ||
                      "Your description/bio will appear here..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Add Link Form */}
          <div className="xl:col-span-1 bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              Add Social Link
            </h2>

            <form onSubmit={handleAddSocialLink} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  Platform
                </label>
                <select
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-3 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  {supportedPlatforms.map((plat) => (
                    <option key={plat} value={plat}>
                      {plat.charAt(0).toUpperCase() + plat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  Account URL
                </label>
                <input
                  type="url"
                  required
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Add Link
              </button>
            </form>
          </div>

          {/* Social Links List */}
          <div className="xl:col-span-2 bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              Current Social Links
            </h2>

            <div className="space-y-4">
              {socialLinks.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No social links added yet. Add one to display it on your portfolio landing.
                </div>
              ) : (
                socialLinks.map((link) => {
                  const Icon = getPlatformIcon(link.platform);
                  const isEditing = editingLink?.id === link.id;

                  return (
                    <div
                      key={link.id}
                      className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-primary/30"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-primary text-xl">
                          <Icon />
                        </div>

                        {editingLink && editingLink.id === link.id ? (
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <select
                              value={editingLink.platform}
                              onChange={(e) => setEditingLink({ id: editingLink.id, url: editingLink.url, platform: e.target.value })}
                              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm outline-none text-gray-900 dark:text-white"
                            >
                              {supportedPlatforms.map((plat) => (
                                <option key={plat} value={plat}>
                                  {plat.charAt(0).toUpperCase() + plat.slice(1)}
                                </option>
                              ))}
                            </select>
                            <input
                              type="url"
                              value={editingLink.url}
                              onChange={(e) => setEditingLink({ id: editingLink.id, platform: editingLink.platform, url: e.target.value })}
                              className="sm:col-span-2 bg-white dark:bg-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-sm outline-none text-gray-900 dark:text-white"
                            />
                          </div>
                        ) : (
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {link.platform_name || link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                            </h4>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary truncate block"
                            >
                              {link.url}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleUpdateSocialLink(link.id)}
                              className="p-2 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 transition-colors"
                              title="Save Changes"
                            >
                              <CheckIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setEditingLink(null)}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                              title="Cancel"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingLink({ id: link.id, platform: link.platform, url: link.url })}
                              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors"
                              title="Edit"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSocialLink(link.id)}
                              className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsForm;
