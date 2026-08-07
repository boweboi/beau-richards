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

export interface VerifyEmailProps {
  firstName: string;
  verifyUrl: string;
  siteUrl?: string;
  context?: "tradie-bronze" | "homeowner-signup";
}

const COPY = {
  "tradie-bronze": {
    preview: "Verify your email to unlock Bronze tier",
    paragraph:
      "Confirm this address to unlock Bronze verification on your TradieMatch profile — homeowners see it as a trust signal when they're choosing who to hire.",
  },
  "homeowner-signup": {
    preview: "Verify your email to activate your TradieMatch account",
    paragraph:
      "Confirm this address to activate your TradieMatch account — you'll need to verify before you can post a job.",
  },
} as const;

export default function VerifyEmail({
  firstName = "there",
  verifyUrl,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tradiematch.co.nz",
  context = "tradie-bronze",
}: VerifyEmailProps) {
  const copy = COPY[context];

  return (
    <Html>
      <Head />
      <Preview>{copy.preview}</Preview>
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
            <Heading style={styles.heading}>Verify your email, {firstName}.</Heading>
            <Text style={styles.paragraph}>{copy.paragraph}</Text>

            <Button href={verifyUrl} style={styles.button}>
              Verify my email
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

VerifyEmail.PreviewProps = {
  firstName: "Sam",
  verifyUrl: "https://www.tradiematch.co.nz/auth/confirm?token_hash=example&type=magiclink",
} as VerifyEmailProps;

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
