#!/bin/bash

# CoindPay Vercel 完整部署脚本 - 包含环境变量配置和故障排查
# 这个脚本提供了比 deploy.sh 更多的功能和诊断能力

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    exit 1
}

log_debug() {
    echo -e "${PURPLE}[DEBUG]${NC} $1"
}

log_section() {
    echo -e "\n${CYAN}════ $1 ════${NC}\n"
}

# 检查 CLI 工具
check_cli_tools() {
    log_section "检查 CLI 工具"

    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI 未安装。请运行: npm install -g vercel"
    fi
    log_success "✓ Vercel CLI 已检测到"

    if ! command -v git &> /dev/null; then
        log_error "Git 未安装"
    fi
    log_success "✓ Git 已检测到"

    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装"
    fi
    log_success "✓ Node.js 已检测到"
}

# 检查环境变量配置
check_env_vars() {
    log_section "检查环境变量配置"

    local missing_vars=()
    local required_vars=(
        "NEXT_PUBLIC_WALLET_CONNECT_ID"
        "NEXT_PUBLIC_ALCHEMY_ID"
        "API_JWT_SECRET"
    )

    for var in "${required_vars[@]}"; do
        if [ -f .env.local ]; then
            if ! grep -q "^$var=" .env.local 2>/dev/null; then
                missing_vars+=("$var")
            fi
        else
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -gt 0 ]; then
        log_warning "以下环境变量可能未配置:"
        for var in "${missing_vars[@]}"; do
            echo -e "  ${YELLOW}•${NC} $var"
        done
        echo -e "\n${YELLOW}建议：${NC} 在 Vercel 仪表板配置这些环境变量"
        echo "  访问: https://vercel.com/dashboard/[YOUR_PROJECT]/settings/environment-variables"
    else
        log_success "✓ 关键环境变量已配置"
    fi
}

# 检查 Git 状态
check_git_status() {
    log_section "检查 Git 状态"

    if [ -n "$(git status --porcelain)" ]; then
        log_warning "工作目录有未提交的改动"
        git status --short
        read -p "是否继续部署？(y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "部署已取消"
        fi
    else
        log_success "✓ Git 工作目录干净"
    fi

    local branch=$(git branch --show-current)
    log_info "当前分支: ${CYAN}${branch}${NC}"
}

# 运行本地构建检查
run_build_check() {
    log_section "运行本地构建检查"

    log_info "执行: npm run build"
    if npm run build > /tmp/coindpay-build.log 2>&1; then
        log_success "✓ 构建检查通过"
    else
        log_error "构建失败。查看详细日志:"
        tail -50 /tmp/coindpay-build.log
    fi
}

# 显示 Vercel 项目信息
show_vercel_project_info() {
    log_section "Vercel 项目信息"

    if [ -f .vercel/project.json ]; then
        log_info "项目配置:"
        cat .vercel/project.json | grep -o '"projectName":"[^"]*"' | cut -d'"' -f4 | xargs log_debug "项目名称:"
    fi
}

# 选择部署环境
select_deploy_environment() {
    log_section "选择部署环境"

    echo "1. ${YELLOW}预览环境${NC} (Preview) - 每个分支推送都会创建新的预览 URL"
    echo "2. ${GREEN}生产环境${NC} (Production) - 生产环境部署，只有 master/main 分支"
    echo ""
    read -p "请选择 [1-2]: " -n 1 -r
    echo

    if [[ $REPLY == "1" ]]; then
        DEPLOY_ENV="preview"
        DEPLOY_FLAG=""
        log_info "已选择: ${YELLOW}预览环境${NC}"
    elif [[ $REPLY == "2" ]]; then
        DEPLOY_ENV="production"
        DEPLOY_FLAG="--prod"
        log_info "已选择: ${GREEN}生产环境${NC}"
    else
        log_error "无效的选择"
    fi
}

