import ProjectList from '@/components/project-list';

export default function Home() {
  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">基础设施项目列表</h1>
      <ProjectList />
    </div>
  );
}
