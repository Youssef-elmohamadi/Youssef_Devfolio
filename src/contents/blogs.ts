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
          "زمان React كانت بتستخدم نظام اسمه Stack Reconciler عشان تحدث الـ UI، بس كان عندها مشكلة كبيرة… أي تحديث كان لازم يخلص كله مرة واحدة الاول. ده معناه إن لو حصل تحديث تقيل، الصفحة كلها بتجمد معاه.",
      },
      {
        type: "text",
        content:
          "المشاكل الأساسية مع Stack Reconciler:\n\n- أي تحديث لازم يخلص بالكامل، حتى لو كان تقيل.\n- مفيش تأجيل: الكتابة في input ممكن تتأخر.\n- كل التحديثات بنفس الأولوية.",
      },
      {
        type: "text",
        content:
          "لو بصيت على الكود ده هتفهم إيه اللي بيحصل مع Stack Reconciler:",
      },
      {
        type: "code",
        language: "javascript",
        content: `import { useState } from "react";

const products = new Array(1000).fill(0).map((_, i) => \`Product \${i + 1}\`);

function App() {
  const [list, setList] = useState([]);

  const handleClick = () => {
    setList(products); // تحديث كبير مرة واحدة = تهنيج
  };

  return (
    <div>
      <button onClick={handleClick}>حمل المنتجات</button>
      <input type="text" placeholder="اكتب هنا" className="border p-2 block my-2" />
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
          "لما تضغط على الزر، React بتحاول تعرض 1000 منتج مرة واحدة وده بيهنج الصفحة. أي ضغط أو كتابة أثناء التحديث مش هيتنفذ بسرعة.",
      },
      {
        type: "text",
        content:
          "React Fiber جه يحل المشكلة:\n\n- بيقسم التحديثات لمراحل صغيرة.\n- بيدي أولوية للأحداث المهمة زي الكليكات والكتابة.\n- يقدر يوقف التحديثات التقيلة ويكملها بعدين.",
      },
      {
        type: "text",
        content:
          "الخلاصة: Fiber خلا التحديثات مرنة وسلسة، وخلّى React تقدر تدير الأولويات بشكل ذكي.",
      },
    ],
    lang: "ar",
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
          "لو شغال بـ React ومش واخد بالك من الأداء فإنت زي اللي سايق عربية ودايس فرامل وهو فاكر إنه بيزود بنزين! 😅",
      },
      {
        type: "text",
        content:
          "كتير بتحس إن الموقع تقيل رغم إن الكود شكله شغال تمام والسبب يا معلم إن في مكونات بتعمل إعادة Render على الفاضي.",
      },
      {
        type: "text",
        content:
          "خليني أقولك إمتى بيحصل الـ reRender:\n\n- أي Component في React بيعمل reRender لو الـ state أو props بتاعته اتغيرت.\n- لو الأب (Parent Component) عمل re-render، كل الأولاد (Child Components) هتعمل re-render معاه حتى لو مفيش تغيير حقيقي في الـ props.",
      },
      {
        type: "text",
        content: "طيب ودي نحلها إزاي؟",
      },
      {
        type: "text",
        content: "أولاً: React.memo()",
      },
      {
        type: "text",
        content:
          "لو عندك Component مش محتاج يعمل re-render غير لما props بتاعته تتغير فعلاً، هتلف الـ component ده بـ React.memo(). كده الـ Component مش هيعمل re-render على الفاضي وهيتعمل re-render بس لما data تتغير.",
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
        content: "ثانياً: useCallback()",
      },
      {
        type: "text",
        content:
          "لو عندك function بتتبعت كـ prop لمكون تاني، كل مرة الأب هيعمل re-render الـ function بتتعاد إنشائها وده بيخلي الـ child يعمل re-render هو كمان. وهنا ييجي دور useCallback().",
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
          "كده handleClick مش هتتغير بين كل render والتاني، وده يحل المشكلة.",
      },
      {
        type: "text",
        content:
          "الخلاصة:\n\n- استخدم React.memo() عشان تمنع إعادة الـ render اللي مالهاش لازمة.\n- استخدم useCallback() علشان تحافظ على ثبات functions وتحسن الأداء.",
      },
    ],
    lang: "ar",
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
          "عزيزي مطور React، لو حسيت ببطء في تطبيقك، أول حاجة بتفكر فيها هي أدوات زي React.memo، useMemo، و useCallback. وبتحس إنك كده بتحقق أعلى مستويات التحسين! 😅",
      },
      {
        type: "text",
        content:
          "لكن الحقيقة؟ المستخدم مش هيفتح الموقع ويقول 'الله! ده عدد الـ renders قليل!' هو بس عايز تطبيق سريع وسَلس. الأدوات دي ممكن تكون حلول في بعض الحالات، لكن البطء الحقيقي سببه مش بس إعادة الـ renders. دي مجرد أدوات تحسين مش هي السرعة الحقيقية!",
      },
      {
        type: "text",
        content: "الأسباب اللي فعلًا تبطأ التطبيق:",
      },
      {
        type: "text",
        content:
          "- تأخر تحميل الكود أو البيانات الأساسية.\n- الصور بتظهر فجأة وبتسبب مشكلة في تنسيق الصفحة (Layout Shift).\n- البيانات بتتأخر جدًا في الوصول والمستخدم بيستنى كتير.\n- Scroll تقيل بسبب صور ضخمة أو عناصر كتير جدًا في الـ DOM.\n- تحميل الجافاسكريبت الأساسية بياخد وقت وبيأخر تفاعل المستخدم.",
      },
      {
        type: "text",
        content: "طيب إيه اللي يخلي التطبيق سريع بجد؟",
      },
      {
        type: "text",
        content:
          "الحاجات اللي بتحسن الأداء فعلاً:\n\n1. تحميل العناصر الأساسية الأول.\n2. استخدام Lazy Loading وتقسيم الكود.\n3. استخدام Suspense مع مكتبات زي React Query أو SWR.\n4. تثبيت الـ Layout باستخدام أبعاد الصور والفيديوهات.\n5. تأجيل تحميل الجافاسكريبت الغير ضرورية.\n6. تخزين الـ state محلي في الكومبوننت لو مش محتاج يكون global.",
      },
      {
        type: "text",
        content:
          "الخلاصة: بلاش تركّز بس على تقليل الـ renders، ركّز على تحسين تحميل الكود والبيانات. ده اللي يخلي التطبيق فعلاً سريع.",
      },
    ],
    lang: "ar",
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
          "حاسس إن الأداء مش أحسن حاجة في التطبيقات اللي بتعملها؟ الـ UI بيتقل وبيفريز مع التحديثات الكبيرة؟ تعالى أقولك على Hook في React هيساعدك: useTransition 🥷🏼",
      },
      {
        type: "text",
        content:
          "الـ useTransition هي React Hook بتستخدم لتأجيل بعض التحديثات عشان تسيب التحديثات المهمة تتنفذ الأول.",
      },
      {
        type: "text",
        content:
          "تخيل إن عندك input للبحث في Array كبيرة وعايز تعرض النتايج مباشرة. الكود هيكون بالشكل ده:",
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
    // تحديث عاجل - فوري
    setSearchText(e.target.value);
    
    // تحديث غير عاجل - يمكن تأجيله
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
      {isPending && <div>جاري البحث...</div>}
      <ul>
        {filteredData.map(item => <li key={item}>{item}</li>)}
      </ul>
    </>
  );
}`,
      },
      {
        type: "text",
        content: "في عملية البحث دي، بيحصل تحديثين مع بعض:",
      },
      {
        type: "text",
        content:
          "1. تحديث نص البحث داخل الـ input → لازم يكون فوري.\n2. تحديث البيانات وتصفيتها → ممكن يتأجل شوية.",
      },
      {
        type: "text",
        content:
          "من غير useTransition، تحديث الكتابة هيتأخر لحد ما التصفية تخلص وده بيأثر على السرعة.",
      },
      {
        type: "text",
        content: "هنا ييجي دور useTransition:",
      },
      {
        type: "text",
        content:
          "useTransition بتقسم التحديثات إلى:\n\n- تحديثات عاجلة: زي تحديث نص البحث.\n- تحديثات غير عاجلة: زي تصفية البيانات.",
      },
      {
        type: "text",
        content:
          "React بتفهم إن التحديثات اللي جوه startTransition ممكن تتأجل لو فيه حاجة أهم بتحصل في نفس الوقت.",
      },
      {
        type: "text",
        content: "وده بيخلي الأداء أفضل والتطبيق أسرع من غير ما يحصل تهنيج.",
      },
    ],
    lang: "ar",
  },
];

export default blogs;
