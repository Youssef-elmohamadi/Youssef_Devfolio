"use client";

import { FaCode, FaLaptopCode, FaGraduationCap } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeInDown,
  fadeIn,
  staggerContainer,
  cardHover,
  cardHoverSmall,
} from "@/utils/animations";
import { NextSeo } from "next-seo";

export default function About() {
  return (
    <>

      <div className="container max-w-7xl mx-auto py-12">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center"
          {...fadeInDown}
        >
          About Me
        </motion.h1>
        {/* Bio Section */}
        <motion.section className="mb-16" {...fadeInUp}>
          <p className="text-lg text-secondary max-w-3xl mx-auto text-center">
            Seeking a challenging career in{" "}
            <span className="font-semibold">Software Engineering</span>, working
            with a creative team to gain more experience, solving problems to
            make people’s lives easier, and adding value to organizations
            through smart working and continuous learning of new technologies.
          </p>
        </motion.section>
        {/* Skills Section */}
        <motion.section
          className="mb-16"
          {...fadeIn}
          transition={{ delay: 0.2 }}
        >
          <motion.h2 className="section-title" {...fadeInUp}>
            Skills
          </motion.h2>
          <motion.div
            className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Frontend Skills */}
            <motion.div
              className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
              variants={fadeInUp}
              {...cardHover}
            >
              <FaCode className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Frontend Skills</h3>
              <ul className="text-secondary space-y-2">
                <li>HTML / CSS / SASS</li>
                <li>JavaScript / TypeScript</li>
                <li>Bootstrap / Tailwind CSS</li>
                <li>React.js / Next.js</li>
                <li>React Router DOM / Axios</li>
                <li>Tanstack Query (React Query)</li>
                <li>React Table</li>
                <li>Framer Motion</li>
                <li>Firebase (Basic)</li>
              </ul>
            </motion.div>

            {/* Programming Languages & Professional */}
            <motion.div
              className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
              variants={fadeInUp}
              {...cardHover}
            >
              <FaLaptopCode className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Programming & Professional
              </h3>
              <ul className="text-secondary space-y-2">
                <li>C++ / C#</li>
                <li>Data Structures</li>
                <li>OOP (Object-Oriented Programming)</li>
                <li>API Integration</li>
                <li>SOLID Principles</li>
              </ul>
            </motion.div>

            {/* Tools & Others */}
            <motion.div
              className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
              variants={fadeInUp}
              {...cardHover}
            >
              <FaGraduationCap className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tools & Others</h3>
              <ul className="text-secondary space-y-2">
                <li>Git / GitHub</li>
                <li>Problem Solving (CodeWars, CodeForces)</li>
                <li>Operating Systems: Windows (7, 8, 10), Linux (Ubuntu)</li>
              </ul>
            </motion.div>
          </motion.div>
        </motion.section>
        {/* Experience Section */}
        <motion.section
          className="mb-16"
          {...fadeIn}
          transition={{ delay: 0.4 }}
        >
          <motion.h2 className="section-title" {...fadeInUp}>
            Experience
          </motion.h2>
          <motion.div
            className="max-w-3xl mx-auto space-y-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
              variants={fadeInUp}
              {...cardHoverSmall}
            >
              <h3 className="text-xl font-semibold mb-2">
                Freelance Frontend Developer
              </h3>
              <p className="text-primary mb-2">Remote • Apr 2025 – Jun 2025</p>
              <ul className="text-secondary list-disc list-inside space-y-2">
                <li>
                  Built the entire frontend of a multi-role e-commerce platform
                  (Tashtiba) using React.js, TypeScript, and Tailwind CSS.
                </li>
                <li>
                  Implemented role-based dashboards for users, vendor admins,
                  and super admins.
                </li>
                <li>
                  Added multi-language support (Arabic/English) with i18next and
                  protected routing with React Router.
                </li>
                <li>
                  Developed reusable components (tables, modals, dropdowns, form
                  validation).
                </li>
                <li>
                  Collaborated with backend developer via REST APIs, integrating
                  React Query for data fetching, state management, and caching.
                </li>
              </ul>
            </motion.div>

            {/* <motion.div
            className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
            variants={fadeInUp}
            {...cardHoverSmall}
          >
            <h3 className="text-xl font-semibold mb-2">Full Stack Developer</h3>
            <p className="text-primary mb-2">Previous Company • 2018 - 2020</p>
            <ul className="text-secondary list-disc list-inside space-y-2">
              <li>Developed and maintained RESTful APIs</li>
              <li>
                Built responsive user interfaces with modern JavaScript
                frameworks
              </li>
              <li>Optimized database queries improving performance by 40%</li>
            </ul>
          </motion.div> */}
          </motion.div>
        </motion.section>
        {/* Education Section */}
        <motion.section {...fadeIn} transition={{ delay: 0.6 }}>
          <motion.h2 className="section-title" {...fadeInUp}>
            Education
          </motion.h2>
          <motion.div
            className="max-w-3xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
              variants={fadeInUp}
              {...cardHoverSmall}
            >
              <h3 className="text-xl font-semibold mb-2">
                Bachelor of Science in Computer Science
              </h3>
              <p className="text-primary mb-2">
                Thebes Academy, Cairo, Egypt • 2022 - 2026 Accumulative grade:
                Very Good.
              </p>
              <p className="text-secondary">
                Graduated with honors. Focused on software engineering and web
                development.
              </p>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </>
  );
}
