import ExcelUploader from '@/components/admin/excel-uploader';

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">项目管理后台</h1>

      <div className="grid gap-6">
        <div className="border rounded-lg shadow-sm bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Excel 数据导入</h2>
          <ExcelUploader />
        </div>
      </div>
    </div>
  );
}
