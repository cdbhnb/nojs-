import Navbar from "../../components/Navbar";
import PageTransition from "../../components/PageTransition";
import ResourcesBoard from "./ResourcesBoard";

export const metadata = {
  title: "资源管理 | XingHuiSama の 博客控制台",
  description: "资源导航与工具站管理",
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
