"use client";

import Button from "@cloudscape-design/components/button";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Modal from "@cloudscape-design/components/modal";
import Select from "@cloudscape-design/components/select";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Textarea from "@cloudscape-design/components/textarea";
import { useEffect, useState } from "react";

import type {
  CreatableRecordType,
  DnsRecord,
  DnsRecordCreatePayload,
  DnsRecordUpdatePayload,
} from "@/types/dns-record";
import { CREATABLE_RECORD_TYPES } from "@/types/dns-record";

interface RecordModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (payload: DnsRecordCreatePayload | DnsRecordUpdatePayload) => void;
  submitting: boolean;
  mode: "create" | "edit";
  record?: DnsRecord | null;
  zoneName?: string;
}

export function RecordModal({
  visible,
  onDismiss,
  onSubmit,
  submitting,
  mode,
  record,
  zoneName,
}: RecordModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<CreatableRecordType>("A");
  const [ttl, setTtl] = useState("300");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && record) {
        setName(record.name);
        setType(record.type as CreatableRecordType);
        setTtl(String(record.ttl));
        setValue(record.value);
      } else {
        setName("");
        setType("A");
        setTtl("300");
        setValue("");
      }
      setError(null);
    }
  }, [visible, mode, record]);

  const handleSubmit = () => {
    setError(null);
    if (!name.trim()) {
      setError("Record name is required.");
      return;
    }
    if (!value.trim()) {
      setError("Value is required.");
      return;
    }
    const ttlNum = parseInt(ttl, 10);
    if (isNaN(ttlNum) || ttlNum < 0 || ttlNum > 2147483647) {
      setError("TTL must be a number between 0 and 2147483647.");
      return;
    }
    if (mode === "edit") {
      onSubmit({ ttl: ttlNum, value: value.trim() });
    } else {
      onSubmit({
        name: name.trim(),
        type,
        ttl: ttlNum,
        value: value.trim(),
        routing_policy: "SIMPLE",
      });
    }
  };

  const isEdit = mode === "edit";

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      header={isEdit ? "Edit record" : "Create record"}
      footer={
        <SpaceBetween direction="horizontal" size="xs">
          <Button variant="link" onClick={onDismiss}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>
            {isEdit ? "Save changes" : "Create record"}
          </Button>
        </SpaceBetween>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Form errorText={error}>
          <SpaceBetween size="m">
            <FormField
              label="Record name"
              description={
                zoneName
                  ? `Appended to ${zoneName} if not a fully qualified domain name.`
                  : undefined
              }
            >
              <Input
                value={name}
                onChange={(e) => setName(e.detail.value)}
                placeholder="www"
                disabled={submitting || isEdit}
              />
            </FormField>
            <FormField label="Record type">
              <Select
                selectedOption={{ value: type, label: type }}
                onChange={(e) =>
                  setType(e.detail.selectedOption.value as CreatableRecordType)
                }
                options={CREATABLE_RECORD_TYPES.map((t) => ({
                  value: t,
                  label: t,
                }))}
                disabled={submitting || isEdit}
              />
            </FormField>
            <FormField label="TTL (seconds)">
              <Input
                value={ttl}
                onChange={(e) => setTtl(e.detail.value)}
                type="number"
                disabled={submitting}
              />
            </FormField>
            <FormField
              label="Value"
              description={
                type === "MX"
                  ? "Format: priority domain (e.g., 10 mail.example.com)"
                  : type === "SRV"
                    ? "Format: priority weight port target"
                    : type === "CAA"
                      ? "Format: flags tag value (e.g., 0 issue letsencrypt.org)"
                      : undefined
              }
            >
              <Textarea
                value={value}
                onChange={(e) => setValue(e.detail.value)}
                placeholder="192.0.2.1"
                disabled={submitting}
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </form>
    </Modal>
  );
}
