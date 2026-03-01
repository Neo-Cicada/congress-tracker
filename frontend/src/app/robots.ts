import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://nexusalpha.business";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/profile/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
