import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api/config";
import { revalidateTag, revalidatePath } from "next/cache";

export async function GET() {
  try {
    const formData = new FormData();
    formData.append("title", "The Ultimate Markdown & Components Test Article (Seeded)");
    formData.append("excerpt", "This is an article generated via the seeder API to test all available components directly from the database.");
    formData.append("lang", "en");
    // formData.append("category_id", "1"); 
    
    // 1. Heading
    formData.append("content[0][type]", "heading");
    formData.append("content[0][title]", "Welcome to the Seeder Article");

    // 2. Text
    formData.append("content[1][type]", "text");
    formData.append("content[1][text]", "This article contains every single block type available in our system. The goal is to verify that the UI renders everything properly, including spacing, typography, and interactive components. Below, you will see examples of code blocks, diagrams, and tables.");

    // 3. Heading (Code)
    formData.append("content[2][type]", "heading");
    formData.append("content[2][title]", "Code Block Example");

    // 4. Code
    formData.append("content[3][type]", "code");
    formData.append("content[3][code]", "function greetWorld() {\n  console.log('Hello, world!');\n  return true;\n}\n\ngreetWorld();");

    // 5. Heading (Diagram)
    formData.append("content[4][type]", "heading");
    formData.append("content[4][title]", "Mermaid Diagram Example");

    // 6. Diagram
    formData.append("content[5][type]", "diagram");
    formData.append("content[5][code]", "%% width: 50% %%\ngraph TD\n  A[Start] --> B{Is it working?}\n  B -- Yes --> C[Great!]\n  B -- No --> D[Debug]\n  D --> B");

    // 7. Heading (Table)
    formData.append("content[6][type]", "heading");
    formData.append("content[6][title]", "Data Table Example");

    // 8. Table
    formData.append("content[7][type]", "table");
    formData.append("content[7][text]", JSON.stringify({
      headers: ["Feature", "Status", "Notes"],
      rows: [
        ["Headings", "Working", "Looks great with the primary color indicator"],
        ["Text", "Working", "Proper line height and spacing"],
        ["Code Blocks", "Working", "Syntax highlighting applied"],
        ["Diagrams", "Working", "Mermaid.js rendered successfully"],
        ["Tables", "Working", "Responsive table layout rendered"]
      ]
    }));

    // Post to API
    const response = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"), 
      "/api/articles",         
      {
        method: "POST",
        body: formData,        
      },
      "admin_token"            
    );

    revalidateTag('articles-list');
    revalidatePath("/admin/articles");
    revalidatePath("/blog");

    return NextResponse.json({ success: true, message: "Seeded successfully!", data: response });
  } catch (error: any) {
    console.error("Seeder error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to seed" }, { status: 500 });
  }
}
