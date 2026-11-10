// Content for Innerve 11 — sourced from innerve.tech. Edit here; the page renders it.
// Ported verbatim from the static build's data.js.

export interface Prize {
  rank: string;
  kanji: string;
  amt: string;
  hot?: boolean;
}

export interface Testimonial {
  name: string;
  org: string;
  quote: string;
}

export interface Sponsor {
  tier: string;
  name: string;
  logo: string;
  url: string;
  size?: "xl" | "l";
}

export interface Track {
  name: string;
  kanji: string;
  desc: string;
}

export const INNERVE = {
  eventStart: "2027-01-30T09:00:00+05:30",

  // headline prize pool in lakhs (the counter in the prize section counts up to this)
  poolLacs: 12,

  // from the legacy static build's data.js (character art/names dropped: fan theme only)
  tracks: [
    { name: "Health", kanji: "蟲", desc: "Heal, detect, protect. Tech that keeps people alive." },
    { name: "AR / VR", kanji: "霞", desc: "Bend what the eye believes. Build worlds inside the world." },
    { name: "EduTech", kanji: "炎", desc: "Pass the fire on. Tools that make learning burn brighter." },
    { name: "GameDev", kanji: "音", desc: "Flamboyant by design. Make something people can't put down." },
    { name: "FinTech", kanji: "岩", desc: "Rock-solid money systems. Payments, credit, inclusion." },
    { name: "CyberSec", kanji: "蛇", desc: "Strike unseen. Find the threat before it finds you." },
    { name: "BlockChain", kanji: "恋", desc: "Bonds that can't be broken. Trust, chained block by block." },
    { name: "Logistics", kanji: "風", desc: "Move faster than the wind. Supply chains, routing, mobility." },
    { name: "Defence", kanji: "水", desc: "Dead calm under pressure. Tech that guards the nation." },
  ] as Track[],

  prizes: [
    { rank: "1st Prize", kanji: "壱", amt: "125K+", hot: true },
    { rank: "2nd Prize", kanji: "弐", amt: "75K+" },
    { rank: "3rd Prize", kanji: "参", amt: "50K+" },
    { rank: "Ingenious Spark", kanji: "閃", amt: "25K+" },
    { rank: "Visionary Spark", kanji: "光", amt: "15K+" },
  ] as Prize[],
  prizePerks: ["Innerve goodies and merch", "Funding and internship opportunities from our sponsors"],

  timeline: [
    { date: "15 Nov 2026", title: "Registration Starts", text: "Secure your spot starting November 15, 2026, at 12:00 AM IST." },
    { date: "31 Dec 2026", title: "Registration Ends", text: "Registration closes on December 31, 2026, at 11:59 PM IST. Don't miss your chance." },
    { date: "08 Jan 2027", title: "Shortlisted Teams Announced", text: "Shortlisted teams will be announced on January 8, 2027. Check back to see if your team advances." },
    { date: "30 Jan 2027", title: "Hackathon Begins", text: "The 24-hour coding marathon starts on January 30, 2027. Build innovative solutions and bring your ideas to life." },
    { date: "31 Jan 2027", title: "Results Announced", text: "Winners will be announced on January 31, 2027. Exciting prizes and recognition await." },
  ],

  testimonials: [
    { name: "Mohit Nippanikar", org: "SVKM's Dwarkadas J. Sanghvi College of Engineering",
      quote: "This has been the best experience I've had over many hackathons. The time management, evaluation process, sponsor support and overall program coordination were exceptionally well planned. Everything from accommodation to a proper execution. It's rare to see such well organized management, and the effort truly showed." },
    { name: "Manasvi Mittal", org: "Indira Gandhi Delhi Technical University for Women",
      quote: "InNerve was honestly such a fun and memorable experience! The mentors were super supportive, and the judges were genuinely interested in understanding our projects and ideas. Learned a lot, had loads of fun, and winning 1st Runner-Up made it even more special!" },
    { name: "Vivek Negi", org: "Army Institute of Technology",
      quote: "Innerve X was an unforgettable journey of innovation and teamwork! The competitive yet thrilling atmosphere pushed us to think creatively and build complex web solutions from scratch, helping us clinch the 2nd Runner-Up title. Can't wait for the next one!" },
  ] as Testimonial[],

  sponsors: [
    { tier: "Title Sponsor", name: "Keychain", logo: "keyChainLogo.svg", url: "https://www.keychain.com/", size: "xl" },
    { tier: "Platinum Sponsor", name: "miniOrange", logo: "miniOrange-black.svg", url: "https://www.miniorange.com/", size: "l" },
    { tier: "Gold Sponsor", name: "Josh Software", logo: "josh.png", url: "https://www.joshsoftware.com/", size: "l" },
    { tier: "Bronze Sponsor", name: "Accops", logo: "Accops_Systems.png", url: "https://www.accops.com/" },
    { tier: "Event Partner", name: "MLH", logo: "MlhLogo1.svg", url: "https://mlh.io/" },
    { tier: "Banking Partner", name: "Bank of Baroda", logo: "Bank_of_Baroda_logo.png", url: "https://bankofbaroda.bank.in/" },
    { tier: "Platform Sponsor", name: "Devfolio", logo: "Devfolio_Logo-Black.svg", url: "https://devfolio.co/" },
    { tier: "Media Partner", name: "Eventopia", logo: "eventopia.svg", url: "https://eventopia.in/" },
    { tier: "Supporting", name: "MongoDB", logo: "MongoDB_Fores-Green.svg", url: "https://www.mongodb.com/" },
    { tier: "Supporting", name: "ETHIndia", logo: "ETHIndiaLogo.png", url: "https://ethindia-villa.devfolio.co/" },
    { tier: "Supporting", name: "GiveMyCertificate", logo: "givemycertficateLogo.png", url: "https://givemycertificate.com/" },
    { tier: "Supporting", name: "Keploy", logo: "keploLogo.png", url: "https://keplo.com/" },
    { tier: "Supporting", name: "CodeCrafters", logo: "CodeCraftersLogo.png", url: "https://codecrafters.io/" },
    { tier: "Supporting", name: "Mastra", logo: "MastraAi.svg", url: "https://mastra.ai/" },
  ] as Sponsor[],
};
