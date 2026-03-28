import { Layout } from "@/components/layout/Layout";

export default function MissionControl() {
  return (
    <Layout showSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Mission Control</h1>
        <p className="text-muted-foreground">User management, analytics, GDPR & EU AI Act compliance.</p>
      </div>
    </Layout>
  );
}
