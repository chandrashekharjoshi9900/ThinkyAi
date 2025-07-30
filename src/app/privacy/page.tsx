
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, DatabaseZap, UserX } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - ThinkyAI',
  description: 'Understand how ThinkyAI handles your data and respects your privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Privacy <span className="text-primary">Policy</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Your privacy is critically important to us. At ThinkyAI, we have a few fundamental principles.
        </p>
        <p className="text-sm text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </section>

      <Card className="mt-12 glassmorphism">
        <CardContent className="p-6 space-y-6 text-base text-foreground/90">
          <p>
            Lyriqon Innovations ("us", "we", or "our") operates the ThinkyAI application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>

          <h2 className="font-headline text-2xl font-semibold border-b pb-2">Information We Collect</h2>
          <p>
            We operate on a principle of data minimization. This means we only collect the information necessary to provide you with our service.
          </p>
          <div className="space-y-4 pl-4">
              <div className="flex items-start gap-4">
                <UserX className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-semibold">Account Information (for authenticated users)</h3>
                    <p className="text-muted-foreground">If you choose to create an account, we collect your email address solely for authentication purposes. We do not use it for marketing or share it with third parties.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <DatabaseZap className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-semibold">Generation Data</h3>
                    <p className="text-muted-foreground">The topics, questions, and content you submit to our AI are used to generate responses. <strong>We do not save or store your prompts or the AI's generations.</strong> Each interaction is stateless and forgotten once the response is delivered.</p>
                </div>
              </div>
          </div>


          <h2 className="font-headline text-2xl font-semibold border-b pb-2">How We Use Your Information</h2>
          <p>
            The limited information we collect is used exclusively to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and maintain our Service.</li>
            <li>Authenticate your account and secure your access.</li>
            <li>Improve and personalize your experience.</li>
          </ul>

          <h2 className="font-headline text-2xl font-semibold border-b pb-2">Data Security</h2>
          <p>
             The security of your data is important to us. We use industry-standard authentication services (Firebase Authentication) to protect your account information. As we do not store your generation history, the risk of data exposure is significantly minimized.
          </p>

          <h2 className="font-headline text-2xl font-semibold border-b pb-2">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
           <h2 className="font-headline text-2xl font-semibold border-b pb-2">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us. (You can add your contact information here).
          </p>

        </CardContent>
      </Card>
    </div>
  );
}
