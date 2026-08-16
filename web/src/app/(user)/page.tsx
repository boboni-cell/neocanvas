"use client";

import { ArrowRight, BookOpen, ImagePlus, Images, Maximize2, Sparkles, Video } from "lucide-react";
import { motion } from "motion/react";
import { type ChangeEvent, useRef, useState } from "react";
import { App, Button } from "antd";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { uploadAssetMediaFile } from "@/services/file-storage";
import { uploadImage } from "@/services/image-storage";
import { useEffectiveConfig } from "@/stores/use-config-store";
import { AssetPickerModal } from "./canvas/components/asset-picker-modal";
import { CanvasAssistantComposer } from "./canvas/components/canvas-assistant-composer";
import { useCanvasStore } from "./canvas/stores/use-canvas-store";
import {
    CanvasNodeType,
    type CanvasAgentConfig,
    type CanvasAssistantReference,
    type InsertAssetPayload,
    type PendingAgentAsset,
} from "./canvas/types";

const QUICK_ACTIONS = [
    { href: "/canvas", title: "我的画布", desc: "无限画布编排、连线与批量生成", icon: Maximize2 },
    { href: "/image", title: "生图工作台", desc: "批量生图、图生图与参考图编辑", icon: ImagePlus },
    { href: "/video", title: "视频创作台", desc: "文生视频、图生视频与镜头控制", icon: Video },
    { href: "/skills", title: "技能库", desc: "内置创作技能，让 AI 更懂视频", icon: BookOpen },
    { href: "/assets", title: "我的素材", desc: "沉淀提示词、参考图与素材", icon: Images },
];

const FEATURES = [
    { icon: Maximize2, title: "无限画布", desc: "节点拖拽、连线、批量生成，让创意持续迭代" },
    { icon: ImagePlus, title: "AI 生图", desc: "文生图、图生图、参考图编辑与批量出图" },
    { icon: Video, title: "视频创作", desc: "Seedance 视频生成，镜头参数自动写入提示词" },
    { icon: BookOpen, title: "技能库", desc: "分镜、角色、风格、排版技能持续内置" },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
};

function toPendingAgentAsset(payload: InsertAssetPayload): PendingAgentAsset {
    const nodeId = nanoid();
    let reference: CanvasAssistantReference;
    if (payload.kind === "text") {
        reference = { id: nodeId, type: CanvasNodeType.Text, title: payload.title, text: payload.content };
    } else {
        const common = { id: nodeId, title: payload.title, storageKey: payload.storageKey, mimeType: payload.mimeType };
        if (payload.kind === "image") reference = { ...common, type: CanvasNodeType.Image, dataUrl: payload.dataUrl };
        else if (payload.kind === "video") reference = { ...common, type: CanvasNodeType.Video, url: payload.url };
        else reference = { ...common, type: CanvasNodeType.Audio, url: payload.url };
    }
    return { nodeId, payload, reference };
}

