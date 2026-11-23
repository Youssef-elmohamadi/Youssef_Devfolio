import { FacebookIcon, LinkedInIcon, WhatsAppIcon } from "@/app/icons";
import { ShareIcon } from "@heroicons/react/24/outline";
import { Link } from '@/i18n/routing';

const SocialShareButtons = ({
  title,
  description,
  url,
  isRtl,
}: {
  title: string;
  description: string;
  url: string;
  isRtl: boolean;
}) => {
  const message = isRtl
    ? `السلام عليكم، قرأت للتو هذا المقال المميز وأحببت مشاركته معكم: \n\n📌 *${title}*\n\n💡 *نبذة عن المقال:*\n${description}\n\nالمقال مفيد جداً وشرحه مبسط، أنصحكم بشدة بقراءته من هنا\n`
    : `Just read this amazing article and thought I'd share it with you: \n\n📌 *${title}*\n\n💡 *Summary:*\n${description}\n\nHighly recommended! Check it out here\n`;

  const textEncoded = encodeURIComponent(message);
  const urlEncoded = encodeURIComponent(url);

  const links = [
    {
      name: "LinkedIn",
      icon: <LinkedInIcon />,
      color: "bg-[#0077b5] hover:bg-[#005582]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${urlEncoded}`,
    },
    {
      name: "Facebook",
      icon: <FacebookIcon />,
      color: "bg-[#1877f2] hover:bg-[#0d5ec4]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${urlEncoded}`,
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      color: "bg-[#25d366] hover:bg-[#1da851]",
      // WhatsApp supports the full text + URL
      href: `https://wa.me/?text=${textEncoded}${urlEncoded}`,
    },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-3 my-6`}>
      <span className="text-gray-600 dark:text-gray-400 text-sm font-medium flex items-center gap-2">
        <ShareIcon className="h-4 w-4" />
        {isRtl ? "شارك المقال:" : "Share Article:"}
      </span>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          rel="noopener noreferrer"
          className={`${link.color} text-white p-2 rounded-full transition-transform transform hover:-translate-y-1 shadow-md flex items-center justify-center`}
          title={`Share on ${link.name}`}
        >
          {link.icon}
        </Link>
      ))}
    </div>
  );
};

export default SocialShareButtons;