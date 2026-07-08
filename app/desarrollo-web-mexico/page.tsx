import { ServiceLandingPage } from "@/components/seo/service-landing-page";
import {
  createServiceMetadata,
  getServicePage,
} from "@/lib/seo/service-pages";

const page = getServicePage("desarrollo-web-mexico");

export const metadata = createServiceMetadata(page);

export default function DesarrolloWebMexicoPage() {
  return <ServiceLandingPage page={page} />;
}
