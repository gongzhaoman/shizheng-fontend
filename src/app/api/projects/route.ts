// import { NextRequest, NextResponse } from 'next/server';
// import { getProjects } from '@/lib/mock-data';

// export async function GET(request: NextRequest) {
//   // 从URL获取查询参数
//   const searchParams = request.nextUrl.searchParams;
//   const page = parseInt(searchParams.get('page') || '1');
//   const pageSize = parseInt(searchParams.get('pageSize') || '20');
//   const keyword = searchParams.get('keyword') || '';

//   // 获取项目数据
//   const result = getProjects(page, pageSize, keyword);

//   // 返回JSON响应
//   return NextResponse.json(result);
// }
