package handler

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"testing"
)

func TestNormalizeArkAgentPlanVideoBodyBuildsContentAndRoles(t *testing.T) {
	var raw bytes.Buffer
	writer := multipart.NewWriter(&raw)
	_ = writer.WriteField("model", "doubao-seedance-2-0-fast-260128")
	_ = writer.WriteField("prompt", "镜头缓慢推进")
	_ = writer.WriteField("seconds", "5")
	_ = writer.WriteField("size", "16:9")
	_ = writer.WriteField("resolution_name", "720p")
	_ = writer.WriteField("video_generate_audio", "true")
	first, _ := writer.CreateFormFile("first_frame_url", "first.png")
	_, _ = first.Write([]byte("first-image"))
	reference, _ := writer.CreateFormFile("input_reference[]", "reference.png")
	_, _ = reference.Write([]byte("reference-image"))
	last, _ := writer.CreateFormFile("last_frame_url", "last.png")
	_, _ = last.Write([]byte("last-image"))
	_ = writer.Close()

	body, contentType, err := normalizeArkAgentPlanVideoBody(raw.Bytes(), writer.FormDataContentType())
	if err != nil {
		t.Fatalf("normalizeArkAgentPlanVideoBody returned error: %v", err)
	}
	if contentType != "application/json" {
		t.Fatalf("contentType = %q, want application/json", contentType)
	}
	var payload struct {
		Model         string `json:"model"`
		Duration      int    `json:"duration"`
		Ratio         string `json:"ratio"`
		Resolution    string `json:"resolution"`
		GenerateAudio bool   `json:"generate_audio"`
		Content       []struct {
			Type     string         `json:"type"`
			Text     string         `json:"text"`
			Role     string         `json:"role"`
			ImageURL map[string]any `json:"image_url"`
		} `json:"content"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}
	if payload.Model != "doubao-seedance-2-0-fast-260128" || payload.Duration != 5 || payload.Ratio != "16:9" || payload.Resolution != "720p" || !payload.GenerateAudio {
		t.Fatalf("unexpected payload settings: %#v", payload)
	}
	if len(payload.Content) != 4 {
		t.Fatalf("content length = %d, want 4", len(payload.Content))
	}
	if payload.Content[0].Type != "text" || payload.Content[0].Text != "镜头缓慢推进" {
		t.Fatalf("unexpected text content: %#v", payload.Content[0])
	}
	wantRoles := []string{"first_frame", "reference_image", "last_frame"}
	for index, role := range wantRoles {
		item := payload.Content[index+1]
		if item.Type != "image_url" || item.Role != role {
			t.Fatalf("content[%d] = %#v, want role %q", index+1, item, role)
		}
		url, _ := item.ImageURL["url"].(string)
		if len(url) < len("data:image/png;base64,") || url[:len("data:image/png;base64,")] != "data:image/png;base64," {
			t.Fatalf("content[%d] image URL is not a data URL", index+1)
		}
	}
}
