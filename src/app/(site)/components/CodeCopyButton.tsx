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
      className="absolute top-9 right-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-2 bg-gray-200/50 dark:bg-gray-800/50 rounded-md transition-colors"
      title="Copy Code"
    >
      {isCopied ? (
        <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-500" />
      ) : (
        <ClipboardIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default CodeCopyButton;
