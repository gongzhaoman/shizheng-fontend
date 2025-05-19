export interface Project {
  id: number;
  name: string;
}

// 模拟10000条基础设施项目数据
const generateMockProjects = (): Project[] => {
  const projectTypes = [
    '道路改建工程',
    '人行天桥新建工程',
    '公路升级工程',
    '桥梁维修工程',
    '隧道建设工程',
    '排水设施改造工程',
    '公交站台建设工程',
    '交通信号灯安装工程',
    '城市绿化工程',
    '管网改造工程',
  ];

  const locations = [
    '综合大道西延长线',
    '钟祥市安陆府路',
    '东湖高新区光谷大道',
    '武汉市江汉路',
    '荆州市沙市区',
    '十堰市茅箭区',
    '宜昌市夷陵区',
    '襄阳市樊城区',
    '黄石市下陆区',
    '鄂州市鄂城区',
    '孝感市孝南区',
    '黄冈市黄州区',
    '咸宁市咸安区',
    '随州市曾都区',
    '恩施市',
    '仙桃市',
    '潜江市',
    '天门市',
    '神农架林区',
  ];

  const projects: Project[] = [];

  // 常规项目数据
  for (let i = 1; i <= 10000; i++) {
    const locationIndex = Math.floor(Math.random() * locations.length);
    const typeIndex = Math.floor(Math.random() * projectTypes.length);

    projects.push({
      id: i,
      name: `${locations[locationIndex]}${projectTypes[typeIndex]}`,
    });
  }

  // 添加特殊测试数据 - 用于生成1-7页的测试结果
  // 这些项目都以"测试X页"关键词标记

  // 测试1页 - 15条数据（不满一页）
  for (let i = 1; i <= 15; i++) {
    projects.push({
      id: 20000 + i,
      name: `测试1页 样例项目${i}号`,
    });
  }

  // 测试2页 - 30条数据（刚好1.5页）
  for (let i = 1; i <= 30; i++) {
    projects.push({
      id: 21000 + i,
      name: `测试2页 样例项目${i}号`,
    });
  }

  // 测试3页 - 50条数据（刚好2.5页）
  for (let i = 1; i <= 50; i++) {
    projects.push({
      id: 22000 + i,
      name: `测试3页 样例项目${i}号`,
    });
  }

  // 测试4页 - 70条数据（刚好3.5页）
  for (let i = 1; i <= 70; i++) {
    projects.push({
      id: 23000 + i,
      name: `测试4页 样例项目${i}号`,
    });
  }

  // 测试5页 - 90条数据（刚好4.5页）
  for (let i = 1; i <= 90; i++) {
    projects.push({
      id: 24000 + i,
      name: `测试5页 样例项目${i}号`,
    });
  }

  // 测试6页 - 110条数据（刚好5.5页）
  for (let i = 1; i <= 110; i++) {
    projects.push({
      id: 25000 + i,
      name: `测试6页 样例项目${i}号`,
    });
  }

  // 测试7页 - 130条数据（刚好6.5页）
  for (let i = 1; i <= 130; i++) {
    projects.push({
      id: 26000 + i,
      name: `测试7页 样例项目${i}号`,
    });
  }

  return projects;
};

// 预生成项目数据
const allProjects = generateMockProjects();

// 分页和搜索函数
export const getProjects = (
  page: number = 1,
  pageSize: number = 20,
  keyword: string = '',
) => {
  let filteredProjects = [...allProjects];

  // 如果有关键词，过滤数据
  if (keyword) {
    filteredProjects = filteredProjects.filter((project) =>
      project.name.toLowerCase().includes(keyword.toLowerCase()),
    );
  }

  // 计算总页数
  const totalCount = filteredProjects.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 获取当前页数据
  const startIndex = (page - 1) * pageSize;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + pageSize,
  );

  return {
    data: paginatedProjects,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
    },
  };
};
