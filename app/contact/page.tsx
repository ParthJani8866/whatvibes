import type { Metadata } from 'next'

import InfoPageLayout from '@/app/components/InfoPageLayout'

export const metadata: Metadata = {
  title: 'Contact | Bio For IG',
  description:
    'Contact Bio For IG for support, privacy requests, policy questions, and general business inquiries.',
}

const contactTopics = [
  'Account access or sign-in issues',
  'Questions about billing or subscriptions',
  'Privacy, data, or policy requests',
  'Partnership, media, or business inquiries',
]

export default function ContactPage() {
  return (
    <InfoPageLayout
      title="Contact Us"
      description="Reach Bio For IG for support, policy requests, billing questions, or general business inquiries."
    >
      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Email support</h2>
        <p className="mt-3">
          Email us at{' '}
          <a
            href="mailto:info@bioforig.com"
            className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-2"
          >
            info@bioforig.com
          </a>
          . This is the best contact method for support, legal notices, privacy
          requests, and general questions about the service.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">What to include</h2>
        <p className="mt-3">
          To help us respond faster, include your account email address, a short
          description of the issue, and any relevant page URL or screenshot when
          you contact us.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Common topics</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          {contactTopics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Privacy requests</h2>
        <p className="mt-3">
          If you want to request access to, correction of, or deletion of your
          personal information, email us from the address associated with your
          account and mention that your message is a privacy request.
        </p>
      </div>
    </InfoPageLayout>
  )
}
