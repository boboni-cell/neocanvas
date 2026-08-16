package handler

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"mime/multipart"
	"strconv"
	"strings"
)

func normalizeArkAgentPlanVideoBody(body []byte, contentType string) ([]byte, string, error) {
	if !strings.HasPrefix(contentType, "multipart/form-data") {
		return body, contentType, nil
	}
	_, params, err := mime.ParseMediaType(contentType)
	if err != nil || params["boundary"] == "" {
		return nil, "", fmt.Errorf("invalid Ark multipart request")
	}
	form, err := multipart.NewReader(bytes.NewReader(body), params["boundary"]).ReadForm(256 << 20)
	if err != nil {
		return nil, "", err
	}
	defer form.RemoveAll()

	payload := map[string]any{"model": firstArkFormValue(form, "model")}
	content := []map[string]any{{"type": "text", "text": firstArkFormValue(form, "prompt")}}
	content = appendArkFormMedia(content, form, "first_frame_url", "image_url", "first_frame")
	content = appendArkFormMedia(content, form, "input_reference[]", "image_url", "reference_image")
	content = appendArkFormMedia(content, form, "last_frame_url", "image_url", "last_frame")
	content = appendArkFormMedia(content, form, "video_reference[]", "video_url", "reference_video")
	content = appendArkFormMedia(content, form, "audio_reference[]", "audio_url", "reference_audio")
	payload["content"] = content

	copyArkStringField(payload, form, "size", "ratio")
	copyArkStringField(payload, form, "resolution_name", "resolution")
	if duration, err := strconv.Atoi(firstArkFormValue(form, "seconds")); err == nil {
		payload["duration"] = duration
	}
	if generateAudio, err := strconv.ParseBool(firstArkFormValue(form, "video_generate_audio")); err == nil {
		payload["generate_audio"] = generateAudio
	}
	encoded, err := json.Marshal(payload)
	return encoded, "application/json", err
}

func appendArkFormMedia(content []map[string]any, form *multipart.Form, field string, mediaType string, role string) []map[string]any {
	for _, value := range form.Value[field] {
		if strings.TrimSpace(value) != "" {
			content = append(content, arkMediaContent(mediaType, role, value))
		}
	}
	for _, header := range form.File[field] {
		file, err := header.Open()
		if err != nil {
			continue
		}
		data, readErr := io.ReadAll(file)
		_ = file.Close()
		if readErr != nil || len(data) == 0 {
			continue
		}
		contentType := header.Header.Get("Content-Type")
		if contentType == "" || contentType == "application/octet-stream" {
			contentType = detectKIEReferenceContentType(header.Filename)
		}
		if contentType == "" {
			contentType = "application/octet-stream"
		}
		value := "data:" + contentType + ";base64," + base64.StdEncoding.EncodeToString(data)
		content = append(content, arkMediaContent(mediaType, role, value))
	}
	return content
}

func arkMediaContent(mediaType string, role string, value string) map[string]any {
	return map[string]any{"type": mediaType, mediaType: map[string]any{"url": value}, "role": role}
}

func firstArkFormValue(form *multipart.Form, field string) string {
	if values := form.Value[field]; len(values) > 0 {
		return values[0]
	}
	return ""
}

func copyArkStringField(payload map[string]any, form *multipart.Form, source string, target string) {
	if value := strings.TrimSpace(firstArkFormValue(form, source)); value != "" {
		payload[target] = value
	}
}
