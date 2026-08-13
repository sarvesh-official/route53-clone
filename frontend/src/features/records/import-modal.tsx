"use client";

import Alert from "@cloudscape-design/components/alert";
import Button from "@cloudscape-design/components/button";
import FormField from "@cloudscape-design/components/form-field";
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Textarea from "@cloudscape-design/components/textarea";
import { useRef, useState } from "react";

interface ImportModalProps {
  visible: boolean;
  onDismiss: () => void;
  onImport: (content: string) => void;
  submitting: boolean;
}

export function ImportModal({
  visible,
  onDismiss,
  onImport,
  submitting,
}: ImportModalProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setContent(String(reader.result ?? ""));
      setError(null);
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      setError("Paste BIND zone file content or upload a file.");
      return;
    }
    onImport(content);
  };

  const handleDismiss = () => {
    setContent("");
    setError(null);
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={handleDismiss}
      header="Import BIND zone file"
      footer={
        <SpaceBetween direction="horizontal" size="xs">
          <Button variant="link" onClick={handleDismiss}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>
            Import
          </Button>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="m">
        <Alert type="info" header="BIND format">
          Existing records with the same name, type, and value will be skipped.
        </Alert>
        <FormField
          label="Upload file"
          description="Select a BIND zone file from your computer."
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.zone,.db,text/plain"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <Button
            iconName="upload"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
          >
            Choose file
          </Button>
        </FormField>
        <FormField
          label="Or paste zone file content"
          errorText={error ?? undefined}
        >
          <Textarea
            value={content}
            onChange={(e) => {
              setContent(e.detail.value);
              setError(null);
            }}
            rows={10}
            placeholder={"$ORIGIN example.com.\n$TTL 300\nwww  IN  A  192.0.2.1"}
            disabled={submitting}
          />
        </FormField>
      </SpaceBetween>
    </Modal>
  );
}
