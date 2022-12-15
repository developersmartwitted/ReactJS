import App from "./app";
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import "#styles/tailwind.css";
import { SVGDefs } from "#components/fragments/svg-defs";
import {
  createTranslationContext,
  dictionary,
  TranslationContextProvider,
} from "./translations";
import { ModalContainer } from "#components/fragments/modal";

const container = document.querySelector("#root");
const i18nContext = createTranslationContext(dictionary, "en");

if (container) {
  render(
    () => (
      <Router>
        <TranslationContextProvider value={i18nContext}>
          <ModalContainer>
            <div class="relative flex min-h-full md:h-full">
              <SVGDefs />
              <div class="flex-1 overflow-hidden">
                <App />
              </div>
            </div>
          </ModalContainer>
        </TranslationContextProvider>
      </Router>
    ),
    container
  );
}
