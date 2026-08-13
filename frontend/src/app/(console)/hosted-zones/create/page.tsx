"use client";

import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import RadioGroup from "@cloudscape-design/components/radio-group";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { zonesApi } from "@/lib/api/hosted-zones";
import { isApiError } from "@/lib/api/errors";
import { useNotifications } from "@/providers/notifications-provider";
import type { ZoneType } from "@/types/hosted-zone";

export default function CreateHostedZonePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [type, setType] = useState<ZoneType>("PUBLIC");
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: zonesApi.create,
    onSuccess: (zone) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      notify({ type: "success", content: `Hosted zone "${zone.name}" created successfully.` });
      router.push("/hosted-zones");
    },
    onError: (err) => {
      setError(isApiError(err) ? err.message : "Failed to create hosted zone.");
    },
  });

  const onSubmit = () => {
    setError(null);
    if (!name.trim()) {
      setError("Domain name is required.");
      return;
    }
    createMutation.mutate({ name: name.trim(), type, comment: comment.trim() });
  };

  return (
    <Box padding={{ top: "m", horizontal: "l" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Form
          header={
            <Header
              variant="h1"
              info={
                <Button variant="icon" iconName="status-info" ariaLabel="More information about Create hosted zone">
                  Info
                </Button>
              }
            >
              Create hosted zone
            </Header>
          }
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => router.push("/hosted-zones")}>
                Cancel
              </Button>
              <Button variant="primary" loading={createMutation.isPending} formAction="submit">
                Create hosted zone
              </Button>
            </SpaceBetween>
          }
          errorText={error}
        >
          <SpaceBetween size="l">
            <Container
              header={
                <Header
                  variant="h2"
                  info={
                    <Button variant="icon" iconName="status-info" ariaLabel="More information about Hosted zone configuration">
                      Info
                    </Button>
                  }
                >
                  Hosted zone configuration
                </Header>
              }
            >
              <SpaceBetween size="m">
                <Box variant="p" color="text-body-secondary">
                  A hosted zone is a container that holds information about how you want to route traffic for a domain, such as example.com, and its subdomains.
                </Box>

                <FormField
                  label="Domain name"
                  description="This is the name of the domain that you want to route traffic for."
                  constraintText="Valid characters: a-z, 0-9, and special characters"
                >
                  <Input
                    value={name}
                    onChange={(e) => setName(e.detail.value)}
                    placeholder="example.com"
                    disabled={createMutation.isPending}
                  />
                </FormField>

                <FormField
                  label="Description - optional"
                  description="This value lets you distinguish hosted zones that have the same name."
                  constraintText={`The description can have up to 256 characters. ${comment.length}/256`}
                >
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.detail.value)}
                    placeholder="The hosted zone is used for..."
                    disabled={createMutation.isPending}
                  />
                </FormField>

                <FormField
                  label="Type"
                  description="The type indicates whether you want to route traffic on the internet or in an Amazon VPC."
                >
                  <RadioGroup
                    value={type}
                    onChange={(e) => setType(e.detail.value as ZoneType)}
                    items={[
                      {
                        value: "PUBLIC",
                        label: "Public hosted zone",
                        description: "A public hosted zone determines how traffic is routed on the internet.",
                      },
                      {
                        value: "PRIVATE",
                        label: "Private hosted zone",
                        description: "A private hosted zone determines how traffic is routed within an Amazon VPC.",
                      },
                    ]}
                  />
                </FormField>
              </SpaceBetween>
            </Container>

            <Container
              header={
                <Header
                  variant="h2"
                  info={
                    <Button variant="icon" iconName="status-info" ariaLabel="More information about Tags">
                      Info
                    </Button>
                  }
                >
                  Tags
                </Header>
              }
            >
              <SpaceBetween size="m">
                <Box variant="p" color="text-body-secondary">
                  Apply tags to hosted zones to help organize and identify them.
                </Box>
                <Box variant="p">No tags associated with the resource.</Box>
                <Box>
                  <Button>Add tag</Button>
                  <span style={{ marginLeft: 8, fontSize: 12, color: "#687078" }}>
                    You can add up to 50 more tags.
                  </span>
                </Box>
              </SpaceBetween>
            </Container>
          </SpaceBetween>
        </Form>
      </form>
    </Box>
  );
}
