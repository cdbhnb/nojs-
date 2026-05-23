import Navbar from "../../components/Navbar";
import PageTransition from "../../components/PageTransition";
import ResourcesBoard from "./ResourcesBoard";
import { siteConfig } from "../../siteConfig";

export const metadata = {
  title: "资源导航 | " + siteConfig.title,
  description: "常用网站、工具站、资源站、AI 工具、设计工具与开发工具导航",
};

export default function ResourcesPage() {
  return (
    <div className="relative min-h-screen pb-20">
      <Navbar />
      <PageTransition>
        <div className="mt-28">
          <ResourcesBoard />
        </div>
      </PageTransition>
    </div>
  );
}
