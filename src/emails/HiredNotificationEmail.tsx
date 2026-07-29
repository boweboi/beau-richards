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

export interface HiredNotificationEmailProps {
  tradieName: string;
  jobTitle: string;
  category: string;
  location: string;
  description?: string;
  siteUrl?: string;
}

function truncate(text: string, max = 160) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export default function HiredNotificationEmail({
  tradieName = "there",
  jobTitle,
  category,
  location,
  description,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tradiematch.co.nz",
}: HiredNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;ve been hired for &quot;{jobTitle}&quot;</Preview>
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
            <Text style={styles.eyebrow}>You&apos;re hired 🎉</Text>
            <Heading style={styles.heading}>
              Congratulations, {tradieName}!
            </Heading>
            <Text style={styles.paragraph}>
              Great news — the homeowner has chosen you for their job. Here
              are the details:
            </Text>

            <Section style={styles.jobCard}>
              <Text style={styles.jobTitle}>{jobTitle}</Text>
              <Text style={styles.jobMeta}>
                {category} · {location}
              </Text>
              {description && (
                <Text style={styles.jobDescription}>
                  {truncate(description)}
                </Text>
              )}
            </Section>

            <Text style={styles.paragraph}>
              Reach out to confirm the details and get started whenever
              you&apos;re ready. Thanks for being part of TradieMatch — it&apos;s
              tradies like you who make this whole thing work.
            </Text>

            <Button href={`${siteUrl}/tradie-dashboard`} style={styles.button}>
              View your dashboard
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

HiredNotificationEmail.PreviewProps = {
  tradieName: "Sam",
  jobTitle: "Leaky kitchen tap replacement",
  category: "Plumbing",
  location: "Ponsonby, Auckland",
  description:
    "Kitchen tap has been dripping for a couple of weeks and needs a proper replacement, not just a washer.",
} as HiredNotificationEmailProps;

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
  eyebrow: {
    color: "#e35a0a",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    margin: "0 0 8px",
    textTransform: "uppercase" as const,
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
    margin: "0 0 10px",
    textTransform: "uppercase" as const,
  },
  jobDescription: {
    color: "#33475a",
    fontSize: "14px",
    lineHeight: "21px",
    margin: 0,
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
