import { ServiceLandingPage } from "@/components/seo/service-landing-page";
import {
  createServiceMetadata,
  getServicePage,
} from "@/lib/seo/service-pages";

const page = getServicePage("diseno-web-mexico");

export const metadata = createServiceMetadata(page);

export default function DisenoWebMexicoPage() {
  return <ServiceLandingPage page={page} />;
}
