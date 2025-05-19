'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, X } from 'lucide-react';

interface Project {
  id: number;
  name: string;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
  });
  const [keyword, setKeyword] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 获取数据函数
  const fetchProjects = useCallback(
    async (page: number, searchTerm: string) => {
      if (searchTerm.trim().length === 0 && page === 1) {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:3001/api/projects?page=1&pageSize=20`,
          );
          const data = await response.json();
          setProjects(data.data);
          setPagination(data.pagination);
          setKeyword('');
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (searchTerm.trim().length > 0 && searchTerm.trim().length < 2) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/api/projects?page=${page}&pageSize=20&keyword=${encodeURIComponent(searchTerm)}`,
        );
        const data = await response.json();
        setProjects(data.data);
        setPagination(data.pagination);
        setKeyword(searchTerm);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 首次加载获取数据
  useEffect(() => {
    fetchProjects(1, '');
  }, [fetchProjects]);

  // 页面变化时获取数据
  const handlePageChange = (page: number) => {
    fetchProjects(page, keyword);
  };

  // 处理搜索变化
  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    if (isComposing) return;

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchProjects(1, value);
    }, 600);
  };

  // 清空搜索框
  const handleClearSearch = () => {
    setSearchValue('');
    setKeyword('');
    fetchProjects(1, '');
    // 聚焦输入框
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 处理输入法事件
  const handleCompositionStart = () => {
    setIsComposing(true);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLInputElement>,
  ) => {
    setIsComposing(false);
    const value = e.currentTarget.value;
    setSearchValue(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchProjects(1, value);
    }, 600);
  };

  // 手动搜索
  const handleSearchClick = () => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    fetchProjects(1, searchValue);
  };

  // 处理回车键搜索
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      fetchProjects(1, searchValue);
    }
  };

  // 渲染分页链接
  const renderPaginationLinks = () => {
    const { page, totalPages } = pagination;
    const paginationItems = [];

    // 对于总页数<=7的情况，直接显示所有页码，不使用省略号
    if (totalPages <= 7) {
      // 显示从1到totalPages的所有页码
      for (let i = 1; i <= 7; i++) {
        if (i <= totalPages) {
          // 显示实际页码
          paginationItems.push(
            <PaginationItem key={`page-${i}`} className="w-9">
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(i);
                }}
                isActive={page === i}
                className="w-9 justify-center"
              >
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        } else {
          // 超出实际页数的位置用透明占位符填充
          paginationItems.push(
            <PaginationItem key={`empty-${i}`} className="w-9">
              <span className="flex h-9 w-9 items-center justify-center opacity-0">
                {i}
              </span>
            </PaginationItem>,
          );
        }
      }
    } else {
      // 对于总页数>7的情况，使用动态显示逻辑

      // 1. 首页按钮
      paginationItems.push(
        <PaginationItem key="page-1" className="w-9">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
            isActive={page === 1}
            className="w-9 justify-center"
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      // 2. 第二个位置：第2页或省略号
      if (page <= 4) {
        // 靠近首页时显示第2页
        paginationItems.push(
          <PaginationItem key="page-2" className="w-9">
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(2);
              }}
              isActive={page === 2}
              className="w-9 justify-center"
            >
              2
            </PaginationLink>
          </PaginationItem>,
        );
      } else {
        // 否则显示省略号
        paginationItems.push(
          <PaginationItem key="ellipsis-start" className="w-9">
            <span className="flex h-9 w-9 items-center justify-center">
              ...
            </span>
          </PaginationItem>,
        );
      }

      // 3. 中间3个页码位置
      let middleStart;

      if (page <= 3) {
        middleStart = 3;
      } else if (page >= totalPages - 2) {
        middleStart = totalPages - 4;
      } else {
        middleStart = page - 1;
      }

      // 生成3个中间页码位置
      for (let i = 0; i < 3; i++) {
        const pageNumber = middleStart + i;
        paginationItems.push(
          <PaginationItem key={`page-middle-${i}`} className="w-9">
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(pageNumber);
              }}
              isActive={page === pageNumber}
              className="w-9 justify-center"
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      // 4. 倒数第二页位置：省略号或倒数第二页
      if (page >= totalPages - 3) {
        // 靠近尾页时显示倒数第二页
        paginationItems.push(
          <PaginationItem key="page-last-1" className="w-9">
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPages - 1);
              }}
              isActive={page === totalPages - 1}
              className="w-9 justify-center"
            >
              {totalPages - 1}
            </PaginationLink>
          </PaginationItem>,
        );
      } else {
        // 否则显示省略号
        paginationItems.push(
          <PaginationItem key="ellipsis-end" className="w-9">
            <span className="flex h-9 w-9 items-center justify-center">
              ...
            </span>
          </PaginationItem>,
        );
      }

      // 5. 最后一页位置
      paginationItems.push(
        <PaginationItem key="page-last" className="w-9">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
            isActive={page === totalPages}
            className="w-9 justify-center"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return paginationItems;
  };

  return (
    <div className="border rounded-lg shadow-sm bg-card">
      <div className="p-4 border-b flex items-center gap-4">
        <div className="relative flex-1">
          <div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
            onClick={handleSearchClick}
          >
            <Search className="h-4 w-4" />
          </div>
          <Input
            ref={inputRef}
            placeholder="输入关键词搜索项目..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary/20"
            style={{ boxShadow: 'none' }}
            title="输入至少2个字符开始搜索"
          />
          {searchValue && (
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
              onClick={handleClearSearch}
              title="清空搜索"
            >
              <div className="bg-muted rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors">
                <X className="h-3.5 w-3.5" />
              </div>
            </div>
          )}
          {loading && !searchValue && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-blue-500 animate-spin"></div>
            </div>
          )}
        </div>
        {keyword && (
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            共找到: {pagination.totalCount} 条记录
          </div>
        )}
      </div>

      <div className="h-[calc(100vh-300px)] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-muted z-10">
            <TableRow>
              <TableHead className="w-24">ID</TableHead>
              <TableHead>项目名称</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // 骨架屏加载效果
              <>
                {[...Array(8)].map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className="animate-pulse">
                    <TableCell>
                      <div className="h-5 w-16 bg-muted rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 bg-muted rounded w-4/5"></div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-10">
                  没有找到数据
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t">
        <Pagination className="mt-0">
          <PaginationContent className="flex-wrap">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.page > 1) {
                    handlePageChange(pagination.page - 1);
                  }
                }}
                className={
                  pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>

            <div className="flex">{renderPaginationLinks()}</div>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.page < pagination.totalPages) {
                    handlePageChange(pagination.page + 1);
                  }
                }}
                className={
                  pagination.page >= pagination.totalPages
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
