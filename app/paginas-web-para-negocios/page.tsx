import { ServiceLandingPage } from "@/components/seo/service-landing-page";
import {
  createServiceMetadata,
  getServicePage,
} from "@/lib/seo/service-pages";

const page = getServicePage("paginas-web-para-negocios");

export const metadata = createServiceMetadata(page);

export default function PaginasWebParaNegociosPage() {
  return <ServiceLandingPage page={page} />;
}
