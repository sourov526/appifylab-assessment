import { getPageMarkup } from "@/lib/get-page-markup";

type StaticPageMarkupProps = {
  pageName: "feed" | "login" | "register";
};

export function StaticPageMarkup({ pageName }: StaticPageMarkupProps) {
  return <main dangerouslySetInnerHTML={{ __html: getPageMarkup(pageName) }} />;
}
