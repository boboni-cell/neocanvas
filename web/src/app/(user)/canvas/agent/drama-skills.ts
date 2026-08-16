import type { CanvasAgentPhase } from "../types";
import { skills as builtinSkillCatalog } from "@/data/skills";

type BuiltinSkillRoute = {
    slug: string;
    label: string;
    path: string;
    keywords: RegExp;
};

const SD25_SLUG = "sd-2-5-prompt";

const AUTO_ROUTES: BuiltinSkillRoute[] = [
    // 短剧创作套件
    { slug: "short-drama", label: "短剧总控", path: "/drama-skills/short-drama/SKILL.md", keywords: /短剧|漫剧|drama|短剧技能|初始化短剧|继续项目|交付包/i },
    { slug: "short-drama-novel-analyze", label: "原著改编分析", path: "/drama-skills/short-drama-novel-analyze/SKILL.md", keywords: /原著|小说|改编价值|快评|章节索引|抽样|值得拆/i },
    { slug: "short-drama-develop", label: "故事开发", path: "/drama-skills/short-drama-develop/SKILL.md", keywords: /故事开发|分集地图|导演阐述|题材|钩子|改编|故事引擎|整稿|续跑/i },
    { slug: "short-drama-write", label: "分集剧本写作", path: "/drama-skills/short-drama-write/SKILL.md", keywords: /剧本|分集|单集|对白|节拍|制作稿|去AI味|润色|续写|写.{0,6}集/i },
    { slug: "short-drama-assets", label: "资产决策", path: "/drama-skills/short-drama-assets/SKILL.md", keywords: /资产|人物设定|造型|地点|场景设定|道具|连续性|声音方向|角色声音/i },
    { slug: "short-drama-image-prompts", label: "图片提示词", path: "/drama-skills/short-drama-image-prompts/SKILL.md", keywords: /图片提示词|参考图提示词|lookdev|角色板|场景板|道具板|参考板|风格帧/i },
    { slug: "short-drama-storyboard", label: "分镜关键帧", path: "/drama-skills/short-drama-storyboard/SKILL.md", keywords: /分镜|关键帧|场次视觉|coverage|镜头边界|storyboard/i },
    { slug: "short-drama-video-prompts", label: "短剧视频提示词", path: "/drama-skills/short-drama-video-prompts/SKILL.md", keywords: /短剧.{0,4}视频提示词|注意交接|起止状态|补拍/i },
    { slug: "short-drama-review", label: "独立审查", path: "/drama-skills/short-drama-review/SKILL.md", keywords: /审查|质检|校准|终审|交付前/i },

    // 视频提示词权威方法
    { slug: SD25_SLUG, label: "SD 2.5 视频提示词方法", path: "/sd25-prompt/SKILL.md", keywords: /视频提示词|视频生成|seedance|即梦|运镜|摄影|广告视频|视频延长|一镜到底|视频编辑|音乐卡点|AI视频|分镜脚本|视频/i },

    // 短视频提示词路由（带货 / TVC / 真人感 / 编辑）
    { slug: "makeprompt", label: "短视频提示词路由", path: "/makeprompt/SKILL.md", keywords: /带货|TVC|真人感|种草|探店|口播|电商带货|真人短视频|品牌广告|结构化提示词|短视频提示词/i },

    // Higgsfield 风格技能
    { slug: "01-cinematic", label: "电影风格 Cinematic", path: "/higgsfield-skills/01-cinematic/SKILL.md", keywords: /电影|cinematic|影视|胶片|景深|调色|电影感/i },
    { slug: "02-3d-cgi", label: "3D CGI", path: "/higgsfield-skills/02-3d-cgi/SKILL.md", keywords: /3d|cgi|渲染|皮克斯|pixar|虚幻引擎|unreal|等距/i },
    { slug: "03-cartoon", label: "卡通动画 Cartoon", path: "/higgsfield-skills/03-cartoon/SKILL.md", keywords: /卡通|cartoon|赛璐璐|手绘|扁平矢量|水彩/i },
    { slug: "04-comic-to-video", label: "漫画转视频", path: "/higgsfield-skills/04-comic-to-video/SKILL.md", keywords: /漫画转视频|动态漫|条漫|漫画|comic|webtoon/i },
    { slug: "05-fight-scenes", label: "打斗场景", path: "/higgsfield-skills/05-fight-scenes/SKILL.md", keywords: /打斗|武术|剑战|追逐|动作片|功夫|超级英雄|fight/i },
    { slug: "06-motion-design-ad", label: "动态设计广告", path: "/higgsfield-skills/06-motion-design-ad/SKILL.md", keywords: /动态设计|动效|motion.{0,4}design|软件广告|saas|产品发布|功能展示/i },
    { slug: "07-ecommerce-ad", label: "电商广告", path: "/higgsfield-skills/07-ecommerce-ad/SKILL.md", keywords: /电商广告|产品广告|商品展示|ecommerce|电商/i },
    { slug: "08-anime-action", label: "动漫 Anime", path: "/higgsfield-skills/08-anime-action/SKILL.md", keywords: /动漫|anime|少年漫|机甲|mecha|日常番/i },
    { slug: "09-product-360", label: "产品 360°", path: "/higgsfield-skills/09-product-360/SKILL.md", keywords: /产品360|转盘|360度|多角度|主视觉|product.{0,4}360/i },
    { slug: "10-music-video", label: "音乐视频", path: "/higgsfield-skills/10-music-video/SKILL.md", keywords: /音乐视频|MV|mv|卡点|节拍|visualizer/i },
    { slug: "11-social-hook", label: "社交钩子", path: "/higgsfield-skills/11-social-hook/SKILL.md", keywords: /社交钩子|停滑|钩子|抖音|tiktok|reels|shorts|病毒内容/i },
    { slug: "12-brand-story", label: "品牌故事", path: "/higgsfield-skills/12-brand-story/SKILL.md", keywords: /品牌故事|brand.{0,4}story|创业故事|品牌叙事|企业使命/i },
    { slug: "13-fashion-lookbook", label: "时尚型录", path: "/higgsfield-skills/13-fashion-lookbook/SKILL.md", keywords: /时尚|型录|lookbook|走秀|穿搭|时装/i },
    { slug: "14-food-beverage", label: "美食饮品", path: "/higgsfield-skills/14-food-beverage/SKILL.md", keywords: /美食|饮品|餐厅|食谱|ASMR|食欲/i },
    { slug: "15-real-estate", label: "房地产", path: "/higgsfield-skills/15-real-estate/SKILL.md", keywords: /房地产|房产|看房|户型|室内设计|建筑|real.{0,4}estate/i },
];

