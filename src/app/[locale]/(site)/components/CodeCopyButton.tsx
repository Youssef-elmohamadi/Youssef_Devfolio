import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useCopyToClipboard } from "react-use";

const CodeCopyButton = ({ code }: { code: string }) => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2.5 sm:top-3 right-2 sm:right-3 z-10 text-gray-400 hover:text-gray-900 dark:hover:text-white p-1.5 sm:p-2 bg-gray-200/60 dark:bg-gray-800/60 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg backdrop-blur-xs transition-colors shadow-xs"
      title="Copy Code"
    >
      {isCopied ? (
        <CheckIcon className="h-4 w-4 text-emerald-500" />
      ) : (
        <ClipboardIcon className="h-4 w-4" />
      )}
    </button>
  );
};

export default CodeCopyButton;
