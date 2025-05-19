'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Check, AlertCircle } from 'lucide-react';

export default function ExcelUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<{
    added: number;
    updated: number;
    total: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setUploadStatus('idle');
    setMessage('');
    setStats(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('请先选择要上传的Excel文件');
      setUploadStatus('error');
      return;
    }

    // 检查文件类型
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage('请上传有效的Excel文件 (.xls or .xlsx)');
      setUploadStatus('error');
      return;
    }

    setUploading(true);
    setMessage('正在上传并处理数据...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        process.env.NODE_ENV === 'production'
          ? '/api/admin/upload'
          : 'http://localhost:3001/api/admin/upload',
        {
          method: 'POST',
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '上传失败');
      }

      setUploadStatus('success');
      setMessage('数据导入成功!');
      setStats(result.stats);
    } catch (error) {
      console.error('上传错误:', error);
      setUploadStatus('error');
      setMessage(error instanceof Error ? error.message : '上传过程中出现错误');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
        <Input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          className="hidden"
          id="excel-file"
        />
        <label htmlFor="excel-file" className="block cursor-pointer mb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-base mb-1">点击选择或拖放文件</p>
          <p className="text-sm text-muted-foreground">
            支持 .xlsx 和 .xls 格式
          </p>
        </label>

        {file && (
          <div className="text-sm bg-muted inline-block px-3 py-1 rounded">
            已选择: {file.name}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex items-center gap-2"
        >
          {uploading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-current animate-spin"></div>
              处理中...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              上传并导入数据
            </>
          )}
        </Button>

        {uploadStatus !== 'idle' && (
          <div
            className={`flex items-center gap-2 text-sm ${
              uploadStatus === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {uploadStatus === 'success' ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {message}
          </div>
        )}
      </div>

      {stats && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">导入结果:</h3>
          <ul className="space-y-1 text-sm">
            <li>总处理记录: {stats.total}</li>
            <li>新增记录: {stats.added}</li>
            <li>更新记录: {stats.updated}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
