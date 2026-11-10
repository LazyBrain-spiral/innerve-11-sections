export const faqCategories = ["General", "Registration", "Stay & Travel"] as const;

export type FaqCategory = (typeof faqCategories)[number];

export interface FaqItem {
  q: string;
  a: string;
}

/** Verbatim content from the static build's data.js → faq. */
export const faq: Record<FaqCategory, FaqItem[]> = {
  General: [
    {
      q: "What is Innerve?",
      a: "A 24-hour offline hackathon with challenging problems, exciting swags and goodies for participants. We also conduct seminars and interactions with industry experts.",
    },
    {
      q: "Who is eligible to participate?",
      a: "Innerve 11 welcomes participants passionate about coding with keen interest in problem-solving, i.e., students, professionals, and hobbyists from diverse backgrounds.",
    },
    {
      q: "What are the different phases of the hackathon?",
      a: "Idea Pitching: 15th Dec 2026 - 8th Jan 2027, and the 24-hrs Hackathon: 30th - 31st Jan 2027.",
    },
    {
      q: "What kind of prizes can participants expect?",
      a: "Prizes include cash rewards, goodies, certificates, and special surprises for the winners.",
    },
  ],
  Registration: [
    {
      q: "How do I apply for Innerve 11?",
      a: "Our registration forms are out. Kindly refer to the filling instructions available on the website.",
    },
    {
      q: "Is there a registration fee for Innerve?",
      a: "There is no registration fee. It is open for all.",
    },
    {
      q: "Is there a minimum or maximum size for the team?",
      a: "Yes, minimum 2 and maximum 4 participants are allowed per team.",
    },
    {
      q: "What are the dates of Phase 1 & 2?",
      a: "Idea Pitching: 15th Dec 2026 - 8th Jan 2027 & 24-hrs Hackathon: 30th - 31st Jan 2027.",
    },
  ],
  "Stay & Travel": [
    {
      q: "Where can I stay during the hackathon?",
      a: "Lodging is available at the AIT Campus itself. Mess and stay will be provided to all participants.",
    },
    {
      q: "How do I get to the venue?",
      a: "Location is available below. For any further assistance please contact the OSS Club.",
    },
    {
      q: "Will travel costs be reimbursed?",
      a: "Travel reimbursements will not be provided to participants. Participants are advised to plan their travel accordingly.",
    },
    {
      q: "What should I bring to check-in?",
      a: "Carry your documents and devices. Stay on the lookout for further updates.",
    },
  ],
};
