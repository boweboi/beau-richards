import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export interface LeadPurchaseReceiptProps {
  tradieName: string;
  receiptNumber: string;
  jobTitle: string;
  category: string;
  location: string;
  price?: number;
  estimatedResponseTime?: string;
  siteUrl?: string;
  dashboardUrl?: string;
}

function formatNzd(amount: number) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  }).format(amount);
}

export default function LeadPurchaseReceipt({
  tradieName = "there",
  receiptNumber,
  jobTitle,
  category,
  location,
  price = 20,
  estimatedResponseTime = "within 24 hours",
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL,
  dashboardUrl = `${siteUrl}/dashboard`,
}: LeadPurchaseReceiptProps) {
  const previewText = `Receipt ${receiptNumber}: you unlocked "${jobTitle}" for ${formatNzd(
    price
  )}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.headerMark}>TM</Text>
            <Text style={styles.headerWordmark}>TradieMatch</Text>
          </Section>

          <Section style={styles.content}>
            <Heading style={styles.heading}>Lead purchase receipt</Heading>
            <Text style={styles.paragraph}>
              Hi {tradieName}, you&apos;ve successfully unlocked the contact
              details for this job.
            </Text>

            <Section style={styles.card}>
              <Row>
                <Column>
                  <Text style={styles.cardLabel}>Receipt number</Text>
                  <Text style={styles.cardValue}>{receiptNumber}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={styles.cardLabel}>Job</Text>
                  <Text style={styles.cardValue}>{jobTitle}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={styles.cardLabel}>Category</Text>
                  <Text style={styles.cardValue}>{category}</Text>
                </Column>
                <Column>
                  <Text style={styles.cardLabel}>Location</Text>
                  <Text style={styles.cardValue}>{location}</Text>
                </Column>
              </Row>
              <Hr style={styles.cardHr} />
              <Row>
                <Column>
                  <Text style={styles.totalLabel}>Amount charged</Text>
                </Column>
                <Column align="right">
                  <Text style={styles.totalValue}>{formatNzd(price)}</Text>
                </Column>
              </Row>
            </Section>

            <Text style={styles.responseNote}>
              Estimated response time: {estimatedResponseTime}
            </Text>

            <Button href={dashboardUrl} style={styles.button}>
              View job on dashboard
            </Button>

            <Hr style={styles.hr} />

            <Text style={styles.footer}>
              This charge is final and non-refundable, including if the
              homeowner doesn&apos;t respond or has already hired another
              tradie. Questions about this charge? Reply to this email or
              contact support@tradiematch.co.nz.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

LeadPurchaseReceipt.PreviewProps = {
  tradieName: "Mike",
  receiptNumber: "TM-10482",
  jobTitle: "Leaky kitchen tap replacement",
  category: "Plumbing",
  location: "Ponsonby, Auckland",
  price: 20,
  estimatedResponseTime: "within 24 hours",
} as LeadPurchaseReceiptProps;

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
    margin: "0 0 20px",
  },
  card: {
    backgroundColor: "#f6f8fa",
    borderRadius: "8px",
    marginBottom: "24px",
    padding: "16px 20px",
  },
  cardLabel: {
    color: "#5c7286",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.05em",
    margin: "0 0 2px",
    textTransform: "uppercase" as const,
  },
  cardValue: {
    color: "#0b2035",
    fontSize: "15px",
    fontWeight: 600,
    margin: "0 0 12px",
  },
  cardHr: {
    borderColor: "#dde5ea",
    margin: "4px 0 12px",
  },
  totalLabel: {
    color: "#0b2035",
    fontSize: "14px",
    fontWeight: 600,
    margin: 0,
  },
  totalValue: {
    color: "#e35a0a",
    fontSize: "16px",
    fontWeight: 700,
    margin: 0,
    textAlign: "right" as const,
  },
  responseNote: {
    color: "#33475a",
    fontSize: "13px",
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
    margin: 0,
  },
};
