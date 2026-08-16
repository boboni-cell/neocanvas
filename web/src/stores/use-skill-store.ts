"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

import { localForageStorage } from "@/lib/localforage-storage";

export type CustomSkillCategory = "影视短剧" | "自媒体" | "广告营销" | "游戏" | "周边设计";

export type CustomSkill = {
    id: string;
    name: string;
    description: string;
    category: CustomSkillCategory;
    prompt: string;
    createdAt: string;
};

export type CustomSkillInput = {
    name: string;
    description: string;
    category: CustomSkillCategory;
    prompt: string;
};

const SEED_SKILLS: CustomSkill[] = [
    {
        id: "skill-storyboard-video",
        name: "故事板做视频",
        description: "使用 Image2 生成视频故事板，作为参考图生成视频。",
        category: "自媒体",
        prompt: "使用图片模型先生成视频故事板，再把故事板作为参考图生成视频。流程：1) 根据主题生成 4-6 张连续分镜关键帧，保持角色、场景与画风一致；2) 逐镜把关键帧作为参考图生成视频片段；3) 保证镜头衔接与节奏连贯。先询问主题、时长与画幅比例。",
        createdAt: new Date().toISOString(),
    },
    {
        id: "skill-world-cup-me",
        name: "我在世界杯现场",
        description: "可快速生成主角出现在世界杯球场的恶搞视频。",
        category: "自媒体",
        prompt: "生成一段恶搞视频，让主角出现在世界杯比赛现场。先让用户上传主角的正面照并作为参考图；再生成主角站在球场看台、球员通道或替补席等场景，与比赛氛围互动。保持角色面部与服装一致，镜头运动自然，并带有现场欢呼与解说氛围。",
        createdAt: new Date().toISOString(),
    },
    {
        id: "skill-world-cup-brawl",
        name: "世界杯大乱斗",
        description: "可快速生成跨界角色齐聚世界杯球场大乱斗的视频。",
        category: "游戏",
        prompt: "生成跨界角色齐聚世界杯球场大乱斗的喜剧短视频。允许用户上传多个角色参考图；场景固定为世界杯球场，突出夸张动作、肢体喜剧与快速反转。分镜节奏要快，运镜有冲击力，先给分镜再逐镜生成。",
        createdAt: new Date().toISOString(),
    },
    {
        id: "skill-drone-aerial",
        name: "无人机航拍",
        description: "需上传一张标注路径的远景图（路径请用箭头区分起点、终点，线条中间不可中断），可快速生成一段无人机航拍视频。",
        category: "广告营销",
        prompt: "根据用户上传的标注路径远景图生成无人机航拍视频。先读取路径图的起点、终点与箭头方向，按路径顺序规划飞行航线；输出航拍镜头，保持路径连贯、速度平滑，画面为俯视或斜俯视视角。若图片没有清晰路径，先请用户补充标注。",
        createdAt: new Date().toISOString(),
    },
    {
        id: "skill-fruit-drama",
        name: "水果短剧",
        description: "快速生成狗血剧情的水果短片。",
        category: "自媒体",
        prompt: "生成水果拟人短剧：把水果拟人化并赋予性格，剧情狗血、反转快。先输出 1-2 分钟短剧剧本（含对白与情绪标注），再做分镜并生成视频。先询问水果角色、题材与时长。",
        createdAt: new Date().toISOString(),
    },
    {
        id: "skill-bilibili-montage",
        name: "B站百大共创-人生故事蒙太奇动画",
        description: "【培根悖论唠唠嗑 × OiiOii 合作 Skill】专注于创作由音乐驱动、无对白的纯视觉蒙太奇短片。通过视觉叙事表达人生故事。",
        category: "自媒体",
        prompt: "创作音乐驱动、无对白的纯视觉蒙太奇短片。先根据人生故事主题提炼情感弧线；再用视觉蒙太奇组织关键画面（不是线性叙事）；镜头随音乐节奏切换，突出情绪递进与留白。最后输出分镜并生成视频。",
        createdAt: new Date().toISOString(),
    },
    {
        id: "skill-bilibili-anthropomorphic",
        name: "B站百大共创-万物拟人化短片",
        description: "【GenJi 是真想教会你 × OiiOii 合作 Skill】可快速生成万物拟人化的短片故事，赋予食物、日常用品人格。",
        category: "自媒体",
        prompt: "把食物、日常用品等万物拟人化并生成短片故事。为对象赋予人格与情绪，设计冲突与反转；先输出角色设定与分镜，再生成视频。先询问要拟人化的对象与风格。",
        createdAt: new Date().toISOString(),
    },
    {
        id: "skill-pet-story",
        name: "萌宠故事",
        description: "专注于创作拟人化萌宠短视频，通过将人类社会场景与宠物行为深度结合，提供导演级的分镜规划、脚本与视频生成。",
        category: "自媒体",
        prompt: "创作拟人化萌宠短视频：把人类社会场景与宠物行为深度结合。先做导演级分镜规划与脚本，突出萌点与情绪反差；再按分镜生成视频。先询问宠物类型、故事题材与时长。",
        createdAt: new Date().toISOString(),
    },
    {
        id: "skill-funny-story",
        name: "搞笑故事",
        description: "擅长以一本正经的冷幽默风格创作快节奏荒诞反转故事，依靠快速反差打脸、层层递进的情绪烘托制造笑点。",
        category: "自媒体",
        prompt: "以一本正经的冷幽默风格创作快节奏荒诞反转故事。先给 30-60 秒故事梗概与节拍，靠快速反差打脸、层层递进的情绪烘托制造笑点；再拆成分镜并生成视频。先询问题材或关键词。",
        createdAt: new Date().toISOString(),
    },
    {
        id: "skill-suspense-story",
        name: "悬疑故事",
        description: "专门制作 1-2 分钟悬疑、诡异、反转类微动画剧本。可依据简单词汇或核心概念，结合经典悬疑作品手法。",
        category: "自媒体",
        prompt: "制作 1-2 分钟悬疑、诡异、反转类微动画。可依据简单词汇或核心概念，结合经典悬疑作品手法。先给剧本（含氛围、关键信息遮蔽与结尾反转），再规划分镜并生成视频。先询问核心概念或关键词。",
        createdAt: new Date().toISOString(),
    },
    {
        id: "skill-kon-aesthetic",
        name: "今敏视听美学",
        description: "复刻今敏视听美学风格，将创作灵感转化为兼具心理张力、虚实交织梦境、精巧转场设计的 1-2 分钟动画。",
        category: "周边设计",
        prompt: "复刻今敏（Satoshi Kon）视听美学：将灵感转化为兼具心理张力、虚实交织梦境、精巧转场设计的 1-2 分钟动画。先确定现实与梦境的边界及转场锚点，再按镜头生成。先询问灵感主题与情绪基调。",
        createdAt: new Date().toISOString(),
    },
    {
        id: "skill-instant-noodle",
        name: "泡面番",
        description: "专门制作 1-2 分钟短篇动画，擅长从日常生活中挖掘诡异切入点，并结合指定情绪关键词设计分镜。",
        category: "游戏",
        prompt: "制作 1-2 分钟短篇动画：从日常生活挖掘诡异切入点，并结合指定情绪关键词。先给短篇设定与紧凑分镜（泡面番质感），再逐镜生成视频。先询问切入点或情绪关键词。",
        createdAt: new Date().toISOString(),
    },
];

type SkillStore = {
    skills: CustomSkill[];
    addSkill: (input: CustomSkillInput) => string;
    updateSkill: (id: string, patch: Partial<CustomSkillInput>) => void;
    deleteSkill: (id: string) => void;
};

export const useSkillStore = create<SkillStore>()(
    persist(
        (set) => ({
            skills: SEED_SKILLS,
            addSkill: (input) => {
                const id = "skill-" + nanoid();
                set((state) => ({
                    skills: [{ id, ...input, createdAt: new Date().toISOString() }, ...state.skills],
                }));
                return id;
            },
            updateSkill: (id, patch) => {
                set((state) => ({
                    skills: state.skills.map((skill) => (skill.id === id ? { ...skill, ...patch } : skill)),
                }));
            },
            deleteSkill: (id) => {
                set((state) => ({ skills: state.skills.filter((skill) => skill.id !== id) }));
            },
        }),
        { name: "neocanvas:skill_store_v2", storage: localForageStorage },
    ),
);
