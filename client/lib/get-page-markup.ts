import fs from "node:fs";
import path from "node:path";

const contentDirectory = path.join(process.cwd(), "components", "shared", "content");

export function getPageMarkup(name: string): string {
  return fs.readFileSync(path.join(contentDirectory, `${name}.html`), "utf8");
}
