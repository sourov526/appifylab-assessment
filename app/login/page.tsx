import { getPageMarkup } from "../../lib/get-page-markup";

export default function LoginPage() {
  return <main dangerouslySetInnerHTML={{ __html: getPageMarkup("login") }} />;
}
