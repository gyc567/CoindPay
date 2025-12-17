#!/bin/bash

# CoindPay Vercel 部署脚本
# 功能：自动将代码部署到 Vercel 云服务器

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# 检查 Vercel CLI 是否安装
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI 未安装。请先运行: npm install -g vercel"
    fi
    log_success "Vercel CLI 已检测到"
}

# 检查 Git 状态
check_git_status() {
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "工作目录有未提交的改动，建议先提交后再部署"
        read -p "是否继续部署？(y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "部署已取消"
        fi
    else
        log_success "Git 工作目录干净"
    fi
}

# 运行构建检查
run_build_check() {
    log_info "运行构建检查..."
    if npm run build > /dev/null 2>&1; then
        log_success "构建检查通过"
    else
        log_error "构建失败，请先修复编译错误"
    fi
}

# 获取部署环境
get_deploy_environment() {
    echo -e "\n${BLUE}选择部署环境：${NC}"
    echo "1. 生产环境 (Production)"
    echo "2. 预览环境 (Preview)"
    read -p "请选择 [1-2]: " -n 1 -r
    echo

    if [[ $REPLY == "1" ]]; then
        DEPLOY_ENV="production"
        DEPLOY_FLAG="--prod"
    elif [[ $REPLY == "2" ]]; then
        DEPLOY_ENV="preview"
        DEPLOY_FLAG=""
    else
        log_error "无效的选择"
    fi

    log_info "已选择部署环境：${YELLOW}${DEPLOY_ENV}${NC}"
}

# 执行部署
execute_deploy() {
    log_info "开始部署到 Vercel..."
    log_info "部署命令: vercel $DEPLOY_FLAG"

    if vercel $DEPLOY_FLAG; then
        log_success "部署成功！"
    else
        log_error "部署失败"
    fi
}

# 部署后信息
post_deploy_info() {
    log_info "获取部署信息..."

    echo -e "\n${GREEN}部署完成！${NC}"
    echo -e "${BLUE}后续操作：${NC}"
    echo "1. 访问 Vercel 仪表板: https://vercel.com/dashboard"
    echo "2. 查看部署日志和性能指标"
    echo "3. 配置自定义域名和环境变量"
}

# 主函数
main() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   CoindPay - Vercel 部署脚本           ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

    log_info "开始部署流程..."

    check_vercel_cli
    check_git_status
    run_build_check
    get_deploy_environment
    execute_deploy
    post_deploy_info
}

# 执行主函数
main
