import { nanoid } from "nanoid";

import { dataUrlToFile } from "@/lib/image-utils";
import { imageToDataUrl } from "@/services/image-storage";
import { localChannelForActiveModel, type AiConfig } from "@/stores/use-config-store";
import type { ReferenceImage } from "@/types/image";

type AtlasGeneratedImage = { id: string; dataUrl: string };
export type AtlasGeneratedVideo = { id: string; url: string };

type AtlasPrediction = {
    id?: string;
    status?: string;
    outputs?: string[];
    error?: string;
};

const ATLAS_POLL_INTERVAL_MS = 2500;
const ATLAS_POLL_TIMEOUT_MS = 10 * 60 * 1000;

export function isAtlasCloudBaseUrl(baseUrl: string) {
    try {
        return /(?:^|\.)atlascloud\.ai$/i.test(new URL(baseUrl).hostname);
    } catch {
        return false;
    }
}

function atlasChannel(config: AiConfig) {
    return localChannelForActiveModel(config);
}

export function isAtlasCloudConfig(config: AiConfig) {
    return isAtlasCloudBaseUrl(atlasChannel(config)?.baseUrl || config.baseUrl);
}

function atlasApiKey(config: AiConfig) {
    return atlasChannel(config)?.apiKey || config.apiKey;
}

function atlasBaseUrl(config: AiConfig) {
    return (atlasChannel(config)?.baseUrl || config.baseUrl).trim().replace(/\/+$/, "");
}

function atlasHeaders(config: AiConfig, contentType?: string) {
    return {
        Authorization: `Bearer ${atlasApiKey(config)}`,
        ...(contentType ? { "Content-Type": contentType } : {}),
    };
}

async function atlasError(response: Response) {
    let message = `Atlas Cloud 请求失败：HTTP ${response.status}`;
    try {
        const payload = await response.json();
        message = payload?.message || payload?.error?.message || payload?.msg || message;
    } catch {
        // ignore non-JSON error body
    }
    return message;
}

