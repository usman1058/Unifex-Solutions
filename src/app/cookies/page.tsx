import LegalPage from '@/components/legal/legal-page'

const sections = [
  { title: 'What cookies are', paragraphs: ['Cookies are small text files stored by a website in a browser. Similar technologies include local storage, pixels, web beacons, and device identifiers. They help a site remember choices, maintain security, understand usage, and support relevant advertising.'] },
  { title: 'Types we may use', bullets: ['Strictly necessary technologies for security, navigation, forms, sessions, and essential site functions.', 'Preference technologies that remember choices such as consent or display settings.', 'Analytics technologies that help us understand traffic, content performance, and technical issues.', 'Advertising technologies that may measure campaigns or support personalized or non-personalized ads when advertising is enabled and permitted.'] },
  { title: 'Advertising choices', paragraphs: ['If Google AdSense or another advertising product is enabled, third parties may use cookies, web beacons, IP addresses, or similar identifiers to serve and measure ads. You can manage personalized advertising through Google Ads Settings at https://www.google.com/settings/ads and broader choices at https://www.aboutads.info/choices/.'] },
  { title: 'Consent and controls', paragraphs: ['Where consent is legally required, we will ask before enabling non-essential cookies or personalized advertising. Users in the EEA, UK, and Switzerland will be presented with a Google Privacy & messaging CMP or another Google-certified CMP integrated with the IAB TCF when personalized ads are served. You can revisit your choices through the privacy controls presented on this site or by emailing info@unifexsolutions.com.'] },
  { title: 'Browser controls', paragraphs: ['You can block or delete cookies in your browser settings. Blocking strictly necessary technologies may affect forms, authentication, preferences, or other site functions. Changes to this policy will be reflected by the updated date shown on this page.'] },
]

export default function CookiesPage() {
  return <LegalPage eyebrow="Privacy controls" title="Cookie policy" intro="How cookies and similar technologies may support essential features, analytics, consent choices, and advertising on the Unifex Solutions website." updated="August 9, 2026" sections={sections} />
}
