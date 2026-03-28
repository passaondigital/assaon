import { Layout } from "@/components/layout/Layout";

export default function SettingsPage() {
  return (
    <Layout showSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Account and workspace settings.</p>
      </div>
    </Layout>
  );
}
