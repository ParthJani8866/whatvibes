import type { Metadata } from 'next'

import InfoPageLayout from '@/app/components/InfoPageLayout'

export const metadata: Metadata = {
  title: 'Terms of Service | Bio For IG',
  description:
    'Review the Bio For IG Terms of Service for the rules, responsibilities, and conditions that apply when using the platform.',
}

export default function TermsOfServicePage() {
  return (
    <InfoPageLayout
      title="Terms of Service"
      description="These Terms of Service govern your access to and use of the Bio For IG website, products, and services."
    >
      <div>
        <p>
          Effective date: March 29, 2026. By accessing or using Bio For IG, you
          agree to these Terms of Service. If you do not agree, do not use the
          service.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Use of service</h2>
        <p className="mt-3">
          Bio For IG provides tools that allow users to create public bio pages,
          manage links, and use related creator features. You agree to use the
          service only for lawful purposes and in a way that does not infringe
          the rights of others or interfere with the operation of the platform.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Accounts</h2>
        <p className="mt-3">
          You are responsible for the accuracy of the information associated
          with your account and for maintaining the security of your sign-in
          credentials. You are responsible for activity that occurs through your
          account unless caused by our failure to use reasonable security
          measures.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">
          User content and links
        </h2>
        <p className="mt-3">
          You retain responsibility for the content, links, images, text, and
          other materials you publish through Bio For IG. You must have the
          rights necessary to use that content, and it must not be unlawful,
          misleading, defamatory, infringing, abusive, or harmful.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">
          Prohibited activities
        </h2>
        <p className="mt-3">
          You may not use the service to distribute malware, phishing pages,
          spam, deceptive offers, illegal content, or materials that violate
          another party&apos;s intellectual property or privacy rights. We may
          remove content or suspend access where necessary to protect the
          platform, users, or third parties.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">
          Paid features and billing
        </h2>
        <p className="mt-3">
          Some features may be offered on a paid basis. If you purchase a paid
          plan, you agree to provide accurate billing information and authorize
          the applicable payment processor to charge the fees disclosed at the
          time of purchase. Unless stated otherwise, fees are non-refundable
          except where required by law.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">
          Availability and changes
        </h2>
        <p className="mt-3">
          We may modify, suspend, or discontinue any part of the service at any
          time, including features, pricing, or availability. We do not
          guarantee uninterrupted or error-free operation.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">
          Disclaimer and limitation of liability
        </h2>
        <p className="mt-3">
          The service is provided on an as-is and as-available basis to the
          maximum extent permitted by law. Bio For IG disclaims implied
          warranties of merchantability, fitness for a particular purpose, and
          non-infringement. To the maximum extent permitted by law, Bio For IG
          will not be liable for indirect, incidental, special, consequential,
          or punitive damages, or for loss of profits, data, goodwill, or
          business opportunities.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Termination</h2>
        <p className="mt-3">
          We may suspend or terminate access to the service if we reasonably
          believe these terms have been violated, if required by law, or if the
          service is being used in a way that creates risk for Bio For IG or
          others.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Contact</h2>
        <p className="mt-3">
          Questions about these Terms of Service can be sent to{' '}
          <a
            href="mailto:info@bioforig.com"
            className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-2"
          >
            info@bioforig.com
          </a>
          .
        </p>
      </div>
    </InfoPageLayout>
  )
}
