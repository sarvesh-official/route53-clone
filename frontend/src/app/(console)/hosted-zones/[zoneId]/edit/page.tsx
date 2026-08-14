"use client";

import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Spinner from "@cloudscape-design/components/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { zonesApi } from "@/lib/api/hosted-zones";
import { isApiError } from "@/lib/api/errors";
import { displayDomain } from "@/lib/format/dns";
import { useNotifications } from "@/providers/notifications-provider";

export default function EditHostedZonePage() {
  const params = useParams<{ zoneId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { notify } = useNotifications();

  const { data: zone, isLoading } = useQuery({
    queryKey: ["zone", params.zoneId],
    queryFn: () => zonesApi.get(params.zoneId),
  });

  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (zone) setComment(zone.comment);
  }, [zone]);

  const updateMutation = useMutation({
    mutationFn: () => zonesApi.update(params.zoneId, { comment: comment.trim() }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["zone", params.zoneId] });
      notify({ type: "success", content: `Hosted zone "${displayDomain(updated.name)}" updated successfully.` });
      router.push("/hosted-zones");
    },
    onError: (err) => {
      setError(isApiError(err) ? err.message : "Failed to update hosted zone.");
    },
  });

  if (isLoading) {
    return (
      <Box padding={{ top: "xl" }} textAlign="center">
        <Spinner size="large" />
      </Box>
    );
  }

  if (!zone) {
    return (
      <Box padding={{ top: "m", horizontal: "l" }}>
        <Header variant="h1">Hosted zone not found</Header>
        <Box padding={{ top: "s" }}>
          <Button href="/hosted-zones">Back to hosted zones</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box padding={{ top: "m", horizontal: "l" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          updateMutation.mutate();
        }}
      >
        <Form
          header={<Header variant="h1">Edit hosted zone</Header>}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => router.push("/hosted-zones")}>
                Cancel
              </Button>
              <Button variant="primary" loading={updateMutation.isPending} formAction="submit">
                Save changes
              </Button>
            </SpaceBetween>
          }
          errorText={error}
        >
          <Container
            header={<Header variant="h2">Hosted zone configuration</Header>}
          >
            <SpaceBetween size="m">
              <FormField label="Domain name">
                <Input value={displayDomain(zone.name)} disabled />
              </FormField>

              <FormField label="Type">
                <Input value={zone.type} disabled />
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
                  disabled={updateMutation.isPending}
                />
              </FormField>
            </SpaceBetween>
          </Container>
        </Form>
      </form>
    </Box>
  );
}
