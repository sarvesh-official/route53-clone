"use client";

import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import Header from "@cloudscape-design/components/header";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <Box padding="l">
      <Header variant="h1">{title}</Header>
      <Box padding={{ top: "l" }}>
        <Alert
          type="info"
          header="Coming soon"
        >
          {description ??
            "This section is part of the Route 53 console and will be available in a future update."}
        </Alert>
      </Box>
    </Box>
  );
}
