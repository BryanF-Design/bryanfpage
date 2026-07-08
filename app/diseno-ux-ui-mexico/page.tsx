import { ServiceLandingPage } from "@/components/seo/service-landing-page";
import {
  createServiceMetadata,
  getServicePage,
} from "@/lib/seo/service-pages";

const page = getServicePage("diseno-ux-ui-mexico");

export const metadata = createServiceMetadata(page);

export default function DisenoUxUiMexicoPage() {
  return <ServiceLandingPage page={page} />;
}
