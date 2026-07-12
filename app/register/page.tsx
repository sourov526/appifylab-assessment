import { getPageMarkup } from "../../lib/get-page-markup";

export default function RegisterPage() {
  return <main dangerouslySetInnerHTML={{ __html: getPageMarkup("register") }} />;
}
