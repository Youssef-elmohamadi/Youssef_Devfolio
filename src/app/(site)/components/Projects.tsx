'use client'

import { FaCode, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import Image from 'next/image'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/utils/animations'

type Project = {
  id: number;
  title: string;
  description: string;
  github_link: string;
  demo_link: string;
  tags: string[];
  image_url: string;
};

export default function Projects({ projects = [] }: { projects?: Project[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="container max-w-7xl mx-auto px-4 z-10 relative">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white"
            {...fadeInUp}
          >
            Featured Projects
          </motion.h2>
          <motion.p
            className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            A curated selection of digital experiences, applications, and developer tools I've built.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {projects.map((project) => (
            <motion.article
              key={project.id || project.title}
              className="group bg-white dark:bg-dark/50 rounded-lg shadow-md p-6"
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="relative aspect-video mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <FaCode className="text-4xl opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-250">
                {project.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm leading-relaxed flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {(project.tags || []).slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 bg-primary/5 dark:bg-primary/10 text-primary border border-primary/10 dark:border-primary/20 rounded-md text-[11px] font-mono font-medium tracking-widest uppercase transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 border-t border-gray-100 dark:border-gray-800/60 pt-4 mt-auto">
                {project.github_link && (
                  <a
                    href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <FaGithub className="h-4 w-4" />
                  <span>Code</span>
                  </a>
                )}
                {project.demo_link && (
                  <a
                    href={project.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    <FaExternalLinkAlt className="h-3.5 w-3.5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 