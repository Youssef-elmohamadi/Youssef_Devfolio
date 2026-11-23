import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import crypto from "crypto";

function safeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  try {
    const configuredSecret =
      process.env.REVALIDATE_SECRET ||
      process.env.NEXTJS_REVALIDATE_SECRET ||
      process.env.REVALIDATE_TOKEN;

    if (!configuredSecret) {
      console.warn("Revalidation route called but no REVALIDATE_SECRET configured in env.");
      return NextResponse.json(
        { message: "Revalidation secret not configured on server" },
        { status: 500 }
      );
    }

    // Secret can arrive via header, query param, or JSON body
    const headerSecret = request.headers.get("x-revalidate-secret");
    const querySecret = request.nextUrl.searchParams.get("secret");

    let bodySecret: string | undefined;
    let tags: string[] = [];
    let paths: string[] = [];
    let locales: string[] = ["en", "ar"];

    try {
      const body = await request.json();
      bodySecret = body?.secret;
      if (Array.isArray(body?.tags)) tags = body.tags;
      if (Array.isArray(body?.paths)) paths = body.paths;
      if (Array.isArray(body?.locales) && body.locales.length > 0) locales = body.locales;
    } catch {
      // Body may be empty if called via query params
    }

    const queryPath = request.nextUrl.searchParams.get("path");
    if (queryPath) paths.push(queryPath);
    const queryTag = request.nextUrl.searchParams.get("tag");
    if (queryTag) tags.push(queryTag);

    const providedSecret = headerSecret || querySecret || bodySecret;

    if (!providedSecret || !safeCompare(providedSecret, configuredSecret)) {
      return NextResponse.json(
        { message: "Invalid revalidation secret" },
        { status: 401 }
      );
    }

    const revalidatedTags: string[] = [];
    const revalidatedPaths: string[] = [];

    // Expand and revalidate paths across all supported locales (/en/... and /ar/...)
    const expandedPaths = new Set<string>();

    for (const rawPath of paths) {
      if (typeof rawPath !== "string" || !rawPath.trim()) continue;
      const trimmed = "/" + rawPath.trim().replace(/^\/+/, "");

      // Revalidate the raw path
      expandedPaths.add(trimmed);

      // Check if it already has a locale prefix
      const match = trimmed.match(/^\/(en|ar)(\/.*)?$/);
      if (match) {
        const subPath = match[2] || "/";
        for (const loc of locales) {
          expandedPaths.add(`/${loc}${subPath === "/" ? "" : subPath}`);
        }
        if (subPath !== "/") {
          expandedPaths.add(subPath);
        }
      } else {
        // Path has no locale prefix, expand to all locales
        for (const loc of locales) {
          expandedPaths.add(`/${loc}${trimmed === "/" ? "" : trimmed}`);
        }
      }
    }

    for (const p of expandedPaths) {
      try {
        revalidatePath(p);
        revalidatedPaths.push(p);
      } catch (e) {
        console.error(`Failed to revalidate path "${p}":`, e);
      }
    }

    // Expand and revalidate tags (including locale-scoped tags)
    const expandedTags = new Set<string>();

    for (const rawTag of tags) {
      if (typeof rawTag !== "string" || !rawTag.trim()) continue;
      const tag = rawTag.trim();
      expandedTags.add(tag);

      // If the tag is not already locale-scoped, expand to each locale
      if (!tag.endsWith(":en") && !tag.endsWith(":ar")) {
        for (const loc of locales) {
          expandedTags.add(`${tag}:${loc}`);
        }
      }
    }

    for (const t of expandedTags) {
      try {
        revalidateTag(t);
        revalidatedTags.push(t);
      } catch (e) {
        console.error(`Failed to revalidate tag "${t}":`, e);
      }
    }

    return NextResponse.json({
      revalidated: true,
      locales,
      tags: revalidatedTags,
      paths: revalidatedPaths,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("Error in revalidate route handler:", error);
    return NextResponse.json(
      { message: "Internal Server Error during revalidation", error: error?.message },
      { status: 500 }
    );
  }
}
