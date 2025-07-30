
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - ThinkyAI',
  description: 'Learn more about the team and mission behind ThinkyAI.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          About <span className="text-primary">Lyriqon Innovations</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          We are a team of innovators, creators, and thinkers passionate about leveraging technology to solve real-world problems.
        </p>
      </section>

      <Card className="mt-12 glassmorphism">
        <CardHeader>
          <CardTitle className="font-headline text-center text-3xl">
            Welcome to ThinkyAI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-base text-foreground/90">
            <p>
                <strong>[This is placeholder text. Please replace this with your company's information.]</strong>
            </p>
            <p>
                Welcome to Lyriqon Innovations, the creative force behind ThinkyAI. We believe in the power of artificial intelligence to transform the way we learn, work, and interact with the world. Our journey began with a simple idea: to make knowledge more accessible, engaging, and personalized for everyone.
            </p>
            <p>
                ThinkyAI is the embodiment of that vision. It's more than just an app; it's an intelligent companion designed to help you explore complex topics, spark your curiosity, and achieve your learning goals.
            </p>
        </CardContent>
      </Card>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader className="items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <CardTitle className="font-headline">Who We Are</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
             <p>
                <strong>[Placeholder]</strong> We are a dedicated team of developers, designers, and AI specialists committed to pushing the boundaries of what's possible.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <CardTitle className="font-headline">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
             <p>
                <strong>[Placeholder]</strong> Our mission is to build intuitive and powerful AI tools that empower users to unlock their full potential and make learning a lifelong adventure.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="items-center text-center">
             <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Eye className="h-6 w-6" />
            </div>
            <CardTitle className="font-headline">Our Vision</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>
                <strong>[Placeholder]</strong> We envision a future where technology and human intellect collaborate seamlessly, creating a world where information is not just consumed, but truly understood.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
