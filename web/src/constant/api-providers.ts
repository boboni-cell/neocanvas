import type { LocalModelChannel, ModelCapability } from "@/stores/use-config-store";

export type ApiProvider = {
    id: string;
    label: string;
    protocol: LocalModelChannel["protocol"];
    baseUrl: string;
    defaultModel: string;
    description: string;
    preset: boolean;
    capability: ModelCapability;
};

export const API_PROVIDERS: ApiProvider[] = [
    { id: "openai", label: "OpenAI", protocol: "openai", baseUrl: "https://api.openai.com/v1", defaultModel: "gpt-4o", description: "OpenAI 官方接口，支持文本、图片与视频。", preset: true, capability: "text" },
    { id: "deepseek", label: "DeepSeek", protocol: "openai", baseUrl: "https://api.deepseek.com/v1", defaultModel: "deepseek-chat", description: "DeepSeek 官方接口。", preset: true, capability: "text" },
    { id: "anthropic", label: "Anthropic Claude", protocol: "openai", baseUrl: "https://api.anthropic.com/v1", defaultModel: "claude-sonnet-4-5", description: "Anthropic Claude 兼容接口。", preset: true, capability: "text" },
    { id: "gemini", label: "Google Gemini", protocol: "openai", baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai", defaultModel: "gemini-2.5-flash", description: "Google Gemini OpenAI 兼容接口。", preset: true, capability: "text" },
    { id: "grok", label: "xAI Grok", protocol: "openai", baseUrl: "https://api.x.ai/v1", defaultModel: "grok-4", description: "xAI Grok 官方接口。", preset: true, capability: "text" },
    { id: "openrouter", label: "OpenRouter", protocol: "openai", baseUrl: "https://openrouter.ai/api/v1", defaultModel: "openai/gpt-4o", description: "OpenRouter 聚合接口。", preset: true, capability: "text" },
    { id: "siliconflow", label: "硅基流动", protocol: "openai", baseUrl: "https://api.siliconflow.cn/v1", defaultModel: "deepseek-ai/DeepSeek-V3", description: "硅基流动 SiliconFlow 接口。", preset: true, capability: "text" },
    { id: "dashscope", label: "通义千问 DashScope", protocol: "openai", baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1", defaultModel: "qwen-plus", description: "阿里云百炼 DashScope 兼容接口。", preset: true, capability: "text" },
    { id: "moonshot", label: "Moonshot Kimi", protocol: "openai", baseUrl: "https://api.moonshot.cn/v1", defaultModel: "kimi-k2", description: "Moonshot Kimi 官方接口。", preset: true, capability: "text" },
    { id: "zhipu", label: "智谱 GLM", protocol: "openai", baseUrl: "https://open.bigmodel.cn/api/paas/v4", defaultModel: "glm-4-plus", description: "智谱 AI GLM 接口。", preset: true, capability: "text" },
    { id: "minimax", label: "MiniMax", protocol: "openai", baseUrl: "https://api.minimaxi.com", defaultModel: "MiniMax-H3", description: "MiniMax 官方接口，自动调用视频生成与任务查询接口。", preset: true, capability: "video" },
    { id: "atlascloud", label: "Atlas Cloud（全模型）", protocol: "openai", baseUrl: "https://api.atlascloud.ai/api/v1", defaultModel: "", description: "自动调用 Atlas Cloud 图片生成与任务查询接口。", preset: true, capability: "image" },
    { id: "nanogpt", label: "Nano-GPT", protocol: "openai", baseUrl: "https://nano-gpt.com/api/v1", defaultModel: "", description: "Nano-GPT 聚合接口。", preset: true, capability: "text" },
    { id: "ark", label: "火山 Ark", protocol: "openai", baseUrl: "https://ark.cn-beijing.volces.com/api/v3", defaultModel: "doubao-seedream-5-0-pro", description: "火山方舟 Ark 接口。", preset: true, capability: "image" },
    { id: "ark-plan", label: "火山方舟 Agent Plan（视频）", protocol: "openai", baseUrl: "https://ark.cn-beijing.volces.com/api/plan/v3", defaultModel: "doubao-seedance-2.0", description: "火山方舟 Agent Plan，用于 Seedance 视频生成。", preset: true, capability: "video" },
    { id: "kie", label: "KIE（可灵）", protocol: "kie", baseUrl: "", defaultModel: "", description: "KIE 可灵专用协议，请填写你的接入地址。", preset: true, capability: "video" },
    { id: "mimo", label: "MiMo", protocol: "mimo", baseUrl: "", defaultModel: "", description: "MiMo 语音专用协议，请填写你的接入地址。", preset: true, capability: "audio" },
    { id: "newapi", label: "New API / One API", protocol: "openai", baseUrl: "", defaultModel: "", description: "自部署的 New API / One API 网关。", preset: true, capability: "text" },
    { id: "custom", label: "自定义", protocol: "openai", baseUrl: "", defaultModel: "", description: "手动填写 Base URL、协议与模型名称。", preset: false, capability: "text" },
];

export function apiProviderForChannel(channel: { baseUrl?: string; protocol?: string; name?: string }) {
    const url = (channel.baseUrl || "").trim().replace(/\/+$/, "");
    const matched = API_PROVIDERS.find((provider) => provider.preset && Boolean(provider.baseUrl) && url && provider.baseUrl.replace(/\/+$/, "") === url);
    if (matched) return matched.id;
    const byName = API_PROVIDERS.find((provider) => provider.preset && provider.label === channel.name);
    if (byName) return byName.id;
    return "custom";
}

export function apiProviderLabel(channel: { baseUrl?: string; protocol?: string; name?: string }) {
    const id = apiProviderForChannel(channel);
    const provider = API_PROVIDERS.find((item) => item.id === id);
    if (provider && id !== "custom") return provider.label;
    if (channel.protocol === "kie") return "KIE（可灵）";
    if (channel.protocol === "mimo") return "MiMo";
    return "自定义";
}