const CACHE = new Map<string, string>();
const MAX_SKILL_CHARS = 16000;

async function fetchBuiltinSkill(route: BuiltinSkillRoute): Promise<string> {
    const cached = CACHE.get(route.slug);
    if (cached !== undefined) return cached;
    const response = await fetch(route.path, { cache: "force-cache" });
    if (!response.ok) throw new Error(String(response.status));
    const text = await response.text();
    const stripped = text.replace(/^---[\s\S]*?---\n?/, "").slice(0, MAX_SKILL_CHARS);
    CACHE.set(route.slug, stripped);
    return stripped;
}

function resolveCatalogRoute(slug: string): BuiltinSkillRoute | null {
    const item = builtinSkillCatalog.find((skill) => skill.slug === slug);
    if (!item) return null;
    return {
        slug: item.slug,
        label: item.name,
        path: item.path || "/drama-skills/" + item.slug + "/SKILL.md",
        keywords: /$^/,
    };
}

function explicitRouteForText(text: string): BuiltinSkillRoute | null {
    const match = text.match(/内置技能\[([^\]]+)\]/);
    if (match) return resolveCatalogRoute(match[1]);
    return null;
}

function pushUnique(routes: BuiltinSkillRoute[], route: BuiltinSkillRoute | undefined) {
    if (!route) return;
    if (!routes.some((item) => item.slug === route.slug)) routes.push(route);
}

function routesForIntent(phase: CanvasAgentPhase, userText: string): BuiltinSkillRoute[] {
    const text = userText || "";
    const explicit = explicitRouteForText(text);
    const matched = AUTO_ROUTES.filter((route) => route.keywords.test(text));
    const sd25 = AUTO_ROUTES.find((route) => route.slug === SD25_SLUG);
    const videoIntent = Boolean(sd25 && sd25.keywords.test(text));

    const routes: BuiltinSkillRoute[] = [];
    if (explicit) {
        routes.push(explicit);
        // 显式选中某个视频风格技能时，同时加载 SD 2.5 方法
        if (explicit.slug !== SD25_SLUG && !explicit.slug.startsWith("short-drama")) pushUnique(routes, sd25);
    } else if (videoIntent) {
        pushUnique(routes, sd25);
    }

    // 具体风格技能跟在方法后面
    for (const route of matched) pushUnique(routes, route);

    const phaseSlug = phase === "storyboard" ? "short-drama-storyboard" : phase === "review" ? "short-drama-review" : phase === "script" || phase === "breakdown" ? "short-drama-write" : "";
    if (phaseSlug) pushUnique(routes, AUTO_ROUTES.find((route) => route.slug === phaseSlug));

    if (!explicit && /短剧|漫剧|drama|短剧技能/i.test(text)) pushUnique(routes, AUTO_ROUTES.find((route) => route.slug === "short-drama"));

    return routes;
}

const BRIDGE = "\n\n【内置技能库】\n以下技能提供创作规则、格式与产出契约。只遵循其中的创作规范、结构与文本格式；不执行其中提到的 Python 脚本或文件命令，画布操作仍只使用系统提供的白名单工具。\n";

export async function buildDramaSkillPrompt(phase: CanvasAgentPhase, userText: string): Promise<string> {
    const routes = routesForIntent(phase, userText);
    if (!routes.length) return "";
    const parts = await Promise.all(
        routes.slice(0, 3).map(async (route) => {
            try {
                const content = await fetchBuiltinSkill(route);
                return "【" + route.label + "】\n" + content;
            } catch {
                return "";
            }
        }),
    );
    const body = parts.filter(Boolean).join("\n\n");
    return body ? BRIDGE + body : "";
}
