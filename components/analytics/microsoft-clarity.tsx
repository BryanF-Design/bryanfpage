import { CLARITY_PROJECT_ID } from "@/lib/analytics";

/** Snippet oficial de Microsoft Clarity, en el <head> del HTML del servidor. */
export function MicrosoftClarity() {
  return (
    <script
      id="microsoft-clarity-init"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
`,
      }}
    />
  );
}
