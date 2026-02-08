"use client";

import React from "react";
import { FaGraduationCap, FaBriefcase, FaUniversity } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeInDown,
  fadeIn,
  staggerContainer,
  cardHover,
  cardHoverSmall,
} from "@/utils/animations";

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
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6">
      {/* --- Header --- */}
      <motion.h1
        className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white"
        {...fadeInDown}
      >
        About Me
      </motion.h1>

      {/* --- Bio Section --- */}
      <motion.section className="mb-20" {...fadeInUp}>
        <div className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center leading-relaxed">
          <p>{about.description}</p>
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
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
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
              className="bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative md:ml-16"
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
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-6 items-start"
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
