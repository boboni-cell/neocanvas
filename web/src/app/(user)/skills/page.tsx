"use client";

import { Pencil, Plus, Sparkles, Trash2, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { App, Button, Empty, Form, Input, Modal, Select } from "antd";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { skills as builtinSkills, type SkillItem } from "@/data/skills";
import { useCanvasStore } from "@/app/(user)/canvas/stores/use-canvas-store";
import { useSkillStore, type CustomSkill, type CustomSkillCategory, type CustomSkillInput } from "@/stores/use-skill-store";

const CATEGORIES = ["全部", "影视短剧", "自媒体", "广告营销", "游戏", "周边设计"] as const;
const CUSTOM_CATEGORIES: CustomSkillCategory[] = ["影视短剧", "自媒体", "广告营销", "游戏", "周边设计"];

export default function SkillsPage() {
    const { message } = App.useApp();
    const router = useRouter();
    const hydrated = useCanvasStore((state) => state.hydrated);
    const createProject = useCanvasStore((state) => state.createProject);
    const customSkills = useSkillStore((state) => state.skills);
    const deleteSkill = useSkillStore((state) => state.deleteSkill);
    const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("全部");
    const [createOpen, setCreateOpen] = useState(false);
    const [editing, setEditing] = useState<CustomSkill | null>(null);

    const filteredBuiltin = useMemo(() => {
        return category === "全部" ? builtinSkills : builtinSkills.filter((skill) => skill.category === category);
    }, [category]);

    const filteredCustom = useMemo(() => {
        return category === "全部" ? customSkills : customSkills.filter((skill) => skill.category === category);
    }, [category, customSkills]);

    const openInCanvas = (prompt: string, title: string) => {
        if (!hydrated) {
            message.info("画布数据正在加载，请稍后再试");
            return;
        }
        const titles = new Set(useCanvasStore.getState().projects.map((project) => project.title));
        let nextTitle = title;
        for (let i = 1; titles.has(nextTitle); i++) nextTitle = title + " " + i;
        const projectId = createProject(nextTitle, { pendingAgentRequest: { prompt, assets: [] } });
        router.push("/canvas/" + projectId);
    };

    const tryBuiltinSkill = (skill: SkillItem) => {
        openInCanvas("使用内置技能[" + skill.slug + "]「" + skill.name + "」：请按该技能流程引导我，先问我本次要处理的内容。", skill.name);
    };

    const tryCustomSkill = (skill: CustomSkill) => {
        openInCanvas(skill.prompt, skill.name);
    };

    const handleSave = (values: CustomSkillInput) => {
        if (editing) {
            useSkillStore.getState().updateSkill(editing.id, values);
            message.success("技能已更新");
        } else {
            useSkillStore.getState().addSkill(values);
            message.success("技能已创建");
        }
        setCreateOpen(false);
        setEditing(null);
    };

    const total = filteredBuiltin.length + filteredCustom.length;

    return (
        <main className="h-full overflow-y-auto bg-stone-50 text-stone-900 dark:bg-[#050505] dark:text-stone-100">
            <div className="mx-auto w-full max-w-6xl px-6 py-10">
                <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#00b84a] dark:text-[#00ff66]">
                            <Sparkles className="size-3.5" />
                            My Skills
                        </div>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight">我的技能</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500 dark:text-stone-400">
                            内置的短剧、视频提示词与风格技能，加上你自己创建的技能，按分类沉淀，一键在画布中试用。
                        </p>
                    </div>
                    <Button type="primary" size="middle" icon={<Plus className="size-4" />} onClick={() => setCreateOpen(true)}>
                        创建我的 Skill
                    </Button>
                </header>

                <div className="mb-8 flex flex-wrap gap-2">
                    {CATEGORIES.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setCategory(item)}
                            className={cn(
                                "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition",
                                category === item
                                    ? "border-[#00b84a] bg-[#00b84a]/10 font-medium text-[#008a3a] dark:border-[#00ff66] dark:bg-[#00ff66]/10 dark:text-[#00ff66]"
                                    : "border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-900 dark:border-white/10 dark:text-stone-400 dark:hover:border-white/25 dark:hover:text-white",
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {total ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredBuiltin.map((skill) => (
                            <BuiltinSkillCard key={skill.id} skill={skill} onUse={() => tryBuiltinSkill(skill)} />
                        ))}
                        {filteredCustom.map((skill) => (
                            <CustomSkillCard key={skill.id} skill={skill} onUse={() => tryCustomSkill(skill)} onEdit={() => setEditing(skill)} onDelete={() => deleteSkill(skill.id)} />
                        ))}
                    </div>
                ) : (
                    <Empty description="这个分类下还没有技能" className="pt-24" />
                )}
            </div>

            <SkillFormModal
                open={createOpen || Boolean(editing)}
                editing={editing}
                onCancel={() => {
                    setCreateOpen(false);
                    setEditing(null);
                }}
                onSubmit={handleSave}
            />
        </main>
    );
}

function BuiltinSkillCard({ skill, onUse }: { skill: SkillItem; onUse: () => void }) {
    return (
        <article className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 dark:border-white/10 dark:bg-[#0c0c0c]">
            <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[#00b84a]/10 text-[#00b84a] dark:bg-[#00ff66]/10 dark:text-[#00ff66]">
                    <Sparkles className="size-5" />
                </span>
                <span className="shrink-0 rounded-full bg-[#00b84a]/10 px-2.5 py-1 text-[11px] font-medium text-[#008a3a] dark:bg-[#00ff66]/15 dark:text-[#00ff66]">内置</span>
            </div>
            <div>
                <h2 className="text-base font-semibold leading-snug">{skill.name}</h2>
                <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-stone-500 dark:text-stone-400">{skill.description}</p>
            </div>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {skill.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] text-stone-500 dark:bg-white/5 dark:text-stone-400">{tag}</span>
                ))}
            </div>
            <Button type="primary" size="small" icon={<WandSparkles className="size-3.5" />} className="mt-1 self-start" onClick={onUse}>
                试试看
            </Button>
        </article>
    );
}

