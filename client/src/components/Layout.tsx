import { Sidebar } from "@components/sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      <div className='h-full'>{children}</div>
    </Sidebar>
  );
}
