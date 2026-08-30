import "./styles.css";
import { hubPageHtml, redirectLegacyHash } from "./demos/nav";

if (redirectLegacyHash()) {
  /* Navigating to a real variant page. */
} else {
  const appEl = document.querySelector("#app");
  if (!appEl) throw new Error("#app missing");
  appEl.innerHTML = hubPageHtml();
}
