import { Blog } from "@/types/index";

export const blogs: Blog[] = [
  {
    title: "Understanding React Fiber",
    excerpt:
      "Learn how React Fiber solves UI lag by breaking rendering into smaller tasks.",
    date: "2024-03-18",
    readTime: "9 min read",
    slug: "understanding-react-fiber",
    content: [
      {
        type: "text",
        content:
          "Previously, React used a system called Stack Reconciler to update the UI, but it had a big problem… any update had to finish entirely in one go first. That means if a heavy update happened, the whole page would freeze along with it.",
      },
      {
        type: "text",
        content:
          "Main issues with Stack Reconciler:\n\n- Any update had to complete fully, even if it was heavy.\n- No deferring: typing in an input could be delayed.\n- All updates had the same priority.",
      },
      {
        type: "text",
        content:
          "If you look at this code, you’ll understand what happens with Stack Reconciler:",
      },
      {
        type: "code",
        language: "javascript",
        content: `import { useState } from "react";

const products = new Array(1000).fill(0).map((_, i) => \`Product \${i + 1}\`);

function App() {
  const [list, setList] = useState([]);

  const handleClick = () => {
    setList(products); // Large update all at once = freeze
  };

  return (
    <div>
      <button onClick={handleClick}>Load Products</button>
      <input type="text" placeholder="Type here" className="border p-2 block my-2" />
      {list.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
}

export default App;`,
      },
      {
        type: "text",
        content:
          "When you click the button, React tries to render 1000 products at once, which freezes the page. Any typing or clicking during the update won’t execute immediately.",
      },
      {
        type: "text",
        content:
          "React Fiber came to solve this problem:\n\n- It splits updates into smaller tasks.\n- It prioritizes important events like clicks and typing.\n- It can pause heavy updates and resume them later.",
      },
      {
        type: "text",
        content:
          "In summary: Fiber made updates smoother and allowed React to manage priorities intelligently.",
      },
    ],
    lang: "en",
  },

  {
    title: "React Performance Optimization with Memoization",
    excerpt:
      "Learn how to optimize React apps using React.memo and useCallback to prevent unnecessary re-renders.",
    date: "2024-04-12",
    readTime: "7 min read",
    slug: "react-performance-optimization-ar",
    content: [
      {
        type: "text",
        content:
          "If you’re coding with React and not paying attention to performance, it’s like driving a car with the brakes pressed while thinking you’re accelerating! 😅",
      },
      {
        type: "text",
        content:
          "Often you feel the site is slow even though the code looks fine, and the reason is that some components re-render unnecessarily.",
      },
      {
        type: "text",
        content:
          "When does reRender happen:\n\n- Any React component re-renders if its state or props change.\n- If the parent component re-renders, all child components will also re-render, even if their props haven’t really changed.",
      },
      {
        type: "text",
        content: "So, how do we fix this?",
      },
      {
        type: "text",
        content: "First: React.memo()",
      },
      {
        type: "text",
        content:
          "If you have a component that should only re-render when its props actually change, wrap it with React.memo(). This prevents unnecessary re-renders and only updates when data changes.",
      },
      {
        type: "code",
        language: "javascript",
        content: `const MyComponent = React.memo(({ data }) => {
  console.log("Rendered!");
  return <div>{data}</div>;
});`,
      },
      {
        type: "text",
        content: "Second: useCallback()",
      },
      {
        type: "text",
        content:
          "If you pass a function as a prop to another component, every time the parent re-renders, the function gets recreated, causing the child to re-render as well. That’s where useCallback() comes in.",
      },
      {
        type: "code",
        language: "javascript",
        content: `import { useCallback } from "react";

const handleClick = useCallback(() => {
  console.log("Clicked!");
}, []);`,
      },
      {
        type: "text",
        content:
          "Now handleClick won’t change between renders, solving the problem.",
      },
      {
        type: "text",
        content:
          "Summary:\n\n- Use React.memo() to prevent unnecessary re-renders.\n- Use useCallback() to keep functions stable and improve performance.",
      },
    ],
    lang: "en",
  },
  {
    title: "React Performance: Beyond React.memo and useCallback",
    excerpt:
      "Discover the real reasons behind slow React apps and how to boost performance by managing code and data loading effectively.",
    date: "2024-04-15",
    readTime: "8 min read",
    slug: "react-performance-beyond-memo",
    content: [
      {
        type: "text",
        content:
          "Dear React developer, if your app feels slow, the first thing you think of is tools like React.memo, useMemo, and useCallback. You feel like you’re reaching peak optimization! 😅",
      },
      {
        type: "text",
        content:
          "But the truth? Users don’t open your app and say, 'Wow! The number of renders is low!' They just want a smooth and fast experience. These tools can help in some cases, but real slowness isn’t just about renders. They’re just optimization tools, not real speed boosters!",
      },
      {
        type: "text",
        content: "The actual reasons apps slow down:",
      },
      {
        type: "text",
        content:
          "- Delayed loading of code or essential data.\n- Images popping in suddenly causing layout shifts.\n- Data taking too long to arrive, leaving users waiting.\n- Heavy scrolling due to large images or too many DOM elements.\n- Initial JavaScript bundle being too heavy, delaying interactivity.",
      },
      {
        type: "text",
        content: "So, what really makes an app fast?",
      },
      {
        type: "text",
        content:
          "Real performance boosters:\n\n1. Load essential elements first.\n2. Use lazy loading and code splitting.\n3. Use Suspense with libraries like React Query or SWR.\n4. Stabilize layout by setting image and video dimensions.\n5. Defer loading non-essential JavaScript.\n6. Keep state local if it doesn’t need to be global.",
      },
      {
        type: "text",
        content:
          "Summary: Don’t just focus on reducing renders—focus on improving code and data loading. That’s what really makes an app fast.",
      },
    ],
    lang: "en",
  },
  {
    title: "Improving React Performance with useTransition",
    excerpt:
      "Learn how to use useTransition to split updates and defer heavy tasks to keep the UI responsive.",
    date: "2024-04-18",
    readTime: "5 min read",
    slug: "react-usetransition-performance",
    content: [
      {
        type: "text",
        content:
          "Feeling like your apps aren’t as smooth as they should be? The UI lags and freezes during heavy updates? Let me introduce you to a React hook that helps: useTransition 🥷🏼",
      },
      {
        type: "text",
        content:
          "useTransition is a React hook used to defer some updates so important ones can run first.",
      },
      {
        type: "text",
        content:
          "Imagine you have a search input for a large array and want to display results instantly. The code would look like this:",
      },
      {
        type: "code",
        language: "javascript",
        content: `import { useState, useTransition } from 'react';
function SearchComponent() {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e) {
    // Urgent update - immediate
    setSearchText(e.target.value);
    
    // Non-urgent update - can be deferred
    startTransition(() => {
      setFilteredData(
        data.filter(item =>
          item.includes(e.target.value)
        )
      );
    });
  }

  return (
    <>
      <input value={searchText} onChange={handleSearch} />
      {isPending && <div>Searching...</div>}
      <ul>
        {filteredData.map(item => <li key={item}>{item}</li>)}
      </ul>
    </>
  );
}`,
      },
      {
        type: "text",
        content: "In this search process, two updates happen at the same time:",
      },
      {
        type: "text",
        content:
          "1. Updating the search text in the input → must be immediate.\n2. Updating and filtering the data → can be slightly delayed.",
      },
      {
        type: "text",
        content:
          "Without useTransition, typing updates would be delayed until filtering finishes, which hurts responsiveness.",
      },
      {
        type: "text",
        content: "Here’s where useTransition comes in:",
      },
      {
        type: "text",
        content:
          "useTransition separates updates into:\n\n- Urgent updates: like updating the input value.\n- Non-urgent updates: like filtering data.",
      },
      {
        type: "text",
        content:
          "React understands that updates inside startTransition can be deferred if something more important is happening.",
      },
      {
        type: "text",
        content:
          "This improves responsiveness and prevents the app from freezing.",
      },
    ],
    lang: "en",
  },
];

export default blogs;
