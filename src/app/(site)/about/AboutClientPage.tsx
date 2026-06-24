"use client";

import React from "react";
import Image from "next/image";
import { FaGraduationCap, FaBriefcase, FaUniversity, FaVolumeUp, FaCat } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeInDown,
  fadeIn,
  staggerContainer,
  cardHover,
  cardHoverSmall,
} from "@/utils/animations";
import LocationMap from "../components/LocationMap";

// --- Subcomponents ---
function CairoTime() {
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString("en-US", { timeZone: "Africa/Cairo", hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <span className="text-gray-900 dark:text-white font-bold text-xl opacity-0">00:00 AM</span>;

  return <span className="text-gray-900 dark:text-white font-bold text-xl">{time}</span>;
}

// --- Interfaces ---
interface Skill {
  id: number;
  title: string;
  icon: string;
  skills: string[];
}

interface Experience {
  id: number;
  job_title: string;
  company: string;
  location: string;
  duration: string;
  tasks: string[];
}

interface Education {
  id: number;
  degree: string;
  university: string;
  location: string;
  duration: string;
  grade: string;
  description: string;
}

interface AboutData {
  about: {
    title: string;
    description: string;
    image_url?: string;
  };
  skills: Skill[];
  experience: Experience[];
  education: Education[];
}

interface AboutClientProps {
  data: AboutData;
}

export default function AboutClient({ data }: AboutClientProps) {
  const { about, skills, experience, education } = data;

  return (
    <div className="container max-w-7xl md:pt-24  mx-auto py-12 px-4 sm:px-6">
      {/* --- Header --- */}
      <motion.h1
        className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white"
        {...fadeInDown}
      >
        About Me
      </motion.h1>

      {/* --- Intro & Map Grid --- */}
      <motion.section
        className="mb-24 grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-8 items-start"
        {...fadeInUp}
      >
        {/* Left: Bio & Image */}
        <div className="flex flex-col space-y-6 xl:text-left">
          {about.image_url && (
            <div className="relative shrink-0">
              <Image
                src={about.image_url}
                alt={about.title || "Profile"}
                width={160}
                height={160}
                className="rounded-full w-36 h-36 md:w-40 md:h-40 object-cover ring-4 ring-primary/20"
                priority
              />
            </div>
          )}

          {about.title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {about.title}
            </h2>
          )}

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto xl:mx-0">
            {about.description}
          </p>

          {/* Fun Facts Section */}
          <div className="flex flex-col gap-4 mt-6 w-full mx-auto xl:mx-0">
            {/* Card 1: Pronunciation */}
            <div className="bg-white dark:bg-dark/50 p-4 sm:p-5 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-serif tracking-wide text-gray-900 dark:text-white">
                  juːsɛf
                </span>
                <button
                  onClick={() => {
                    const u = new SpeechSynthesisUtterance("Youssef");
                    u.lang = "en-US";
                    window.speechSynthesis.speak(u);
                  }}
                  className="text-primary hover:scale-110 transition-transform focus:outline-none"
                  aria-label="Pronounce Youssef"
                >
                  <FaVolumeUp className="text-xl sm:text-2xl" />
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  My name, Youssef, is pronounced <span className="italic text-primary font-bold">"Yoo-sef"</span>.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                  Click to hear a robot say it.
                </p>
              </div>
            </div>

            {/* Card 2: Height */}
            <div className="bg-white dark:bg-dark/50 p-4 sm:p-5 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
              <div className="shrink-0 w-10 sm:w-12">
                <svg
                  viewBox="0 0 100 200"
                  className="w-full h-auto stroke-gray-900 dark:stroke-white fill-none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="50" cy="30" r="20" />
                  <line x1="50" y1="50" x2="50" y2="130" />
                  <line x1="50" y1="70" x2="20" y2="110" />
                  <line x1="50" y1="70" x2="80" y2="110" />
                  <line x1="50" y1="130" x2="25" y2="190" />
                  <line x1="50" y1="130" x2="75" y2="190" />
                </svg>
              </div>
              <div className="text-left space-y-1">
                <p className="text-gray-900 dark:text-white text-base sm:text-lg font-bold">
                  I'm 182cm tall.
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-relaxed">
                  For some reason, this surprises a lot of people. 😅
                </p>
              </div>
            </div>

            {/* Card 3: Cat */}
            <div className="bg-white dark:bg-dark/50 p-4 sm:p-5 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex items-center relative pl-16 sm:pl-20 overflow-visible">
              <div
                className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 cursor-pointer hover:rotate-6 hover:scale-105 transition-transform z-10"
                onClick={() => {
                  const u = new SpeechSynthesisUtterance("Meow! Meow!");
                  u.pitch = 2; // High pitch for a cat
                  u.rate = 1.2;
                  window.speechSynthesis.speak(u);
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <g transform="rotate(10 50 50)">
                    <path d="M 65,95 Q 85,95 85,80 Q 70,80 65,85" fill="#fff" stroke="#1f2937" strokeWidth="3" />
                    <path d="M 12,38 L 8,10 L 38,18 Z" fill="#fff" stroke="#1f2937" strokeWidth="3" strokeLinejoin="round" />
                    <path d="M 15,33 L 13,16 L 31,21 Z" fill="#ffd1dc" />
                    <path d="M 62,18 L 92,10 L 88,38 Z" fill="#fff" stroke="#1f2937" strokeWidth="3" strokeLinejoin="round" />
                    <path d="M 65,22 L 85,16 L 82,34 Z" fill="#ffd1dc" />
                    <ellipse cx="50" cy="55" rx="42" ry="34" fill="#fff" stroke="#1f2937" strokeWidth="3" />
                    <circle cx="68" cy="45" r="5" fill="#1f2937" />
                    <circle cx="69" cy="43" r="1.5" fill="#fff" />
                    <path d="M 28,34 L 33,43 L 43,44 L 35,51 L 38,61 L 28,55 L 18,61 L 21,51 L 13,44 L 23,43 Z" fill="#facc15" stroke="#1f2937" strokeWidth="2" strokeLinejoin="round" />
                    <circle cx="28" cy="48" r="3.5" fill="#1f2937" />
                    <circle cx="29" cy="46" r="1.5" fill="#fff" />
                    <path d="M 45,60 Q 50,65 50,60 Q 50,65 55,60" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
              <div className="text-left space-y-1 relative z-0">
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-relaxed">
                  In a cruel twist of fate, I'm a cat person who is allergic to cats.
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-relaxed">
                  I make up for this by owning lots of shirts with cats on them.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Map & Status */}
        <div className="w-full xl:pl-8 flex flex-col gap-6">
          <LocationMap />

          {/* Status Card */}
          <div className="bg-white dark:bg-dark/50 p-6 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-4 w-4 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-bold">Available for work</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Let's build something amazing.</p>
              </div>
            </div>

            <div className="text-right hidden sm:block pl-4 border-l border-gray-100 dark:border-gray-800">
              <p className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Cairo Time</p>
              <CairoTime />
            </div>
          </div>

          {/* Faith Card */}
          <div className="bg-white dark:bg-dark/50 p-6 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="shrink-0">
              <Image
                src="/muslim_cat.png"
                alt="Muslim Cat Mascot"
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
              />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-bold text-lg">Proud Muslim</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mt-1">
                Guided by faith and striving for excellence (Ihsan) in everything I build.
              </p>
            </div>
          </div>
        </div>
      </motion.section>



      {/* --- Skills Section --- */}
      <motion.section className="mb-20" {...fadeIn} transition={{ delay: 0.2 }}>
        <motion.h2
          className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100"
          {...fadeInUp}
        >
          Skills & Technologies
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {skills.map((skillGroup) => (
            <motion.div
              key={skillGroup.id}
              className="bg-white dark:bg-dark/50 p-6 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
              variants={fadeInUp}
              {...cardHover}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="h-10 w-10 text-primary fill-current"
                  dangerouslySetInnerHTML={{ __html: skillGroup.icon }}
                />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {skillGroup.title}
                </h3>
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-800 mb-4"></div>

              <ul className="space-y-2">
                {skillGroup.skills.map((skill, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* --- Experience Section --- */}
      <motion.section className="mb-20" {...fadeIn} transition={{ delay: 0.4 }}>
        <motion.h2
          className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100"
          {...fadeInUp}
        >
          Professional Experience
        </motion.h2>

        <motion.div
          className="max-w-4xl mx-auto space-y-8 relative"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Vertical Line for Timeline Effect (Optional) */}
          <div className="absolute left-0 md:left-8 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-800 hidden md:block"></div>

          {experience.map((exp) => (
            <motion.div
              key={exp.id}
              className="bg-white dark:bg-dark/50 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 relative md:ml-16"
              variants={fadeInUp}
              {...cardHoverSmall}
            >
              {/* Timeline Dot */}
              <div className="absolute top-10 -left-[41px] w-5 h-5 rounded-full border-4 border-white dark:border-[#111] bg-primary hidden md:block shadow-sm"></div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FaBriefcase className="text-primary text-lg" />
                    {exp.job_title}
                  </h3>
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mt-1">
                    {exp.company}
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1">
                  <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                    {exp.duration}
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    {exp.location}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 mt-4">
                {exp.tasks.map((task, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-600 dark:text-gray-300 leading-relaxed text-base"
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0"></span>
                    {task}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* --- Education Section --- */}
      <motion.section {...fadeIn} transition={{ delay: 0.6 }}>
        <motion.h2
          className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100"
          {...fadeInUp}
        >
          Education
        </motion.h2>

        <motion.div
          className="max-w-4xl mx-auto space-y-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {education.map((edu) => (
            <motion.div
              key={edu.id}
              className="bg-white dark:bg-dark/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-6 items-start"
              variants={fadeInUp}
              {...cardHoverSmall}
            >
              <div className="bg-primary/10 p-4 rounded-xl text-primary shrink-0">
                <FaGraduationCap className="h-8 w-8" />
              </div>

              <div className="flex-grow w-full">
                <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {edu.degree}
                  </h3>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg mt-1 md:mt-0 whitespace-nowrap">
                    {edu.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300 font-medium">
                  <FaUniversity className="text-gray-400" />
                  <span>
                    {edu.university}, {edu.location}
                  </span>
                </div>

                {edu.grade && (
                  <div className="inline-block px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-sm font-bold mb-3">
                    Grade: {edu.grade}
                  </div>
                )}

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {edu.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
