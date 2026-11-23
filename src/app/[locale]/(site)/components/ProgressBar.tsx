import { motion } from "framer-motion";
const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-orange-500 to-primary shadow-md"
        style={{ width: `${progress}%` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </div>
  );
};
export default ProgressBar;
