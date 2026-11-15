import LegalPage from '@/components/legal/legal-page'

const sections = [
  {
    title: 'Who we are',
    paragraphs: [
      'This Privacy Policy explains how Unifex Solutions collects, uses, stores, and shares information when you visit this website, contact us, subscribe to updates, submit a project request, or use our public order-status tools.',
      'Unifex Solutions is a registered company and the data controller for information handled through this website. For privacy questions or requests, email info@unifexsolutions.com.',
    ],
  },
  {
    title: 'Information we collect',
    bullets: [
      'Contact and project information such as your name, email address, company, phone number, subject, message, budget, and project details.',
      'Order and payment-submission information such as an order reference, payment method, amount, receipt file, and status updates. Payment credentials are not collected by this website.',
      'Newsletter information such as your email address and subscription status. Contact info@unifexsolutions.com to request removal from the list.',
      'Technical information such as IP address, browser type, device information, approximate location, pages viewed, referring pages, and security or diagnostic logs.',
      'Other information you choose to provide through forms on the website.',
    ],
  },
  {
    title: 'How we use information',
    bullets: [
      'To respond to enquiries, evaluate project fit, provide requested services, and communicate about an engagement.',
      'To process and track service orders, payment evidence, support requests, and operational messages.',
      'To deliver newsletters or other updates when you subscribe, with an unsubscribe option where applicable.',
      'To operate, secure, troubleshoot, measure, and improve the website and its content.',
      'To comply with legal obligations, enforce our terms, prevent abuse, and protect users and the business.',
    ],
  },
  {
    title: 'Cookies, advertising, and Google services',
    paragraphs: [
      'The website currently uses local storage to remember your optional privacy choice and may use cookies needed for essential functions. No analytics or advertising tags are currently loaded. If those services are added, this policy and the consent controls will be updated before they are enabled.',
      'If Google AdSense or another advertising product is enabled, Google and its advertising partners may place and read cookies on your browser, use web beacons or IP addresses, and process information about your visits to this website or other websites to measure or personalize advertising. Third-party vendors, including Google, may serve ads based on a user\'s prior visits to this website or other websites.',
      'You can manage personalized advertising through Google Ads Settings at https://www.google.com/settings/ads and learn about broader third-party advertising choices at https://www.aboutads.info/choices/.',
      'The current site banner is a basic preference control, not a Google-certified consent management platform. Before serving personalized Google ads to users in the European Economic Area, the United Kingdom, or Switzerland, configure a Google-certified CMP integrated with the IAB Transparency and Consent Framework and obtain the required consent. Applicable privacy laws may require additional controls for other advertising modes.',
    ],
    links: [
      { label: 'How Google uses data when you use partner sites or apps', href: 'https://policies.google.com/technologies/partner-sites' },
    ],
  },
  {
    title: 'Sharing and service providers',
    paragraphs: [
      'We may share information with trusted service providers that host infrastructure, provide databases, email delivery, analytics, security, file storage, payment or banking workflows, customer support, or advertising technology. They may process information only for the services they provide and under appropriate contractual or technical controls.',
      'We may also disclose information when required by law, to respond to lawful requests, protect rights and safety, investigate abuse, or support a business transfer. We do not sell contact-form information as a standalone product.',
    ],
  },
  {
    title: 'Retention and security',
    paragraphs: [
      'We retain information only for as long as reasonably necessary for the purpose collected, an active business relationship, legal obligations, dispute resolution, security, or legitimate record keeping. Retention periods may differ by data type.',
      'We use access controls, secure transport, server-side protections, and operational safeguards appropriate to the information handled. No internet transmission or storage system can be guaranteed completely secure.',
    ],
  },
  {
    title: 'Your choices and rights',
    paragraphs: [
      'Depending on where you live, you may have rights to access, correct, delete, restrict, object to, or request portability of personal information, and to withdraw consent where processing is based on consent. You may also request a copy of information we hold about you or ask us to stop non-essential communications.',
      'To make a request, email info@unifexsolutions.com with enough detail for us to identify the request. We may need to verify identity before responding. You may also have the right to contact your local data-protection authority.',
    ],
  },
  {
    title: 'Children and updates',
    paragraphs: [
      'This website is intended for a general business audience and is not directed to children under 13. We do not knowingly collect personal information from children.',
      'We may update this policy when our services, legal obligations, or technology change. The effective date at the top of this page identifies the latest version. Material changes will be highlighted where appropriate.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  return <LegalPage eyebrow="Privacy and data use" title="Privacy policy" intro="A clear explanation of the information Unifex Solutions handles, why we handle it, which partners may process it, and how you can make privacy choices." updated="November 15, 2026" sections={sections} />
}
