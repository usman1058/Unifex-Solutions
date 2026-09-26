import LegalPage from '@/components/legal/legal-page'

const sections = [
  {
    title: 'Agreement and eligibility',
    paragraphs: [
      'By accessing this website or engaging Unifex Solutions, you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the website or submit an order.',
      'Unifex Solutions is an independent digital studio operating under the Unifex Solutions brand. These terms do not represent the brand as a registered company or organization.',
      'You must be legally able to enter into an agreement in your jurisdiction. If you act for a company, you confirm that you have authority to bind that company.',
    ],
  },
  {
    title: 'Website content and acceptable use',
    bullets: [
      'Use the website lawfully and do not attempt to disrupt, probe, reverse engineer, scrape, overload, or bypass its security or access controls.',
      'Do not submit unlawful, infringing, deceptive, harmful, malicious, or confidential information that you are not authorized to share.',
      'Do not use our content, brand, code, visual systems, or materials to misrepresent an affiliation with Unifex Solutions.',
      'We may suspend access or remove submissions that create legal, security, operational, or safety risk.',
    ],
  },
  {
    title: 'Services, proposals, and scope',
    paragraphs: [
      'Service pages describe typical capabilities and indicative pricing. A project is not accepted until both parties agree to a written proposal, statement of work, or other engagement document that defines scope, deliverables, timeline, responsibilities, fees, taxes, revisions, hosting, support, and acceptance criteria.',
      'We may ask for clarification before accepting a request. Indicative pricing, availability, technologies, and delivery estimates may change after discovery.',
    ],
  },
  {
    title: 'Orders, payments, and refunds',
    paragraphs: [
      'Submitting an order or project request does not by itself guarantee acceptance or start work. Work begins after the applicable proposal is accepted and required payment or deposit conditions are met.',
      'Fees, payment milestones, cancellation terms, refunds, taxes, third-party costs, and late-payment consequences are governed by the applicable written engagement document. Do not upload payment-card numbers or banking credentials through this website.',
    ],
  },
  {
    title: 'Intellectual property',
    paragraphs: [
      'Unifex Solutions retains ownership of its pre-existing tools, reusable components, processes, templates, know-how, trademarks, and general methods. Unless an engagement document states otherwise, the client receives rights to final paid deliverables for the agreed purpose after all amounts due are paid.',
      'You retain ownership of materials you provide, but grant us the limited rights needed to review, modify, store, and use them to provide the requested service. You confirm that you have the rights required to provide those materials.',
    ],
  },
  {
    title: 'Third-party services and availability',
    paragraphs: [
      'Projects may depend on third-party hosting, APIs, payment providers, domains, analytics, advertising networks, open-source software, or client-managed systems. Those services have their own terms and availability, and their outages, pricing, policy changes, or security incidents may affect delivery.',
      'The website and its content are provided on an availability basis. We do not promise that every page, integration, or feature will always be uninterrupted, error-free, or suitable for a particular purpose.',
    ],
  },
  {
    title: 'Warranties and liability',
    paragraphs: [
      'To the extent permitted by law, Unifex Solutions disclaims implied warranties not expressly stated in a written engagement document. Nothing in these terms excludes liability that cannot legally be excluded, including liability for fraud or deliberate misconduct.',
      'To the extent permitted by law, neither party is liable for indirect, incidental, special, consequential, or loss-of-profit damages. Any agreed liability cap will be stated in the applicable engagement document; otherwise, the maximum aggregate liability for a website-related claim is limited to the fees paid for the specific service giving rise to the claim during the six months before the event.',
    ],
  },
  {
    title: 'Termination and changes',
    paragraphs: [
      'Either party may end an engagement according to its written terms. We may suspend website access for security, legal, or operational reasons. Ending access does not remove payment obligations or provisions that are intended to survive termination.',
      'We may update these terms from time to time. Continued use after an update means you accept the revised terms. If a provision is unenforceable, the remaining provisions remain in effect.',
    ],
  },
  {
    title: 'Governing law and contact',
    paragraphs: [
      'These terms are governed by the laws applicable to the jurisdiction in which Unifex Solutions is registered, without regard to conflict-of-law rules. Any mandatory consumer or data-protection rights remain unaffected.',
      'For questions about these terms, email info@unifexsolutions.com or use the contact page.',
    ],
  },
]

export default function TermsPage() {
  return <LegalPage eyebrow="Legal terms" title="Terms of service" intro="The rules for using this website, requesting services, submitting materials, reviewing indicative pricing, and entering a project engagement with Unifex Solutions." updated="August 9, 2026" sections={sections} />
}
