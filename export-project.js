const fs = require('fs');
const path = require('path');

// ========== 配置区 ==========

/** 输出的 Markdown 文件名 */
const OUTPUT_FILE = 'project-export.md';

/** 要扫描的项目目录（可自由增减） */
const PROJECTS = [
    { name: '前端项目 (fronted_demo)', dir: 'fronted_demo' },
    { name: '后端项目 (backend_demo)', dir: 'backend_demo' },
];

/** 要排除的目录 */
const EXCLUDE_DIRS = [
    'node_modules', '.git', 'dist', '.angular', '.vscode',
    '.idea', 'coverage', 'tmp', 'e2e', '.firebase',
    '.sandbox', '__pycache__', 'assets'
];

/** 要排除的文件 */
const EXCLUDE_FILES = [
    'package-lock.json', 'yarn.lock', '.DS_Store',
    'Thumbs.db', OUTPUT_FILE
];

/** 前端项目要提取代码的文件扩展名 */
const FRONTEND_CODE_EXTENSIONS = [
    '.ts', '.html', '.css', '.scss', '.less',
    '.js', '.json', '.yaml', '.yml'
];

/** 后端项目要提取代码的文件扩展名 */
const BACKEND_CODE_EXTENSIONS = [
    '.ts', '.js', '.json', '.yaml', '.yml',
    '.html', '.css', '.env', '.cfg'
];

// ========== 工具函数 ==========

/**
 * 判断是否应该排除该路径
 * @param {string} name - 文件或目录名
 * @param {boolean} isDir - 是否为目录
 * @returns {boolean}
 */
function shouldExclude(name, isDir) {
    if (isDir) return EXCLUDE_DIRS.includes(name);
    return EXCLUDE_FILES.includes(name);
}

/**
 * 判断文件是否为代码文件
 * @param {string} fileName
 * @param {string[]} extensions - 允许的扩展名列表
 * @returns {boolean}
 */
function isCodeFile(fileName, extensions) {
    const ext = path.extname(fileName).toLowerCase();
    return extensions.includes(ext);
}

/**
 * 根据文件扩展名返回 Markdown 代码块语言标识
 * @param {string} fileName
 * @returns {string}
 */
function getLanguage(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const langMap = {
        '.ts': 'typescript',
        '.js': 'javascript',
        '.html': 'html',
        '.css': 'css',
        '.scss': 'scss',
        '.less': 'less',
        '.json': 'json',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.md': 'markdown',
        '.txt': 'text',
        '.env': 'bash',
        '.cfg': 'ini',
    };
    return langMap[ext] || 'text';
}

// ========== 核心功能 ==========

/**
 * 生成目录树
 * @param {string} dirPath - 目录路径
 * @param {string} prefix - 缩进前缀
 * @returns {string}
 */
function generateTree(dirPath, prefix = '') {
    let tree = '';

    if (!fs.existsSync(dirPath)) {
        return `${prefix}⚠️ 目录不存在\n`;
    }

    const items = fs.readdirSync(dirPath).sort((a, b) => {
        const aIsDir = fs.statSync(path.join(dirPath, a)).isDirectory();
        const bIsDir = fs.statSync(path.join(dirPath, b)).isDirectory();
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.localeCompare(b);
    });

    const filtered = items.filter(item => {
        const fullPath = path.join(dirPath, item);
        const isDir = fs.statSync(fullPath).isDirectory();
        return !shouldExclude(item, isDir);
    });

    filtered.forEach((item, index) => {
        const fullPath = path.join(dirPath, item);
        const isDir = fs.statSync(fullPath).isDirectory();
        const isLast = index === filtered.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const newPrefix = isLast ? prefix + '    ' : prefix + '│   ';

        tree += `${prefix}${connector}${item}\n`;

        if (isDir) {
            tree += generateTree(fullPath, newPrefix);
        }
    });

    return tree;
}

/**
 * 收集所有代码文件
 * @param {string} dirPath - 目录路径
 * @param {string[]} extensions - 允许的扩展名
 * @param {string[]} fileList - 文件路径列表
 * @returns {string[]}
 */
