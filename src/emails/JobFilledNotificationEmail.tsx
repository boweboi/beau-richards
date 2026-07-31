import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface JobFilledNotificationEmailProps {
  tradieName: string;
  jobTitle: string;
  category: string;
  location: string;
  siteUrl?: string;
}

export default function JobFilledNotificationEmail({
  tradieName = "there",
  jobTitle,
  category,
  location,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tradiematch.co.nz",
}: JobFilledNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>An update on &quot;{jobTitle}&quot;</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Img
              src={`${siteUrl}/favicon.png`}
              width="32"
              height="32"
              alt="TradieMatch"
              style={styles.logo}
            />
            <Text style={styles.headerWordmark}>TradieMatch</Text>
          </Section>

          <Section style={styles.content}>
            <Heading style={styles.heading}>Hi {tradieName},</Heading>
            <Text style={styles.paragraph}>
              Just a heads up — the homeowner has hired another tradie for
              this job, so it&apos;s no longer available:
            </Text>

            <Section style={styles.jobCard}>
              <Text style={styles.jobTitle}>{jobTitle}</Text>
              <Text style={styles.jobMeta}>
                {category} · {location}
              </Text>
            </Section>

            <Text style={styles.paragraph}>
              This one didn&apos;t work out, but there are plenty more jobs
              in your area waiting for a quote. Thanks for being part of
              TradieMatch — we&apos;ll keep sending your way.
            </Text>

            <Button href={`${siteUrl}/jobs`} style={styles.button}>
              Browse more jobs
            </Button>

            <Hr style={styles.hr} />

            <Text style={styles.footer}>
              Questions? Reach us any time at{" "}
              <Link href="mailto:support@tradiematch.co.nz" style={styles.link}>
                support@tradiematch.co.nz
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

JobFilledNotificationEmail.PreviewProps = {
  tradieName: "Sam",
  jobTitle: "Leaky kitchen tap replacement",
  category: "Plumbing",
  location: "Ponsonby, Auckland",
} as JobFilledNotificationEmailProps;

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
  logo: {
    borderRadius: "6px",
    display: "inline-block",
    margin: "0 8px 0 0",
    verticalAlign: "middle",
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
    margin: "0 0 20px",
  },
  jobCard: {
    backgroundColor: "#f6f8fa",
    borderRadius: "8px",
    marginBottom: "20px",
    padding: "16px 20px",
  },
  jobTitle: {
    color: "#0b2035",
    fontSize: "16px",
    fontWeight: 600,
    margin: "0 0 4px",
  },
  jobMeta: {
    color: "#5c7286",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
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
