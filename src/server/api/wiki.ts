import { serialize } from "next-mdx-remote/serialize";
import { readdir, readFile } from "fs/promises";
import path from "path";

export type WikiPages = Record<
  string,
  {
    slug: string;
    title: string;
  }[]
>;

export const getWikiPages = async (): Promise<WikiPages> => {
  const slugs = await wikiSlugs();

  const parsedFrontmatters = await Promise.all(
    slugs.map(async (slug) => {
      const contents = await getWikiPageContents(slug);
      // Extract the frontmatter
      const frontmatterRaw =
        contents.match(/^(---[\s\S]*?---)/)?.[1]?.trim() ?? "";
      // Parse the frontmatter
      const { frontmatter } = await serialize(frontmatterRaw, {
        parseFrontmatter: true,
      });

      return { slug, frontmatter };
    }),
  );

  return parsedFrontmatters.reduce(
    (acc, { slug, frontmatter }) => {
      const { title, category } = frontmatter as {
        title: string;
        category: string;
      };
      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push({ slug, title });

      return acc;
    },
    {} as Record<string, { slug: string; title: string }[]>,
  );
};

export const getWikiPageContents = async (slug: string) =>
  readFile(path.join(process.cwd(), "wiki", slug), "utf-8");

export const wikiSlugs = async () => {
  const files = await readdir(path.join(process.cwd(), "wiki"));
  return files.filter((file) => file.endsWith(".mdx"));
};

export const serializeWikiPage = async (slug: string) => {
  const rawSource = await getWikiPageContents(slug);
  return await serialize(rawSource, { parseFrontmatter: true });
};
