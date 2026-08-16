export type SkillStatus = "ready" | "coming";

export type SkillItem = {
    id: string;
    slug: string;
    name: string;
    description: string;
    tags: string[];
    category: string;
    status: SkillStatus;
    path?: string;
};

export const skills: SkillItem[] = [
    // ===== 短剧创作套件 drama-skills =====
    {
        id: "short-drama",
        slug: "short-drama",
        name: "短剧总控 · 初始化与路由",
        description: "短剧项目入口：初始化、继续、恢复、视觉方向 / Look Development、状态、接受与审查生命周期、文本交付。",
        tags: ["入口", "路由", "LookDev"],
        category: "影视短剧",
        status: "ready",
    },
    {
        id: "short-drama-novel-analyze",
        slug: "short-drama-novel-analyze",
        name: "原著改编分析",
        description: "长篇原著抽样快评、章节索引、逐章功能提取、剧情单元与节奏、改编价值与分集候选。",
        tags: ["原著", "快评", "章节索引"],
        category: "影视短剧",
        status: "ready",
    },
    {
        id: "short-drama-develop",
        slug: "short-drama-develop",
        name: "故事开发",
        description: "小说 / 长材料可追溯改编、多集整稿 Agent 主导切片与续跑、故事引擎、分集地图、导演阐述、题材与钩子手册。",
        tags: ["故事引擎", "分集地图", "改编"],
        category: "影视短剧",
        status: "ready",
    },
    {
        id: "short-drama-write",
        slug: "short-drama-write",
        name: "分集剧本写作",
        description: "单集目标、因果节拍、可拍剧本和项目选择的制作稿格式。",
        tags: ["剧本", "节拍", "制作稿"],
        category: "影视短剧",
        status: "ready",
    },
    {
        id: "short-drama-assets",
        slug: "short-drama-assets",
        name: "资产决策",
        description: "人物 / 造型、地点 / 视图、道具 / 状态、可选的角色声音方向与连续性决策。",
        tags: ["角色", "场景", "道具", "连续性"],
        category: "影视短剧",
        status: "ready",
    },
    {
        id: "short-drama-image-prompts",
        slug: "short-drama-image-prompts",
        name: "图片提示词",
        description: "Lookdev 风格帧、角色 / 场景 / 道具参考板提示词与定点修改说明。",
        tags: ["图片", "参考板", "提示词"],
        category: "影视短剧",
        status: "ready",
    },
    {
        id: "short-drama-storyboard",
        slug: "short-drama-storyboard",
        name: "分镜 / 关键帧",
        description: "可选场次视觉计划与 Coverage Audition、原文落实、镜头、边界和冻结关键帧。",
        tags: ["分镜", "关键帧", "镜头"],
        category: "影视短剧",
        status: "ready",
    },
    {
        id: "short-drama-video-prompts",
        slug: "short-drama-video-prompts",
        name: "短剧视频提示词",
        description: "短剧单镜动作、多人物表演与注意交接、摄影、声音、起止状态与补拍说明。",
        tags: ["短剧", "视频提示词", "摄影"],
        category: "影视短剧",
        status: "ready",
    },
    {
        id: "short-drama-review",
        slug: "short-drama-review",
        name: "独立审查",
        description: "结构 / 内容审查、授权生产观察的项目级校准诊断与独立结论。",
        tags: ["审查", "质检", "校准"],
        category: "影视短剧",
        status: "ready",
    },

    // ===== 视频提示词核心方法 =====
    {
        id: "sd-2-5-prompt",
        slug: "sd-2-5-prompt",
        name: "SD 2.5 视频提示词方法",
        description: "权威的 Seedance 2.5 / SD 2.5 视频提示词方法：主体 + 风格 + 时间线 + BGM + 限制 五段式，覆盖从零生成、多模态参考、原片反推、延长、编辑、一镜到底。",
        tags: ["Seedance 2.5", "五段式", "时间线"],
        category: "自媒体",
        status: "ready",
        path: "/sd25-prompt/SKILL.md",
    },
    {
        id: "makeprompt",
        slug: "makeprompt",
        name: "短视频提示词路由",
        description: "先路由再生成：电商带货（抖音 / TikTok）、品牌 TVC、真人感种草、视频编辑延长、通用创意分镜等互斥方法，按用户最终目的选择模板。",
        tags: ["带货", "TVC", "真人感", "分镜"],
        category: "广告营销",
        status: "ready",
        path: "/makeprompt/SKILL.md",
    },

    // ===== Higgsfield 风格技能 =====
    { id: "01-cinematic", slug: "01-cinematic", name: "电影风格 Cinematic", description: "影视品质视频：戏剧性光影、镜头语言、景深、调色与 2 秒钩子。", tags: ["电影", "光影", "镜头"], category: "自媒体", status: "ready", path: "/higgsfield-skills/01-cinematic/SKILL.md" },
    { id: "02-3d-cgi", slug: "02-3d-cgi", name: "3D CGI", description: "3D 渲染视频：Pixar 风、虚幻引擎、照片级、等距视角等。", tags: ["3D", "CGI", "渲染"], category: "自媒体", status: "ready", path: "/higgsfield-skills/02-3d-cgi/SKILL.md" },
    { id: "03-cartoon", slug: "03-cartoon", name: "卡通动画 Cartoon", description: "2D 动画视频：赛璐璐、手绘、扁平矢量、水彩等风格。", tags: ["2D", "卡通", "手绘"], category: "自媒体", status: "ready", path: "/higgsfield-skills/03-cartoon/SKILL.md" },
    { id: "04-comic-to-video", slug: "04-comic-to-video", name: "漫画转视频", description: "把漫画、条漫、分镜、连续画面变成动态视频。", tags: ["漫画", "条漫", "动态漫"], category: "自媒体", status: "ready", path: "/higgsfield-skills/04-comic-to-video/SKILL.md" },
    { id: "05-fight-scenes", slug: "05-fight-scenes", name: "打斗场景", description: "动作视频：武术、剑战、追逐、超级英雄等打斗编排。", tags: ["打斗", "武术", "追逐"], category: "游戏", status: "ready", path: "/higgsfield-skills/05-fight-scenes/SKILL.md" },
    { id: "06-motion-design-ad", slug: "06-motion-design-ad", name: "动态设计广告", description: "软件 / SaaS 类动态设计广告：产品发布、功能展示。", tags: ["动态设计", "SaaS", "广告"], category: "广告营销", status: "ready", path: "/higgsfield-skills/06-motion-design-ad/SKILL.md" },
    { id: "07-ecommerce-ad", slug: "07-ecommerce-ad", name: "电商广告", description: "产品广告：时尚、美妆、电子、食品等电商转化视频。", tags: ["电商", "带货", "产品"], category: "广告营销", status: "ready", path: "/higgsfield-skills/07-ecommerce-ad/SKILL.md" },
    { id: "08-anime-action", slug: "08-anime-action", name: "动漫 Anime", description: "日本动漫：少年、青年、机甲、日常、OP 等。", tags: ["动漫", "机甲", "OP"], category: "游戏", status: "ready", path: "/higgsfield-skills/08-anime-action/SKILL.md" },
    { id: "09-product-360", slug: "09-product-360", name: "产品 360°", description: "产品转盘展示：多角度、主视觉、材质细节。", tags: ["产品", "转盘", "材质"], category: "周边设计", status: "ready", path: "/higgsfield-skills/09-product-360/SKILL.md" },
    { id: "10-music-video", slug: "10-music-video", name: "音乐视频", description: "节拍同步 MV：表演、叙事、可视化。", tags: ["MV", "卡点", "音乐"], category: "自媒体", status: "ready", path: "/higgsfield-skills/10-music-video/SKILL.md" },
    { id: "11-social-hook", slug: "11-social-hook", name: "社交钩子", description: "病毒内容：抖音 / TikTok / Reels / Shorts 停滑钩子。", tags: ["钩子", "抖音", "TikTok"], category: "广告营销", status: "ready", path: "/higgsfield-skills/11-social-hook/SKILL.md" },
    { id: "12-brand-story", slug: "12-brand-story", name: "品牌故事", description: "品牌叙事：创业故事、使命、企业文化。", tags: ["品牌", "叙事"], category: "广告营销", status: "ready", path: "/higgsfield-skills/12-brand-story/SKILL.md" },
    { id: "13-fashion-lookbook", slug: "13-fashion-lookbook", name: "时尚型录", description: "时尚视频：型录、走秀、穿搭、品牌活动。", tags: ["时尚", "走秀", "穿搭"], category: "周边设计", status: "ready", path: "/higgsfield-skills/13-fashion-lookbook/SKILL.md" },
    { id: "14-food-beverage", slug: "14-food-beverage", name: "美食饮品", description: "美食视频：餐厅、食谱、ASMR、食欲诱惑。", tags: ["美食", "ASMR", "食谱"], category: "自媒体", status: "ready", path: "/higgsfield-skills/14-food-beverage/SKILL.md" },
    { id: "15-real-estate", slug: "15-real-estate", name: "房地产", description: "房产视频：房屋参观、建筑、室内设计。", tags: ["房产", "室内", "看房"], category: "广告营销", status: "ready", path: "/higgsfield-skills/15-real-estate/SKILL.md" },
];

export const skillCategories = ["全部", ...Array.from(new Set(skills.map((skill) => skill.category)))];
