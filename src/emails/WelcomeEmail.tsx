import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface WelcomeEmailProps {
  firstName: string;
  role?: "tradie" | "homeowner";
  siteUrl?: string;
  unsubscribeUrl?: string;
}

const roleCopy = {
  tradie: {
    intro:
      "TradieMatch connects you with homeowners across Aotearoa who need work done in your trade — no cold calling, no chasing. Browse jobs in your area, buy the leads you want, and get in touch directly.",
    cta: "Start browsing jobs",
    ctaPath: "/jobs",
  },
  homeowner: {
    intro:
      "TradieMatch connects you with verified local tradies who are ready to quote on your job. Post the details once, and tradies in your area will reach out directly.",
    cta: "Post your first job",
    ctaPath: "/post-a-job",
  },
};

export default function WelcomeEmail({
  firstName = "there",
  role = "homeowner",
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL,
  // Placeholder — there's no /unsubscribe page in the app yet. Swap this
  // default for a real unsubscribe URL once one exists.
  unsubscribeUrl = "#",
}: WelcomeEmailProps) {
  const copy = roleCopy[role];

  return (
    <Html>
      <Head />
      <Preview>Welcome to TradieMatch, {firstName}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.headerMark}>TM</Text>
            <Text style={styles.headerWordmark}>TradieMatch</Text>
          </Section>

          <Section style={styles.content}>
            <Heading style={styles.heading}>Welcome, {firstName}.</Heading>
            <Text style={styles.paragraph}>{copy.intro}</Text>

            <Button
              href={`${siteUrl}${copy.ctaPath}`}
              style={styles.button}
            >
              {copy.cta}
            </Button>

            <Hr style={styles.hr} />

            <Text style={styles.footer}>
              Questions? Reach us any time at{" "}
              <Link href="mailto:support@tradiematch.co.nz" style={styles.link}>
                support@tradiematch.co.nz
              </Link>
              .
            </Text>
            <Text style={styles.footer}>
              TradieMatch NZ ·{" "}
              <Link href={unsubscribeUrl} style={styles.link}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  firstName: "Sam",
  role: "tradie",
} as WelcomeEmailProps;

const styles = {
  body: {
    backgroundColor: "#f6f8fa",
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
    margin: 0,
    padding: "24px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    margin: "0 auto",
    maxWidth: "480px",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#0b2035",
    padding: "20px 32px",
  },
  headerMark: {
    backgroundColor: "#ff6a13",
    borderRadius: "6px",
    color: "#0b2035",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: "32px",
    margin: "0 8px 0 0",
    textAlign: "center" as const,
    verticalAlign: "middle",
    width: "32px",
  },
  headerWordmark: {
    color: "#ffffff",
    display: "inline-block",
    fontSize: "18px",
    fontWeight: 600,
    margin: 0,
    verticalAlign: "middle",
  },
  content: {
    padding: "32px",
  },
  heading: {
    color: "#0b2035",
    fontSize: "22px",
    fontWeight: 600,
    margin: "0 0 12px",
  },
  paragraph: {
    color: "#33475a",
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 24px",
  },
  button: {
    backgroundColor: "#ff6a13",
    borderRadius: "6px",
    color: "#0b2035",
    display: "inline-block",
    fontSize: "15px",
    fontWeight: 600,
    padding: "12px 24px",
    textDecoration: "none",
  },
  hr: {
    borderColor: "#dde5ea",
    margin: "32px 0 16px",
  },
  footer: {
    color: "#5c7286",
    fontSize: "13px",
    lineHeight: "20px",
    margin: "0 0 4px",
  },
  link: {
    color: "#e35a0a",
    textDecoration: "underline",
  },
};
