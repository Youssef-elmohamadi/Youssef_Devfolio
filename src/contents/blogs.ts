import { Blog } from "@/types/index";

export const blogs: Blog[] = [
  {
    title:
      "Closure Demystified: The Behind-the-Scenes JavaScript You Don't See",
    excerpt:
      "Learn the concept of Closure in JavaScript in a simple and practical way. A detailed explanation with real-life examples shows how Closure works behind the scenes and its most important programming uses, such as data hiding, state management, and async handling.",
    date: "2024-03-18",
    readTime: "9 min read",
    slug: "closure-demystified",
    banner: {
      type: "image",
      url: "/images/closure-demystified.png",
      alt: "Closure Demystified illustration",
    },
    content: [
      {
        type: "heading",
        id: "intro",
        content: "Introduction",
      },
      {
        type: "text",
        id: 1,
        content:
          "If you've worked with JavaScript for a while, you've probably come across the word \"Closure,\" which can sometimes make you feel like it's something mysterious or complex. But the truth is, the Closure is a very simple concept, and once you understand it, you'll discover how powerful and useful it is in your code. In this article, we'll talk about Closure as if we were telling a story. We'll start with very simple examples and without complicated terminology, then dive behind the scenes to see how it actually works and why it's important in our lives as programmers.",
      },
      {
        type: "image",
        id: "img-1",
        url: "/images/Closure_JS.png",
        alt: "Closure in JavaScript",
        caption: "Understanding Closure in JavaScript",
      },
      {
        type: "heading",
        id: "scratch",
        content: "Closure without complexity: Let's start from scratch",
      },
      {
        type: "text",
        id: 2,
        content:
          "A closure is simply a function that carries over the environment in which it was defined even after the function that created it has finished executing. This means that the inner function can access the variables that were present at the time it was defined, even if the outer function returns and has finished executing.",
      },
      {
        type: "code",
        language: "javascript",
        id: 3,
        content: `function outer() {
  let x = 10;
  function inner() {
    return x;
  }
  return inner;
}

const fn = outer();//The outer function has finished executing and returned the inner function code.
console.log(fn()); // 10`,
      },

      {
        type: "text",
        id: 4,
        content:
          "What happened in order:\n1. First, we defined the outer function – inside it, we declared the variable `x` and also defined the inner function.\n2. When we called the outer function, the variable `x` was set to 10.\n3. At the moment the inner function was defined, it gained access to `x` (the entire outer environment) and could also modify it.\n4. The outer function then returned the inner function as a value, and was removed from the call stack.\n5. But… since the inner function still has access to `x`, JavaScript said: “Wait, I can’t delete the outer environment (the place where the variables are stored). Keep it in the heap until the inner function is no longer accessible.”\n6. So, when we call `fn()` (which is actually the inner function), it retrieves `x` from the outer environment.",
      },
      {
        type: "heading",
        id: "closure-interview",
        content: "A classic interview example about closure",
      },
      {
        type: "code",
        language: "javascript",
        id: 3,
        content: `for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}`,
      },
      {
        type: "text",
        id: 4,
        content:
          "Can you tell me what the output of this code will be?\nUnexpectedly, the output will be:",
      },
      {
        type: "code",
        language: "javascript",
        id: 5,
        content: `
//3
//3
//3`,
      },
      {
        type: "text",
        id: 6,
        content:
          "Why did that happen?!\nIn fact, the problem is not in the closure.\nThe closure here is the function inside the setTimeout, which can access variables outside its scope even after the loop has finished executing completely.",
      },
      {
        type: "text",
        id: 7,
        content:
          "To understand this example, we need to understand how JavaScript works behind the scenes.\nLet's learn about these concepts.",
      },
      {
        type: "heading",
        id: "secret-theater",
        content: "The Secret Theater of JavaScript",
      },
      {
        type: "text",
        id: 8,
        content:
          "1. Call Stack: The place where the current code is executed step by step.\n2. Web APIs / Host APIs: Browser or Node services that deal with timing (setTimeout), DOM Events, and fetch.\n3. Task Queue: The queue where callbacks are collected, ready to be executed after the main code is finished.\n4. Event Loop: The mechanism that monitors the Call Stack, and if it is empty, moves the first task from the Task Queue to the Call Stack.",
      },
      {
        type: "text",
        id: 9,
        content:
          "If you don't understand 100% of what I'm saying, don't worry... I'll explain it to you in simple Egyptian\n(or peasant way 😂) so that the picture is clearer.",
      },
      {
        type: "text",
        id: 9,
        content:
          "Imagine we are sitting in a theater…\nThere is a stage, actors, backstage, and a theater manager who organizes everything.\nJavaScript works in almost the same way!\n Let's divide the scene:\n1. Call Stack (stage): This is the only place where actors (functions) can stand and speak in front of the audience.\nThe rule: “No more than one actor can be on stage at a time.”\nAny actor who comes on stage must finish their role before the next one.\n2. Web APIs / Host APIs (Backstage): This is where the technicians and stagehands prepare things that are not directly on stage.\nExample: The director says, “In 2 seconds, bring in a new actor” → The technicians (setTimeout) start preparing backstage.\nOr: “When the audience clicks the button, prepare a new scene” → Backstage records the event and gets ready.\n3. Task Queue: When the technicians prepare an actor, he does not go on stage immediately.\nHe is placed first in the queue outside the stage.This queue is organized: the first actor to arrive is the first to go on stage.\n4. Event Loop (Stage Manager):This is the stage manager 👨‍💼.He stands watching the stage: “Is it empty or is there still an actor working?”\nIf the stage is empty → he calls the first actor in the queue and brings him on.\nHe repeats the process throughout the show: watch → if empty → bring on a new actor.",
      },
      {
        type: "text",
        id: 10,
        content:
          "Now that we have explained how JavaScript works, let's return to the example.",
      },
      {
        type: "code",
        language: "javascript",
        id: 3,
        content: `for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
//3
//3
//3`,
      },
      {
        type: "text",
        id: 11,
        content:
          "The show begins. The loop enters the stage (Call Stack) and the first iteration begins.\nsetTimeout appears on stage.\nBut it's a smart actor: he doesn't do the colback himself.\nInstead, he says: “Hey Web APIs, after 100ms, bring me this function (() => console.log(i))!”\nThen setTimeout exits the stage, The loop completes the second iteration, then the third with the same scenario.\nAfter the loop ends, the last actor exits, Here, the variable i has reached the value 3.",
      },
      {
        type: "text",
        id: 12,
        content:
          "Behind the scenes, each setTimeout call starts its own 100ms timer.\nWhen the counters run out, the technicians behind the scenes say:“We've finished preparing the callback!”\nSend the completed callbacks to the Task Queue.\nNow, in front of the theater door(Task Queue), there are three actors (the callbacks), each of whom is:\n() => console.log(i) lined up in a queue waiting for permission to enter.\nThe theater manager (Event Loop) monitors the situation: “Is the theater (Call Stack) empty?”\nYes, after the loop ended, it became empty.\nSo the manager begins to bring in the actors from the queue one by one.",
      },
      {
        type: "text",
        id: 13,
        content:
          "The first colpack enters the stage and executes console.log(i)\nBut surprise: all callbacks refer to the same binding for variable i (because we used var)\nAnd the value of this variable has already become 3 after the loop ends.\nSo each of the three actors says the same sentence:\n//3\n//3\n//3",
      },
      {
        type: "heading",
        id: "summary",
        content: "Summary",
      },
      {
        type: "text",
        id: 14,
        content:
          "In the end, closure is not just a technical concept in JavaScript, but a cornerstone for understanding how the language handles variables and their lifetime.\nIt gives us the ability to preserve values over time and write flexible and elegant code.\n\nIn our journey with it, we also touched on the mechanisms that drive all of this behind the scenes: the call stack, Web APIs, task queue, and event loop.\nA deep understanding of both parts together allows you to see JavaScript not just as commands, but as an entire theater that controls every scene and its timing.mThank you for reading.\n\nby: Youssef El-Mahmoudi",
      },
      {
        type: "external-video",
        id: "vid-1",
        url: "https://www.youtube.com/embed/8aGhZQkoFbQ",
        caption: "Dan Abramov explaining React Fiber",
      },
      {
        type: "internal-video",
        id: "vid-1",
        url: "https://www.youtube.com/embed/8aGhZQkoFbQ",
        caption: "Dan Abramov explaining React Fiber",
      },
    ],
    lang: "en",
  },
  {
    title: "Understanding React Fiber",
    excerpt:
      "Learn how React Fiber solves UI lag by breaking rendering into smaller tasks.",
    date: "2024-03-18",
    readTime: "9 min read",
    slug: "understanding-react-fiber",
    banner: {
      type: "image",
      url: "/images/max-react-fiber.png",
      alt: "React Fiber illustration",
    },
    content: [
      {
        type: "heading",
        id: "intro",
        content: "Introduction",
      },
      {
        type: "text",
        id: 1,
        content:
          "Previously, React used a system called Stack Reconciler to update the UI, but it had a big problem… any update had to finish entirely in one go first. That means if a heavy update happened, the whole page would freeze along with it.",
      },
      {
        type: "image",
        id: "img-1",
        url: "/images/max-react-fiber.png",
        alt: "Stack Reconciler vs Fiber",
        caption: "Comparison between Stack Reconciler and Fiber",
      },
      {
        type: "heading",
        id: "issues",
        content: "Main Issues with Stack Reconciler",
      },
      {
        type: "text",
        id: 2,
        content:
          "- Any update had to complete fully, even if it was heavy.\n- No deferring: typing in an input could be delayed.\n- All updates had the same priority.",
      },
      {
        type: "heading",
        id: "example",
        content: "Example Code",
      },
      {
        type: "text",
        id: 3,
        content:
          "If you look at this code, you’ll understand what happens with Stack Reconciler:",
      },
      {
        type: "code",
        id: 4,
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
        id: 5,
        content:
          "When you click the button, React tries to render 1000 products at once, which freezes the page. Any typing or clicking during the update won’t execute immediately.",
      },
      {
        type: "heading",
        id: "fiber-solution",
        content: "How React Fiber Solves This",
      },
      {
        type: "text",
        id: 6,
        content:
          "- It splits updates into smaller tasks.\n- It prioritizes important events like clicks and typing.\n- It can pause heavy updates and resume them later.",
      },
      {
        type: "external-video",
        id: "vid-1",
        url: "https://www.youtube.com/embed/8aGhZQkoFbQ",
        caption: "Dan Abramov explaining React Fiber",
      },
      {
        type: "internal-video",
        id: "vid-1",
        url: "https://www.youtube.com/embed/8aGhZQkoFbQ",
        caption: "Dan Abramov explaining React Fiber",
      },
      {
        type: "heading",
        id: "summary",
        content: "Summary",
      },
      {
        type: "text",
        id: 7,
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
    slug: "react-performance-optimization",
    banner: {
      type: "image",
      url: "/images/react-memo-banner.jpg",
      alt: "React Memoization illustration",
    },
    content: [
      {
        type: "heading",
        id: "intro",
        content: "Introduction",
      },
      {
        type: "text",
        id: 1,
        content:
          "If you’re coding with React and not paying attention to performance, it’s like driving a car with the brakes pressed while thinking you’re accelerating! 😅",
      },
      {
        type: "heading",
        id: "problem",
        content: "The Problem of Unnecessary Re-renders",
      },
      {
        type: "text",
        id: 2,
        content:
          "Often you feel the site is slow even though the code looks fine, and the reason is that some components re-render unnecessarily.",
      },
      {
        type: "text",
        id: 3,
        content:
          "When does reRender happen:\n\n- Any React component re-renders if its state or props change.\n- If the parent component re-renders, all child components will also re-render, even if their props haven’t really changed.",
      },
      {
        type: "image",
        id: "img-2",
        url: "/images/react-rerender.png",
        alt: "React re-render flow",
        caption: "Visualizing unnecessary re-renders",
      },
      {
        type: "heading",
        id: "solutions",
        content: "Solutions",
      },
      {
        type: "text",
        id: 4,
        content: "So, how do we fix this?",
      },
      {
        type: "heading",
        id: "react-memo",
        content: "React.memo()",
      },
      {
        type: "text",
        id: 5,
        content: "First: React.memo()",
      },
      {
        type: "text",
        id: 6,
        content:
          "If you have a component that should only re-render when its props actually change, wrap it with React.memo(). This prevents unnecessary re-renders and only updates when data changes.",
      },
      {
        type: "code",
        language: "javascript",
        id: 7,
        content: `const MyComponent = React.memo(({ data }) => {
  console.log("Rendered!");
  return <div>{data}</div>;
});`,
      },
      {
        type: "heading",
        id: "use-callback",
        content: "useCallback()",
      },
      {
        type: "text",
        id: 8,
        content: "Second: useCallback()",
      },
      {
        type: "text",
        id: 9,
        content:
          "If you pass a function as a prop to another component, every time the parent re-renders, the function gets recreated, causing the child to re-render as well. That’s where useCallback() comes in.",
      },
      {
        type: "code",
        id: 10,
        language: "javascript",
        content: `import { useCallback } from "react";

const handleClick = useCallback(() => {
  console.log("Clicked!");
}, []);`,
      },
      {
        type: "text",
        id: 11,
        content:
          "Now handleClick won’t change between renders, solving the problem.",
      },
      {
        type: "heading",
        id: "summary",
        content: "Summary",
      },
      {
        type: "text",
        id: 12,
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
    banner: {
      type: "video",
      url: "https://www.youtube.com/embed/dpw9EHDh2bM",
      caption: "React Conf Talk on Performance",
    },
    content: [
      {
        type: "heading",
        id: "intro",
        content: "Introduction",
      },
      {
        type: "text",
        id: 1,
        content:
          "Dear React developer, if your app feels slow, the first thing you think of is tools like React.memo, useMemo, and useCallback. You feel like you’re reaching peak optimization! 😅",
      },
      {
        type: "heading",
        id: "misconception",
        content: "The Misconception",
      },
      {
        type: "text",
        id: 2,
        content:
          "But the truth? Users don’t open your app and say, 'Wow! The number of renders is low!' They just want a smooth and fast experience...",
      },
      {
        type: "heading",
        id: "causes",
        content: "The Actual Causes of Slowness",
      },
      {
        type: "text",
        id: 3,
        content: "The actual reasons apps slow down:",
      },
      {
        type: "text",
        id: 4,
        content:
          "- Delayed loading of code or essential data.\n- Images popping in suddenly causing layout shifts.\n- Data taking too long to arrive, leaving users waiting.\n- Heavy scrolling due to large images or too many DOM elements.\n- Initial JavaScript bundle being too heavy, delaying interactivity.",
      },
      {
        type: "heading",
        id: "real-performance",
        content: "What Really Makes an App Fast?",
      },
      {
        type: "text",
        id: 5,
        content: "So, what really makes an app fast?",
      },
      {
        type: "text",
        id: 6,
        content:
          "Real performance boosters:\n\n1. Load essential elements first.\n2. Use lazy loading and code splitting.\n3. Use Suspense with libraries like React Query or SWR.\n4. Stabilize layout by setting image and video dimensions.\n5. Defer loading non-essential JavaScript.\n6. Keep state local if it doesn’t need to be global.",
      },
      {
        type: "heading",
        id: "summary",
        content: "Summary",
      },
      {
        type: "text",
        id: 7,
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
    banner: {
      type: "image",
      url: "/images/usetransition-banner.jpg",
      alt: "React useTransition illustration",
    },
    content: [
      {
        type: "heading",
        id: "intro",
        content: "Introduction",
      },
      {
        type: "text",
        id: 1,
        content:
          "Feeling like your apps aren’t as smooth as they should be? The UI lags and freezes during heavy updates? Let me introduce you to a React hook that helps: useTransition 🥷🏼",
      },
      {
        type: "heading",
        id: "what-is",
        content: "What is useTransition?",
      },
      {
        type: "text",
        id: 2,
        content:
          "useTransition is a React hook used to defer some updates so important ones can run first.",
      },
      {
        type: "heading",
        id: "example",
        content: "Example Code",
      },
      {
        type: "text",
        id: 3,
        content:
          "Imagine you have a search input for a large array and want to display results instantly. The code would look like this:",
      },
      {
        type: "code",
        id: 4,
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
        type: "heading",
        id: "how-it-works",
        content: "How it Works",
      },
      {
        type: "text",
        id: "5",
        content: "In this search process, two updates happen at the same time:",
      },
      {
        type: "text",
        id: "6",
        content:
          "1. Updating the search text in the input → must be immediate.\n2. Updating and filtering the data → can be slightly delayed.",
      },
      {
        type: "text",
        id: "7",
        content:
          "Without useTransition, typing updates would be delayed until filtering finishes, which hurts responsiveness.",
      },
      {
        type: "heading",
        id: "benefits",
        content: "Why useTransition Helps",
      },
      {
        type: "text",
        id: "8",
        content: "Here’s where useTransition comes in:",
      },
      {
        type: "text",
        id: "9",
        content:
          "useTransition separates updates into:\n\n- Urgent updates: like updating the input value.\n- Non-urgent updates: like filtering data.",
      },
      {
        type: "text",
        id: "10",
        content:
          "React understands that updates inside startTransition can be deferred if something more important is happening.",
      },
      {
        type: "heading",
        id: "summary",
        content: "Summary",
      },
      {
        type: "text",
        id: "11",
        content:
          "This improves responsiveness and prevents the app from freezing.",
      },
    ],
    lang: "en",
  },
];

export default blogs;