function collectCodeFiles(dirPath, extensions, fileList = []) {
    if (!fs.existsSync(dirPath)) return fileList;

    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const isDir = fs.statSync(fullPath).isDirectory();

        if (shouldExclude(item, isDir)) return;

        if (isDir) {
            collectCodeFiles(fullPath, extensions, fileList);
        } else if (isCodeFile(item, extensions)) {
            fileList.push(fullPath);
        }
    });

    return fileList;
}

/**
 * 生成代码内容区块
 * @param {string[]} files - 文件路径列表
 * @param {string} rootDir - 项目根目录
 * @returns {string}
 */
function generateCodeBlocks(files, rootDir) {
    let content = '';

    files.forEach(filePath => {
        const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
        const lang = getLanguage(filePath);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        content += `### 📄 \`${relativePath}\`\n\n`;
        content += `\`\`\`${lang}\n`;
        content += fileContent;
        if (!fileContent.endsWith('\n')) content += '\n';
        content += `\`\`\`\n\n`;
        content += `---\n\n`;
    });

    return content;
}

// ========== 主函数 ==========

function main() {
    const rootDir = process.cwd();

    console.log('🚀 开始导出前后端项目...\n');

    let markdown = '';

    // 标题
    markdown += `# 前后端项目导出\n\n`;
    markdown += `> 导出时间: ${new Date().toLocaleString()}\n\n`;

    let totalFiles = 0;

    // 遍历每个项目
    PROJECTS.forEach((project, projectIndex) => {
        const projectDir = path.join(rootDir, project.dir);
        const projectNum = projectIndex + 1;

        console.log(`\n${'='.repeat(50)}`);
        console.log(`📂 处理项目 ${projectNum}: ${project.name}`);
        console.log(`📁 路径: ${projectDir}`);

        // 检查目录是否存在
        if (!fs.existsSync(projectDir)) {
            console.log(`⚠️  目录不存在，跳过！`);
            markdown += `---\n\n`;
            markdown += `## 项目 ${projectNum}: ${project.name}\n\n`;
            markdown += `> ⚠️ 目录 \`${project.dir}\` 不存在，已跳过\n\n`;
            return;
        }

        // 根据项目类型选择扩展名
        const extensions = project.dir.toLowerCase().includes('front')
            ? FRONTEND_CODE_EXTENSIONS
            : BACKEND_CODE_EXTENSIONS;

        // ---- 一、项目结构 ----
        console.log('  🔍 生成目录树...');
        const tree = generateTree(projectDir);

        // ---- 二、收集代码 ----
        console.log('  📝 收集代码文件...');
        const codeFiles = collectCodeFiles(projectDir, extensions);
        console.log(`  📊 找到 ${codeFiles.length} 个代码文件`);
        totalFiles += codeFiles.length;

        // ---- 组装 Markdown ----
        markdown += `---\n\n`;
        markdown += `## 项目 ${projectNum}: ${project.name}\n\n`;

        // 结构
        markdown += `### 一、项目结构\n\n`;
        markdown += `\`\`\`\n`;
        markdown += `${project.dir}/\n`;
        markdown += tree;
        markdown += `\`\`\`\n\n`;

        // 代码
        markdown += `### 二、项目代码\n\n`;
        markdown += `共 ${codeFiles.length} 个文件\n\n`;
        markdown += generateCodeBlocks(codeFiles, projectDir);
    });

    // 写入文件
    const outputPath = path.join(rootDir, OUTPUT_FILE);
    fs.writeFileSync(outputPath, markdown, 'utf-8');

    console.log(`\n${'='.repeat(50)}`);
    console.log(`\n✅ 全部导出完成！`);
    console.log(`📄 输出文件: ${outputPath}`);
    console.log(`📊 文件大小: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
    console.log(`📁 总计 ${PROJECTS.length} 个项目，${totalFiles} 个代码文件`);
}

main();
