import { Layout } from "@/components/layout/Layout";

export default function Admin() {
  return (
    <Layout showSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Platform administration. Admin access only.</p>
      </div>
    </Layout>
  );
}