# 显示部署前的确认
pre_deploy_confirmation() {
    log_section "部署确认"

    echo -e "${CYAN}即将部署：${NC}"
    echo "  • 项目: CoindPay"
    echo "  • 环境: ${DEPLOY_ENV}"
    echo "  • 分支: $(git branch --show-current)"
    echo "  • 最新提交: $(git log -1 --oneline)"
    echo ""
    read -p "确认部署？(y/n) " -n 1 -r
    echo

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "部署已取消"
    fi
}

# 执行部署
execute_deploy() {
    log_section "执行 Vercel 部署"

    log_info "运行命令: vercel $DEPLOY_FLAG --yes"
    echo ""

    if vercel $DEPLOY_FLAG --yes; then
        log_success "✓ 部署成功！"
        DEPLOY_SUCCESS=true
    else
        log_error "部署失败"
    fi
}

# 部署后信息
post_deploy_info() {
    log_section "部署完成"

    if [ "$DEPLOY_SUCCESS" = true ]; then
        log_success "部署已完成！"
        echo ""
        echo -e "${CYAN}后续操作：${NC}"
        echo "  1. 查看部署仪表板: https://vercel.com/dashboard"
        echo "  2. 监控部署日志: https://vercel.com/dashboard/coind-pay/deployments"
        echo "  3. 配置环境变量: https://vercel.com/dashboard/coind-pay/settings/environment-variables"
        echo "  4. 设置自定义域名: https://vercel.com/dashboard/coind-pay/settings/domains"
        echo ""
        echo -e "${CYAN}预览 URL：${NC}"
        echo "  $(vercel ls --prod 2>/dev/null | head -2 | tail -1 || echo '点击上述链接查看')"
    fi
}

# 故障排查帮助
troubleshoot_help() {
    log_section "故障排查指南"

    cat << 'EOF'
常见问题和解决方案：

1. 构建失败：Command "npm run build" exited with 1
   ✓ 检查环境变量是否完整
   ✓ 检查 Node.js 版本兼容性
   ✓ 在本地运行 npm run build 测试

2. 缺少环境变量
   ✓ 在 Vercel 仪表板 Settings → Environment Variables 中配置
   ✓ 必需变量: NEXT_PUBLIC_WALLET_CONNECT_ID, NEXT_PUBLIC_ALCHEMY_ID, API_JWT_SECRET
   ✓ 参考 .env.example 了解所有可用变量

3. 部署后页面空白
   ✓ 检查浏览器控制台错误信息
   ✓ 检查 Vercel 函数日志
   ✓ 确保环境变量已应用（可能需要重新部署）

4. 权限错误
   ✓ 运行: vercel login
   ✓ 确保有权限访问该项目
   ✓ 检查 .vercel/project.json 配置

获取更多帮助：
  • Vercel 文档: https://vercel.com/docs
  • Next.js 部署: https://nextjs.org/learn/basics/deploying-nextjs-app
  • 查看完整构建日志: https://vercel.com/dashboard/coind-pay/deployments
EOF
}

# 主函数
main() {
    echo -e "${BLUE}"
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 CoindPay - Vercel 完整部署脚本                        ║
║                                                              ║
║   这个脚本将帮助您部署应用到 Vercel 云服务器              ║
║   支持环境变量检查、构建验证、故障诊断                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
    echo -ne "${NC}"

    check_cli_tools
    check_git_status
    check_env_vars
    show_vercel_project_info

    # 询问是否运行完整检查
    echo ""
    read -p "是否运行完整的本地构建检查？(这可能需要几分钟) (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_build_check
    fi

    select_deploy_environment
    pre_deploy_confirmation
    execute_deploy
    post_deploy_info

    # 询问是否显示故障排查信息
    echo ""
    read -p "是否显示故障排查指南？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        troubleshoot_help
    fi
}

# 处理脚本中断
trap 'log_error "脚本被中断"; exit 130' INT TERM

# 执行主函数
main
