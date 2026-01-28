import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.tsc.works";
    const currentDate = new Date();

    const routes = [
        "",
        "#ve-chung-toi",
        "#gia-tri",
        "#lo-trinh",
        "#dich-vu",
        "#portfolio",
        "#to-chuc",
        "#ung-tuyen",
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route.startsWith("#") ? "/" + route : route}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
    }));
}
