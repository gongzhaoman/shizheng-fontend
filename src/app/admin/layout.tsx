import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground shadow">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">项目管理系统</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:underline">
                  前台首页
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow p-4">{children}</main>
      <footer className="bg-muted py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          项目管理系统 &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
