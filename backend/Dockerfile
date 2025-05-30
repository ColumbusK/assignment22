# 使用 Node.js 官方轻量镜像
FROM node:18-alpine

# 创建工作目录
WORKDIR /app

# 拷贝 package 文件并安装依赖
COPY package*.json ./
RUN npm install

# 拷贝项目源码
COPY . .

# 暴露端口
EXPOSE 8000

# 设置环境变量（可选，用于配置）
ENV NODE_ENV=production
ENV API_BASE_URL=/api


# 启动服务
CMD ["node", "src/index.js"]
