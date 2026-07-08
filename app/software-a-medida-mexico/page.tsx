import { ServiceLandingPage } from "@/components/seo/service-landing-page";
import {
  createServiceMetadata,
  getServicePage,
} from "@/lib/seo/service-pages";

const page = getServicePage("software-a-medida-mexico");

export const metadata = createServiceMetadata(page);

export default function SoftwareAMedidaMexicoPage() {
  return <ServiceLandingPage page={page} />;
}
