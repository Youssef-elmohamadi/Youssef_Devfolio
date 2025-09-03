"use client";
import { FC } from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  url: string;
  keywords?: string;
  image?: string;
  siteName?: string;
  type?: "website" | "article" | "product";
  twitterHandle?: string;
  robots?: string;
}

const SEO: FC<SEOProps> = ({
  title,
  description,
  url,
  keywords,
  image,
  siteName = "My Website",
  type = "website",
  twitterHandle,
  robots = "index, follow",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* OpenGraph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:locale" content="ar_EG" />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}
      {image && <meta name="twitter:image" content={image} />}

      {/* Favicon + viewport */}
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
};

export default SEO;