function CustomSkillCard({ skill, onUse, onEdit, onDelete }: { skill: CustomSkill; onUse: () => void; onEdit: () => void; onDelete: () => void }) {
    return (
        <article className="group flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 dark:border-white/10 dark:bg-[#0c0c0c]">
            <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[#00b84a]/10 text-[#00b84a] dark:bg-[#00ff66]/10 dark:text-[#00ff66]">
                    <Sparkles className="size-5" />
                </span>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="grid size-7 cursor-pointer place-items-center rounded-md text-stone-400 transition hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-white/5 dark:hover:text-white"
                        aria-label="编辑"
                        title="编辑"
                    >
                        <Pencil className="size-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="grid size-7 cursor-pointer place-items-center rounded-md text-stone-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                        aria-label="删除"
                        title="删除"
                    >
                        <Trash2 className="size-3.5" />
                    </button>
                </div>
            </div>
            <div>
                <h2 className="text-base font-semibold leading-snug">{skill.name}</h2>
                <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-stone-500 dark:text-stone-400">{skill.description}</p>
            </div>
            <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] text-stone-500 dark:bg-white/5 dark:text-stone-400">{skill.category}</span>
                <Button type="primary" size="small" icon={<WandSparkles className="size-3.5" />} onClick={onUse}>
                    试试看
                </Button>
            </div>
        </article>
    );
}

function SkillFormModal({ open, editing, onCancel, onSubmit }: { open: boolean; editing: CustomSkill | null; onCancel: () => void; onSubmit: (values: CustomSkillInput) => void }) {
    const [form] = Form.useForm<CustomSkillInput>();

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            title={editing ? "编辑技能" : "创建我的 Skill"}
            width={560}
            centered
            destroyOnHidden
            footer={
                <>
                    <Button onClick={onCancel}>取消</Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        {editing ? "保存" : "创建"}
                    </Button>
                </>
            }
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                initialValues={
                    editing
                        ? { name: editing.name, description: editing.description, category: editing.category, prompt: editing.prompt }
                        : { name: "", description: "", category: "自媒体", prompt: "" }
                }
                onFinish={(values) => onSubmit(values)}
            >
                <Form.Item name="name" label="技能名称" rules={[{ required: true, message: "请输入技能名称" }]}>
                    <Input placeholder="例如：故事板做视频" maxLength={40} />
                </Form.Item>
                <Form.Item name="category" label="分类" rules={[{ required: true, message: "请选择分类" }]}>
                    <Select options={CUSTOM_CATEGORIES.map((item) => ({ label: item, value: item }))} />
                </Form.Item>
                <Form.Item name="description" label="技能描述" rules={[{ required: true, message: "请输入技能描述" }]}>
                    <Input.TextArea rows={3} placeholder="一句话说明这个技能能做什么" maxLength={120} />
                </Form.Item>
                <Form.Item name="prompt" label="提示词 / 指令" rules={[{ required: true, message: "请输入发送给画布助手的指令" }]} extra="点击「试试看」时，这段话会作为初始请求发送给画布助手。">
                    <Input.TextArea rows={5} placeholder="例如：根据我上传的故事板图片生成对应视频，保持人物与场景一致。" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
