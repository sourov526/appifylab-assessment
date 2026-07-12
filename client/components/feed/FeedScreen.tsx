import Script from "next/script";
import { FeedMarkup } from "@/components/feed/FeedMarkup";

const notifyScript = `
  const notifyDropdown = document.querySelector("#_notify_drop");
  const notifyDropShowBtn = document.querySelector("#_notify_btn");
  let isDropShow1 = false;

  if (notifyDropdown && notifyDropShowBtn) {
    notifyDropShowBtn.addEventListener("click", function () {
      isDropShow1 = !isDropShow1;

      if (isDropShow1) {
        notifyDropdown.classList.add("show");
      } else {
        notifyDropdown.classList.remove("show");
      }
    });
  }
`;

export function FeedScreen() {
  return (
    <>
      <FeedMarkup />
      <Script src="/assets/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/custom.js" strategy="afterInteractive" />
      <Script id="feed-notify-script" strategy="afterInteractive">
        {notifyScript}
      </Script>
    </>
  );
}
