/**
 * articleContentTranslations.ts
 *
 * Provides bidirectional translation mapping for article content blocks (headings, paragraphs, code comments).
 * Ensures that if a block was saved in Arabic, it renders in English when the user is on the English route (/en/blog/...),
 * and vice-versa.
 */

interface BlockTranslation {
  title?: { en: string; ar: string };
  text?: { en: string; ar: string };
  code?: { en: string; ar: string };
}

// Keyed by article ID and block ID
const ARTICLE_BLOCK_TRANSLATIONS: Record<string, Record<number, BlockTranslation>> = {
  // Article 12: Understanding State Snapshots & Batching in React
  "12": {
    1: {
      title: {
        en: "Introduction",
        ar: "مقدمة",
      },
    },
    2: {
      text: {
        en: "If you work with React, you have likely encountered this classic example before:",
        ar: "لو إنت بتشتغل بـ React، فغالبًا قابلت المثال الكلاسيكي ده قبل كده:",
      },
    },
    3: {
      code: {
        en: `const [count, setCount] = useState(0);\n\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n\n  console.log(count);\n  // Prints 0, not 3!\n}`,
        ar: `const [count, setCount] = useState(0);\n\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n\n  console.log(count);\n  // هتطبع 0، مش 3!\n}`,
      },
    },
    4: {
      text: {
        en: "So, does this mean React delays updating the state? Is useState actually asynchronous?\n\nOr is there something deeper happening?\n\nThe truth is that the answer begins with understanding two of the most critical concepts in React:\n1. State as a Snapshot: How does React treat the state value like a fixed snapshot from a specific point in time?\n2. Batching: How does React group multiple state updates together and execute them in one go instead of re-rendering after each setState call?\nSimply put, React gathers all state updates into a queue and processes them together before the next render, rather than triggering a render immediately after every setState call.",
        ar: "طيب، هل معنى كده إن React بتأخر تحديث الـ State؟ وهل useState تعتبر Asynchronous؟\n\nولا فيه حاجة أعمق بتحصل؟\n\nالحقيقة إن الإجابة بتبدأ من فهم مفهومين من أهم المفاهيم في React:\n1. State as a Snapshot (الـ State كأنها لقطة ثابتة): يعني إيه React بتتعامل مع قيمة الـ State كأنها لقطة من وقت معين؟\n2. Batching (تجميع التحديثات): إزاي React بتجمع تحديثات الـ State وبتنفذها مع بعض بدل ما تعمل Re-render بعد كل استدعاء لـ setState؟\nببساطة، React بتجمع كل تحديثات الـ State في Queue (طابور)، وبتعالجها قبل الـ Render اللي بعده، بدل ما تعمل Render بشكل فوري بعد كل استدعاء لـ setState.",
      },
    },
    5: {
      title: {
        en: "What is a State Snapshot?",
        ar: "يعني إيه State Snapshot؟",
      },
    },
    6: {
      text: {
        en: "Snapshots are one of the key reasons React delivers fast performance.\n\nEvery time React renders a component, it takes a snapshot of that state.\n\nThis snapshot contains the current values of:\n- State: The component's current internal state.\n- Props: Data passed into the component from its parent.\n- Context: Data accessible via React Context.\n- Event Handlers: Functions responsible for handling events, created during that specific render.\nThis means each event handler captures and retains the values that existed at the exact moment the render took place.\n\nThat is why, within the same event handler, the value of count does not change—even if you call setCount() multiple times.",
        ar: "الـ Snapshot واحدة من الأسباب اللي بتخلي React سريعة في الأداء.\n\nكل مرة React بتعمل فيها Render للـ Component، بتاخد نسخة من الحالة دي، والنسخة دي بنسميها Snapshot.\n\nالـ Snapshot دي بتحتوي على القيم الحالية لكل من:\n- State: الحالة الحالية للـ Component.\n- Props: البيانات اللي جاية للـ Component من الـ Parent.\n- Context: البيانات اللي الـ Component بيقدر يوصلها من خلال الـ Context.\n- Event Handlers: الـ Functions المسؤولة عن التعامل مع الأحداث، واللي بتتعمل أثناء الـ Render ده.\nوده معناه إن كل Event Handler بتكون محتفظة بالقيم اللي كانت موجودة وقت ما الـ Render حصل.\n\nوعشان كده، جوا نفس الـ Event Handler، قيمة count مش بتتغير، حتى لو استدعيت setCount() أكتر من مرة.",
      },
    },
    7: {
      code: {
        en: `const [count, setCount] = useState(0);\n\nfunction handleClick() {\n  setCount(count + 1);\n\n  console.log(count);\n  // Still prints 0\n}`,
        ar: `const [count, setCount] = useState(0);\n\nfunction handleClick() {\n  setCount(count + 1);\n\n  console.log(count);\n  // هتفضل تطبع 0\n}`,
      },
    },
    8: {
      text: {
        en: "React does not modify the current snapshot in place; instead, it schedules a new render pass, which receives a fresh snapshot with the updated values.\n\nThis snapshot architecture is a foundational reason why React scales so effectively in large applications—it always works with an immutable, consistent view of your data throughout every render cycle.",
        ar: "React مش بتعدّل الـ Snapshot الحالية، لكنها بدلًا من كده بتجدول عملية Render جديدة، والـ Render الجديد بيكون ليه Snapshot جديدة بالقيم المحدثة.\n\nونظام الـ Snapshots ده واحد من أهم الأسباب اللي بتخلي React تقدم أداء كويس، خصوصًا في التطبيقات الكبيرة؛ لأن React بتتعامل دايمًا مع نسخة ثابتة ومتناسقة من البيانات أثناء كل عملية Render.",
      },
    },
    9: {
      title: {
        en: "Why Doesn't React Update UI Immediately?",
        ar: "ليه React مش بتحدّث الـ UI بشكل فوري؟",
      },
    },
    10: {
      text: {
        en: "At first glance, it might feel intuitive for React to update the screen every single time you call setState.\n\nHowever, if it worked that way, you would run into a troublesome issue known as 'Half-Finished Renders'.\n\nImagine this scenario:",
        ar: "في البداية، ممكن تحس إن من المنطقي إن React تحدّث الشاشة كل مرة تستدعي فيها setState.\n\nلكن لو ده حصل، هتظهر مشكلة تانية اسمها Half-Finished Renders (عمليات Render غير مكتملة).\n\nتخيّل إن عندك المثال ده:",
      },
    },
    12: {
      text: {
        en: "The UI currently displays this data:",
        ar: "الـ UI حاليًا بتعرض البيانات دي:",
      },
    },
    14: {
      text: {
        en: "Now suppose you want to update both values at the same time:",
        ar: "دلوقتي إنت عايز تحدّث القيمتين مع بعض:",
      },
    },
    16: {
      text: {
        en: "If React rendered immediately after each update independently, the UI could momentarily flicker like this:",
        ar: "لو React عملت Render بعد كل تحديث بشكل منفصل، ممكن الـ UI تظهر للحظات بالشكل ده:",
      },
    },
    18: {
      text: {
        en: "Here, the first name has updated, but the last name still holds its old value.\n\nOnly then does the second render kick in:",
        ar: "هنا الـ First Name اتحدّثت، لكن الـ Last Name لسه محتفظة بالقيمة القديمة.\n\nوبعد كده بيحصل Render تاني:",
      },
    },
    20: {
      text: {
        en: "For a brief instant, the UI showed inconsistent data: one value was updated while the other remained stale.\n\nThis is precisely what React strives to prevent.\n\nInstead of rendering after every single state change, React waits until the event handler finishes executing, batches all queued state updates together, and performs a single unified render.\n\nThis transitions the UI cleanly from the old state directly to the new state without exposing intermediate inconsistencies.\n\nThat is what we call Batching.",
        ar: "لمدة قصيرة، الـ UI عرضت بيانات مش متناسقة؛ لأن قيمة اتحدّثت، والتانية لسه بالقيمة القديمة.\n\nوده بالظبط اللي React بتحاول تتجنبه.\n\nبدل ما تعمل Render بعد كل تحديث، React بتستنى لحد ما الـ Event Handler يخلص تنفيذه، وبعدها بتجمع كل تحديثات الـ State مع بعض (Batching) وبتعمل Render واحد بس.\n\nوبكده الـ UI بتنتقل مباشرة من الحالة القديمة إلى الحالة الجديدة، من غير ما تعرض أي بيانات غير متناسقة في النص.\n\nوده اللي بنسميه Batching.",
      },
    },
    22: {
      text: {
        en: "Directly from:",
        ar: "مباشرةً من:",
      },
    },
    24: {
      text: {
        en: "Without ever presenting an incomplete or inconsistent visual state to the user.\n\nThis is one of the most powerful advantages of batching in React.",
        ar: "من غير ما تعرض للمستخدم أي حالة غير مكتملة أو بيانات مش متناسقة في النص.\n\nوده واحد من أكبر وأهم فوائد الـ Batching في React.",
      },
    },
    25: {
      title: {
        en: "When Does React Batch State Updates?",
        ar: "إمتى React بتجمع تحديثات الـ State مع بعض (Batching)؟",
      },
    },
    26: {
      text: {
        en: "React batches state updates that occur within the same user event, such as:\n- Button clicks\n- Input changes\n- Any native React event handler\nFor example:",
        ar: "React بتجمع تحديثات الـ State اللي بتحصل أثناء نفس الـ Event، زي مثلًا:\n- الضغط على زرار (Button Click).\n- تغيير قيمة حقل إدخال (Input Change).\n- أي Event Handler تابعة لـ React.\nمثال:",
      },
    },
    27: {
      code: {
        en: `flowchart TB\n\nsubgraph Event1["First Click"]\n    direction LR\n    A[Button Click] --> B[Execute handleClick] --> C[Update State] --> D[Re-render]\nend\n\nsubgraph Event2["Second Click"]\n    direction LR\n    E[Button Click] --> F[Execute handleClick] --> G[Update State] --> H[Re-render]\nend\n\nEvent1 --> Event2`,
        ar: `flowchart TB\n\nsubgraph Event1["الضغطة الأولى"]\n    direction LR\n    A[الضغط على الزرار] --> B[تنفيذ handleClick] --> C[تحديث الـ State] --> D[إعادة الـ Render]\nend\n\nsubgraph Event2["الضغطة التانية"]\n    direction LR\n    E[الضغط على الزرار] --> F[تنفيذ handleClick] --> G[تحديث الـ State] --> H[إعادة الـ Render]\nend\n\nEvent1 --> Event2`,
      },
    },
    28: {
      text: {
        en: "React treats each button click as a separate event.\n\nIn other words, React does not batch across distinct user interactions, ensuring each interaction is handled independently and responsively.",
        ar: "كل ضغطة على الزرار React بتتعامل معاها على إنها Event منفصلة.\n\nيعني React مش بتجمع تفاعلات المستخدم المختلفة مع بعض، لأن كل تفاعل لازم يتم التعامل معاه بشكل مستقل عن التاني.",
      },
    },
    29: {
      title: {
        en: "Updating the Same State Multiple Times",
        ar: "تحديث نفس الـ State أكتر من مرة.",
      },
    },
    30: {
      text: {
        en: "Sometimes, you need to update the same state variable multiple times before the next render pass.\n\nFor example:",
        ar: "أحيانًا هتحتاج تحدّث نفس الـ State أكتر من مرة قبل ما يحصل الـ Render اللي بعده.\n\nعلى سبيل المثال:",
      },
    },
    32: {
      text: {
        en: "Most developers expect the final result to be 3, but in reality, it will only be 1!\n\nWhy does this happen?\n\nBecause every single call reads the same snapshot value of number from the current render pass.\n\nIf number starts at 0, React sees the updates as:",
        ar: "أغلب الناس بتتوقع إن النتيجة النهائية تكون 3، لكن في الحقيقة القيمة بتكون 1 بس!\n\nليه بيحصل كده؟\n\nلأن كل استدعاء بيقرأ نفس قيمة number الموجودة في الـ Snapshot الحالية.\n\nيعني لو قيمة number هي 0، فـ React هيوصلها التحديثات بالشكل ده:",
      },
    },
    34: {
      text: {
        en: "Therefore, the final value simply resolves to:",
        ar: "وبالتالي، القيمة النهائية هتكون ببساطة:",
      },
    },
    36: {
      title: {
        en: "Solution: Using Updater Functions",
        ar: "الحل: استخدام دوال التحديث (Updater Functions)",
      },
    },
    37: {
      text: {
        en: "React provides an alternative approach for updating state:",
        ar: "React بتوفر طريقة تانية لتحديث الـ State:",
      },
    },
    39: {
      text: {
        en: "Instead of passing the next state value directly, you pass an updater function that tells React how to calculate the next state based on the previous one.\n\nReact queues these updater functions in order.\n\nOnce the event handler finishes, React executes each function sequentially, passing the result of each one into the next.",
        ar: "بدل ما تبعت القيمة الجديدة للـ State بشكل مباشر، بتبعت Function بتقول لـ React إزاي تحسب القيمة الجديدة بناءً على القيمة السابقة.\n\nReact بتحط دوال التحديث دي في Queue (طابور التحديثات).\n\nوبعد ما الـ Event Handler تخلص تنفيذها، React بتنفذ الدوال دي واحدة ورا التانية، بحيث كل Function تستقبل نتيجة الـ Function اللي قبلها.",
      },
    },
    41: {
      text: {
        en: "This yields the final expected value:",
        ar: "وبكده، القيمة النهائية هتبقى:",
      },
    },
    43: {
      title: {
        en: "Difference Between Both Approaches",
        ar: "الفرق بين الطريقتين.",
      },
    },
    44: {
      text: {
        en: "When you pass a value directly:",
        ar: "لما بتبعت قيمة مباشرة:",
      },
    },
    46: {
      text: {
        en: "React simply overwrites the state with the raw value you provided.\n\nHowever, when you pass an updater function:",
        ar: "React ببساطة بتستبدل قيمة الـ State بالقيمة الجديدة اللي إنت بعتها.\n\nلكن لما بتبعت Function:",
      },
    },
    48: {
      text: {
        en: "React uses the freshest pending state value as it iterates through the update queue.\n\nThis makes updater functions the definitive solution whenever the next state depends on the previous state.",
        ar: "React بتستخدم أحدث قيمة متاحة للـ State وهي بتعالج الـ Queue (طابور التحديثات).\n\nوعشان كده، استخدام Updater Functions هو الحل الصحيح كل ما تكون القيمة الجديدة للـ State معتمدة على القيمة السابقة ليها.",
      },
    },
    49: {
      title: {
        en: "Final Summary",
        ar: "الخلاصة النهائية",
      },
    },
    50: {
      text: {
        en: "React isn't slow, nor is it simply 'asynchronous'.\n\nIt deliberately orchestrates renders to maintain UI consistency and eliminate redundant re-renders.\n\nMastering State Snapshots and Batching demystifies key React behaviors:\n- Why console.log() still logs the previous state value immediately after setState.\n- Why calling setState repeatedly within the same function doesn't instantly change the variable.\n- How updater functions (prev => ...) guarantee predictable sequential updates.\n- How React handles complex applications efficiently while keeping the UI rock solid.\nOnce you grasp these concepts, common React pitfalls transform into clear, intuitive mechanics.",
        ar: "React مش بطيئة، ومش مجرد إنها بتتعامل مع الـ State بشكل Asynchronous.\n\nهي بتأخر عملية الـ Rendering بشكل مقصود علشان تحافظ على تناسق الـ UI، وتتجنب العمليات اللي ملهاش داعي.\n\nوفهمك لمفهومي State Snapshots و Batching هيوضحلك ليه:\n- console.log() لسه بتطبع القيمة القديمة للـ State.\n- استدعاء setState() أكتر من مرة مش معناه إن قيمة الـ State هتتغير فورًا داخل نفس الـ Function.\n- استخدام Functional Updates بالشكل ده prev => ... بيضمن إن التحديثات المعتمدة على القيمة السابقة تتم بشكل صحيح.\n- React بتقدر تتعامل بكفاءة مع التطبيقات الكبيرة، مع الحفاظ على تناسق الـ UI.\nبمجرد ما تفهم المفهومين دول، هتلاقي إن سلوكيات كتير في React كانت محيّراك بقت منطقية وواضحة جدًا.",
      },
    },
  },
};

/**
 * Localizes a single content block based on the active locale.
 */
export function localizeContentBlock<T extends { id: number; title?: string | null; text?: string | null; code?: string | null }>(
  articleId: string | number,
  block: T,
  locale: string = "en"
): T {
  const articleMap = ARTICLE_BLOCK_TRANSLATIONS[String(articleId)];
  if (!articleMap) return block;

  const blockTrans = articleMap[block.id];
  if (!blockTrans) return block;

  const targetLang = locale === "ar" ? "ar" : "en";

  return {
    ...block,
    title: blockTrans.title ? blockTrans.title[targetLang] : block.title,
    text: blockTrans.text ? blockTrans.text[targetLang] : block.text,
    code: blockTrans.code ? blockTrans.code[targetLang] : block.code,
  };
}

/**
 * Localizes an entire array of blocks for a given article.
 */
export function localizeArticleContent<T extends { id: number; title?: string | null; text?: string | null; code?: string | null }>(
  articleId: string | number,
  blocks: T[],
  locale: string = "en"
): T[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.map((block) => localizeContentBlock(articleId, block, locale));
}