export async function atlasUploadMedia(config: AiConfig, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${atlasBaseUrl(config)}/model/uploadMedia`, {
        method: "POST",
        headers: atlasHeaders(config),
        body: formData,
    });
    if (!response.ok) throw new Error(await atlasError(response));
    const payload = await response.json();
    const data = payload?.data;
    const url =
        payload?.url ||
        (data && typeof data === "string" ? data : "") ||
        (data && typeof data === "object" ? data.download_url || data.url || data.media_url || data.file_url || data.link || (Array.isArray(data.outputs) ? data.outputs[0] : "") : "");
    if (!url) throw new Error(`Atlas Cloud 上传媒体失败：没有返回 URL。响应：${JSON.stringify(payload).slice(0, 300)}`);
    return url;
}

export async function atlasCreatePrediction(config: AiConfig, kind: "image" | "video", body: Record<string, unknown>) {
    const endpoint = kind === "image" ? "/model/generateImage" : "/model/generateVideo";
    const response = await fetch(`${atlasBaseUrl(config)}${endpoint}`, {
        method: "POST",
        headers: atlasHeaders(config, "application/json"),
        body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(await atlasError(response));
    const payload = await response.json();
    const id = payload?.data?.id;
    if (!id) throw new Error("Atlas Cloud 没有返回任务 ID");
    return id;
}

async function atlasPollPrediction(config: AiConfig, id: string): Promise<AtlasPrediction> {
    const response = await fetch(`${atlasBaseUrl(config)}/model/prediction/${encodeURIComponent(id)}`, {
        method: "GET",
        headers: atlasHeaders(config),
    });
    if (!response.ok) throw new Error(await atlasError(response));
    const payload = await response.json();
    return payload?.data || {};
}

async function atlasWaitForPrediction(config: AiConfig, id: string): Promise<AtlasPrediction> {
    const startedAt = Date.now();
    for (;;) {
        const data = await atlasPollPrediction(config, id);
        if (data.status === "completed") return data;
        if (data.status === "failed") throw new Error(data.error || "Atlas Cloud 生成失败");
        if (Date.now() - startedAt > ATLAS_POLL_TIMEOUT_MS) throw new Error("Atlas Cloud 生成超时");
        await new Promise((resolve) => setTimeout(resolve, ATLAS_POLL_INTERVAL_MS));
    }
}

function atlasAspectRatio(size?: string) {
    const value = (size || "").trim().toLowerCase();
    if (["1:1", "3:2", "2:3", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"].includes(value)) return value;
    if (["1024x1024", "2048x2048", "4096x4096"].includes(value)) return "1:1";
    if (["1280x720", "1920x1080", "3840x2160"].includes(value)) return "16:9";
    if (["720x1280", "1080x1920", "2160x3840"].includes(value)) return "9:16";
    if (["832x1248", "1248x832"].includes(value)) return value.includes("1248x832") ? "3:2" : "2:3";
    return undefined;
}

function atlasResolution(quality?: string) {
    const value = (quality || "").trim().toLowerCase();
    if (value === "1k" || value === "low") return "1k";
    if (value === "2k" || value === "medium" || value === "standard") return "2k";
    if (value === "4k" || value === "high" || value === "hd") return "4k";
    return undefined;
}

async function referenceToFile(reference: ReferenceImage) {
    return dataUrlToFile({ ...reference, dataUrl: await imageToDataUrl(reference) });
}

export async function atlasGenerateImage(config: AiConfig, prompt: string, references: ReferenceImage[], size?: string, quality?: string): Promise<AtlasGeneratedImage[]> {
    const body: Record<string, unknown> = {
        model: config.model,
        prompt,
    };
    if (references.length) {
        const urls = await Promise.all(references.map(async (reference) => atlasUploadMedia(config, await referenceToFile(reference))));
        body.images = urls;
    }
    const aspectRatio = atlasAspectRatio(size);
    if (aspectRatio) body.aspect_ratio = aspectRatio;
    const resolution = atlasResolution(quality);
    if (resolution) body.resolution = resolution;

    const id = await atlasCreatePrediction(config, "image", body);
    const prediction = await atlasWaitForPrediction(config, id);
    const outputs = Array.isArray(prediction.outputs) ? prediction.outputs.filter((item) => item) : [];
    if (!outputs.length) throw new Error("Atlas Cloud 图片任务完成但没有返回图片地址");

    const images = await Promise.all(
        outputs.map(async (url) => ({
            id: nanoid(),
            dataUrl: url.startsWith("data:") ? url : await imageToDataUrl({ url }),
        })),
    );
    return images;
}

export async function atlasCreateVideoTask(config: AiConfig, prompt: string, references: ReferenceImage[]): Promise<string> {
    const body: Record<string, unknown> = {
        model: config.model,
        prompt,
    };
    if (references.length) {
        const imageUrl = await atlasUploadMedia(config, await referenceToFile(references[0]));
        body.image_url = imageUrl;
    }
    return atlasCreatePrediction(config, "video", body);
}

export async function atlasPollVideoTask(config: AiConfig, id: string) {
    return atlasPollPrediction(config, id);
}

export async function atlasGenerateVideo(config: AiConfig, prompt: string, references: ReferenceImage[]): Promise<AtlasGeneratedVideo> {
    const body: Record<string, unknown> = {
        model: config.model,
        prompt,
    };
    if (references.length) {
        const imageUrl = await atlasUploadMedia(config, await referenceToFile(references[0]));
        body.image_url = imageUrl;
    }
    const id = await atlasCreatePrediction(config, "video", body);
    const prediction = await atlasWaitForPrediction(config, id);
    const output = Array.isArray(prediction.outputs) ? prediction.outputs.find((item) => item) : undefined;
    if (!output) throw new Error("Atlas Cloud 视频任务完成但没有返回视频地址");
    return { id: nanoid(), url: output };
}
