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

export interface JobAlertJob {
  title: string;
  location: string;
  description: string;
  postedAt: string;
  url: string;
}

export interface JobAlertEmailProps {
  tradieName: string;
  jobs: JobAlertJob[];
  siteUrl?: string;
  preferencesUrl?: string;
}

function truncate(text: string, max = 140) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export default function JobAlertEmail({
  tradieName = "there",
  jobs,
  // Placeholder — there's no /settings/alerts page in the app yet. Swap
  // this default for a real preferences URL once one exists.
  preferencesUrl = "#",
}: JobAlertEmailProps) {
  const previewText = `${jobs.length} new job${
    jobs.length === 1 ? "" : "s"
  } matching your trade${jobs.length ? `: ${jobs[0].title}` : ""}`;

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
            <Text style={styles.eyebrow}>Daily job digest</Text>
            <Heading style={styles.heading}>
              Hi {tradieName}, {jobs.length} new job
              {jobs.length === 1 ? "" : "s"} for you
            </Heading>
            <Text style={styles.paragraph}>
              New jobs matching your trade categories and service area were
              posted in the last 24 hours.
            </Text>

            {jobs.map((job, i) => (
              <Section key={i} style={styles.jobCard}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobMeta}>
                  {job.location} · {job.postedAt}
                </Text>
                <Text style={styles.jobDescription}>
                  {truncate(job.description)}
                </Text>
                <Button href={job.url} style={styles.jobButton}>
                  View job
                </Button>
              </Section>
            ))}

            <Hr style={styles.hr} />

            <Text style={styles.footer}>
              You&apos;re receiving this because these jobs match a trade
              category and service area on your TradieMatch profile.{" "}
              <Link href={preferencesUrl} style={styles.link}>
                Manage job alert preferences
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

JobAlertEmail.PreviewProps = {
  tradieName: "Sam",
  jobs: [
    {
      title: "Deck repair and restain",
      location: "Ponsonby, Auckland",
      description:
        "Rear deck has several loose boards and needs a full sand and restain before summer. Roughly 25sqm.",
      postedAt: "2 hours ago",
      url: "https://tradiematch.co.nz/jobs/1",
    },
    {
      title: "Bathroom vanity installation",
      location: "Mount Eden, Auckland",
      description:
        "New vanity and mirror purchased, need someone to remove the old unit and install the new one plus reseal.",
      postedAt: "5 hours ago",
      url: "https://tradiematch.co.nz/jobs/2",
    },
  ],
} as JobAlertEmailProps;

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
    fontSize: "20px",
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
    marginBottom: "16px",
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
    margin: "0 0 14px",
  },
  jobButton: {
    backgroundColor: "#ff6a13",
    borderRadius: "6px",
    color: "#0b2035",
    display: "inline-block",
    fontSize: "13px",
    fontWeight: 600,
    padding: "9px 18px",
    textDecoration: "none",
  },
  hr: {
    borderColor: "#dde5ea",
    margin: "8px 0 16px",
  },
  footer: {
    color: "#5c7286",
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
  },
  link: {
    color: "#e35a0a",
    textDecoration: "underline",
  },
};
