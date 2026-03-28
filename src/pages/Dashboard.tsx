import { Layout } from "@/components/layout/Layout";

export default function Dashboard() {
  return (
    <Layout showSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to ASSAON. Your workspace is ready.</p>
      </div>
    </Layout>
  );
}