export default function IndexPage() {
    const { message } = App.useApp();
    const router = useRouter();
    const effectiveConfig = useEffectiveConfig();
    const createProject = useCanvasStore((state) => state.createProject);
    const hydrated = useCanvasStore((state) => state.hydrated);
    const [prompt, setPrompt] = useState("");
    const [pendingAssets, setPendingAssets] = useState<PendingAgentAsset[]>([]);
    const [assetPickerOpen, setAssetPickerOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [agentConfig, setAgentConfig] = useState<CanvasAgentConfig>(() => ({
        imageQuality: effectiveConfig.quality,
        imageSize: effectiveConfig.size,
        videoQuality: effectiveConfig.vquality,
        videoSize: effectiveConfig.videoSize,
    }));
    const uploadInputRef = useRef<HTMLInputElement>(null);
    const composerRef = useRef<HTMLDivElement>(null);

    const addPendingAsset = (payload: InsertAssetPayload) => {
        setPendingAssets((current) => [...current, toPendingAgentAsset(payload)]);
    };

    const uploadFile = async (file: File) => {
        try {
            if (file.type.startsWith("image/")) {
                const uploaded = await uploadImage(file);
                addPendingAsset({ kind: "image", dataUrl: uploaded.url, title: file.name, ...uploaded });
            } else if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
                const uploaded = await uploadAssetMediaFile(file);
                if (file.type.startsWith("video/")) addPendingAsset({ kind: "video", title: file.name, ...uploaded });
                else addPendingAsset({ kind: "audio", title: file.name, ...uploaded });
            } else {
                throw new Error("仅支持图片、视频和音频文件");
            }
        } catch (error) {
            message.error(error instanceof Error ? error.message : "素材上传失败");
        }
    };

    const onUploadInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) void uploadFile(file);
    };

    const submit = () => {
        const text = prompt.trim();
        if (!text || submitting) return;
        if (!hydrated) {
            message.info("画布数据正在加载，请稍后再试");
            return;
        }
        setSubmitting(true);
        const titles = new Set(useCanvasStore.getState().projects.map(({ title }) => title));
        let title = "NeoCanvas";
        for (let i = 1; titles.has(title); i++) title = "NeoCanvas " + i;
        const projectId = createProject(title, {
            agentConfig,
            pendingAgentRequest: { prompt: text, assets: pendingAssets },
        });
        router.push("/canvas/" + projectId);
    };

    return (
        <main className="relative h-full overflow-x-hidden overflow-y-auto bg-stone-50 text-stone-900 dark:bg-[#050505] dark:bg-[radial-gradient(rgba(0,255,102,.07)_1px,transparent_1px)] dark:text-stone-100 [background-size:16px_16px]">
            {/* ambient glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <motion.div
                    className="absolute -left-24 top-16 size-80 rounded-full bg-[#00b84a]/15 blur-[120px] dark:bg-[#00ff66]/12"
                    animate={{ x: [0, 42, 0], y: [0, 26, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -right-24 top-1/3 size-96 rounded-full bg-[#00b84a]/12 blur-[140px] dark:bg-[#00ff66]/10"
                    animate={{ x: [0, -36, 0], y: [0, 30, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 left-1/3 size-72 rounded-full bg-[#4dff88]/10 blur-[120px] dark:bg-[#7dffb0]/8"
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.12, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <section className="relative mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-6">
                {/* Hero */}
                <motion.section
                    className="relative flex min-h-[540px] flex-col items-center justify-center py-14 text-center"
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
                >
                    <motion.div
                        variants={fadeUp}
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00b84a]/30 bg-[#00b84a]/5 px-4 py-1.5 text-xs font-medium text-[#008a3a] dark:border-[#00ff66]/30 dark:bg-[#00ff66]/10 dark:text-[#00ff66]"
                    >
                        <Sparkles className="size-3.5" />
                        AI 视频与视觉创作工作台
                    </motion.div>
                    <motion.h1 variants={fadeUp} className="max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl">
                        从一句话开始，
                        <span className="bg-gradient-to-r from-[#00b84a] to-[#4dff88] bg-clip-text text-transparent dark:from-[#00ff66] dark:to-[#7dffb0]">
                            生成整支视频
                        </span>
                    </motion.h1>
                    <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base leading-7 text-stone-500 dark:text-stone-400">
                        把灵感变成分镜，把分镜变成画面，把画面连成视频。AI 批量生成图片与镜头，无限画布持续迭代。
                    </motion.p>
                    <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button
                                type="primary"
                                size="large"
                                className="h-11 rounded-xl px-6 font-medium shadow-[0_0_24px_rgba(0,255,102,.35)]"
                                onClick={() => composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                            >
                                开始创作
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button size="large" className="h-11 rounded-xl px-6" onClick={() => router.push("/canvas")}>
                                进入我的画布
                                <ArrowRight className="size-4" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* Composer */}
                <motion.section
                    ref={composerRef}
                    className="mx-auto w-full max-w-[860px] scroll-mt-24 pb-14"
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                >
                    <CanvasAssistantComposer
                        prompt={prompt}
                        isRunning={false}
                        references={pendingAssets.map((asset) => asset.reference)}
                        agentConfig={agentConfig}
                        onAgentConfigChange={(patch) => setAgentConfig((current) => ({ ...current, ...patch }))}
                        onPromptChange={setPrompt}
                        onSubmit={submit}
                        onOpenUpload={() => uploadInputRef.current?.click()}
                        onOpenAssets={() => setAssetPickerOpen(true)}
                        onRemoveReference={(id) => setPendingAssets((current) => current.filter((asset) => asset.nodeId !== id))}
                        onPasteImage={(file) => void uploadFile(file)}
                    />
                    <input ref={uploadInputRef} hidden type="file" accept="image/*,video/*,audio/*" onChange={onUploadInputChange} />
                </motion.section>

                {/* Quick actions */}
                <section className="mx-auto mb-14 max-w-6xl">
                    <motion.div
                        className="mb-6 flex items-center gap-3"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                    >
                        <h2 className="text-xl font-semibold tracking-tight">快速开始</h2>
                        <span className="h-px flex-1 bg-stone-200 dark:bg-white/10" />
                    </motion.div>
                    <motion.div
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-60px" }}
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                    >
                        {QUICK_ACTIONS.map((action) => {
                            const Icon = action.icon;
                            return (
                                <motion.button
                                    key={action.href}
                                    type="button"
                                    onClick={() => router.push(action.href)}
                                    variants={fadeUp}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                                    className={cn(
                                        "group cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 text-left transition-colors duration-200",
                                        "hover:border-[#00b84a]/50 hover:shadow-[0_16px_40px_rgba(0,184,74,.16)]",
                                        "dark:border-white/10 dark:bg-[#0c0c0c] dark:hover:border-[#00ff66]/50 dark:hover:shadow-[0_16px_44px_rgba(0,255,102,.14)]",
                                    )}
                                >
                                    <span className="grid size-10 place-items-center rounded-xl bg-[#00b84a]/10 text-[#00b84a] transition group-hover:scale-110 dark:bg-[#00ff66]/10 dark:text-[#00ff66]">
                                        <Icon className="size-5" />
                                    </span>
                                    <span className="mt-4 block text-sm font-semibold">{action.title}</span>
                                    <span className="mt-1 block text-xs leading-5 text-stone-500 dark:text-stone-400">{action.desc}</span>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                </section>

                {/* Features */}
                <section className="mx-auto mb-20 max-w-6xl border-t border-stone-200 pt-12 dark:border-white/10">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {FEATURES.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    className="flex items-start gap-3.5"
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ delay: index * 0.06, duration: 0.5 }}
                                >
                                    <motion.span
                                        whileHover={{ rotate: 6, scale: 1.08 }}
                                        className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#00b84a]/25 bg-[#00b84a]/5 text-[#00b84a] dark:border-[#00ff66]/25 dark:bg-[#00ff66]/5 dark:text-[#00ff66]"
                                    >
                                        <Icon className="size-4.5" />
                                    </motion.span>
                                    <div>
                                        <h3 className="text-sm font-semibold">{feature.title}</h3>
                                        <p className="mt-1 text-xs leading-5 text-stone-500 dark:text-stone-400">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            </section>

            <AssetPickerModal
                open={assetPickerOpen}
                defaultTab="my-assets"
                onInsert={(payload) => {
                    addPendingAsset(payload);
                    setAssetPickerOpen(false);
                }}
                onClose={() => setAssetPickerOpen(false)}
            />
        </main>
    );
}
