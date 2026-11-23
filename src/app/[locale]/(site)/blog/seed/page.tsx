import SingleBlogClient from "../[slug]/SingleBlogClient";

export default function SeedArticlePage() {
  const mockBlogPost = {
    id: "seed-article",
    title: "The Ultimate Markdown & Components Test Article",
    excerpt: "This is a seed article to test all available components including headings, text, code, images, video, diagram, and tables.",
    lang: "en",
    feature_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    date: {
      diff: "Just now",
      raw: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    stats: {
      views: 1337,
      likes: 42,
      liked: false,
    },
    content: [
      {
        id: 1,
        type: "heading",
        title: "Welcome to the Seeder Article",
      },
      {
        id: 2,
        type: "text",
        title: null,
        text: "This article contains every single block type available in our system. The goal is to verify that the UI renders everything properly, including spacing, typography, and interactive components. Below, you will see examples of code blocks, image galleries, videos, diagrams, and tables.",
      },
      {
        id: 3,
        type: "heading",
        title: "Code Block Example",
      },
      {
        id: 4,
        type: "code",
        title: null,
        code: "function greetWorld() {\n  console.log('Hello, world!');\n  return true;\n}\n\ngreetWorld();",
      },
      {
        id: 5,
        type: "heading",
        title: "Image Galleries (Layout 2)",
      },
      {
        id: 6,
        type: "images",
        title: null,
        layout: "2",
        images: [
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop"
        ],
      },
      {
        id: 7,
        type: "heading",
        title: "Video Integration",
      },
      {
        id: 8,
        type: "video",
        title: null,
        videos: [
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        ],
      },
      {
        id: 9,
        type: "heading",
        title: "Mermaid Diagram Example",
      },
      {
        id: 10,
        type: "diagram",
        title: null,
        code: "graph TD\n  A[Start] --> B{Is it working?}\n  B -- Yes --> C[Great!]\n  B -- No --> D[Debug]\n  D --> B",
      },
      {
        id: 11,
        type: "heading",
        title: "Data Table",
      },
      {
        id: 12,
        type: "table",
        title: null,
        text: JSON.stringify({
          headers: ["Feature", "Status", "Notes"],
          rows: [
            ["Headings", "Working", "Looks great with the primary color indicator"],
            ["Text", "Working", "Proper line height and spacing"],
            ["Code Blocks", "Working", "Syntax highlighting applied"],
            ["Images", "Working", "Grid layouts functioning"],
            ["Videos", "Working", "Video player embedded"],
            ["Diagrams", "Working", "Mermaid.js rendered successfully"],
            ["Tables", "Working", "Responsive table layout rendered"]
          ]
        }),
      }
    ],
  };

  return <SingleBlogClient blogPost={mockBlogPost} />;
}
