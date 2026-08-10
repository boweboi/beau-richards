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

export interface JobFollowUpEmailProps {
  contactName: string;
  jobTitle: string;
  stillLookingUrl: string;
  allSortedUrl: string;
  siteUrl?: string;
}

export default function JobFollowUpEmail({
  contactName = "there",
  jobTitle,
  stillLookingUrl,
  allSortedUrl,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tradiematch.co.nz",
}: JobFollowUpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Still looking for a tradie for &ldquo;{jobTitle}&rdquo;?</Preview>
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
            <Heading style={styles.heading}>
              How&apos;s it going, {contactName}?
            </Heading>
            <Text style={styles.paragraph}>
              A few days ago you posted &ldquo;{jobTitle}&rdquo; on
              TradieMatch. Just checking in — have you found a tradie yet?
            </Text>

            <Button href={allSortedUrl} style={styles.primaryButton}>
              All sorted, found someone
            </Button>
            <Button href={stillLookingUrl} style={styles.secondaryButton}>
              Still looking through TradieMatch
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

JobFollowUpEmail.PreviewProps = {
  contactName: "Sam",
  jobTitle: "Repaint two-bedroom house exterior",
  stillLookingUrl: "https://www.tradiematch.co.nz/homeowner-dashboard?followupAck=1",
  allSortedUrl: "https://www.tradiematch.co.nz/job-followup?token=example",
} as JobFollowUpEmailProps;

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
  primaryButton: {
    backgroundColor: "#ff6a13",
    borderRadius: "6px",
    color: "#0b2035",
    display: "block",
    fontSize: "15px",
    fontWeight: 600,
    padding: "12px 24px",
    textAlign: "center" as const,
    textDecoration: "none",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    border: "1px solid #dde5ea",
    borderRadius: "6px",
    color: "#0b2035",
    display: "block",
    fontSize: "15px",
    fontWeight: 600,
    marginTop: "12px",
    padding: "12px 24px",
    textAlign: "center" as const,
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
