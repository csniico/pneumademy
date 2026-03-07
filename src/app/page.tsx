import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, Video, BookOpen, Clock, Users, Flame, Heart, MessageCircle, UserPlus, Award } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Pneumademy</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-linear-to-b from-background to-muted/20 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Become a True Disciple of Christ
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Transform your faith journey through structured discipleship. Grow in obedience, love, 
              and fellowship as you fulfill God&apos;s will for your life.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Begin Your Journey
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users className="h-5 w-5" />
              <span>Join 10,000+ believers on the path to discipleship</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary">3-4 Months</div>
              <div className="text-sm text-muted-foreground">Foundation Journey</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary">Lifetime</div>
              <div className="text-sm text-muted-foreground">Disciple Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey Section */}
      <section id="how-it-works" className="border-b py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Your Discipleship Journey</h2>
            <p className="mb-12 text-lg text-muted-foreground">
              A clear path from foundation to deep spiritual growth
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* Phase 1: Learner */}
            <Card className="border-2">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Phase 1: Foundation</CardTitle>
                <CardDescription>3-4 months of structured learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm">Core biblical teachings through engaging video lessons</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm">Essential spiritual disciplines and practices</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm">Building a strong foundation in Christian faith</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm">Progress at your own pace through structured courses</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm">Engage with a vibrant community of fellow learners</p>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2: Disciple */}
            <Card className="border-2 border-primary/50 bg-primary/5">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Phase 2: Discipleship</CardTitle>
                <CardDescription>Lifetime access to deep spiritual growth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm">Unlock advanced biblical studies and theology</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm">Continuous learning with new content over time</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm">Deeper exploration of spiritual truths and wisdom</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm">Lifetime membership in a growing community</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm">Earn ranks as you grow and contribute spiritually</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Everything You Need to Grow</h2>
            <p className="mb-12 text-lg text-muted-foreground">
              A complete platform designed for your spiritual transformation
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Video className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Video Teachings</h3>
              <p className="text-sm text-muted-foreground">
                High-quality video lessons that bring Scripture to life and make complex truths accessible
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Interactive Content</h3>
              <p className="text-sm text-muted-foreground">
                Engaging written materials and resources delivered directly in the platform
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Self-Paced Learning</h3>
              <p className="text-sm text-muted-foreground">
                Study at your own rhythm while staying on track with structured guidance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="border-b py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Grow Together in Community</h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Faith grows deeper in fellowship. Connect, learn, and be inspired by others on the same journey.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Active Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stay connected through a vibrant community feed. Share insights, ask questions, 
                  and engage with posts from fellow learners and disciples.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Follow Disciples</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Follow mature disciples to learn from their journey. See their content, 
                  insights, and spiritual reflections as they share their walk with Christ.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Disciple Ranks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  As disciples grow and contribute to the community, they earn ranks that reflect 
                  their spiritual maturity and commitment to serving others.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-lg border bg-muted/30 p-6">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">You&apos;re Never Alone</h3>
                <p className="text-sm text-muted-foreground">
                  Whether you&apos;re just starting as a learner or growing as a disciple, you&apos;re part of a 
                  supportive community walking alongside you in faith, obedience, and love.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where to Begin Section */}
      <section className="border-b py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Where Do I Begin?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Create Your Account</h3>
                  <p className="text-muted-foreground">
                    Sign up in minutes and get immediate access to the learner foundation courses. 
                    No commitment required to explore.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Complete the Foundation</h3>
                  <p className="text-muted-foreground">
                    Work through your learner courses over 3-4 months. Build a solid biblical foundation 
                    through video teachings and interactive content.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  3
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Become a Disciple</h3>
                  <p className="text-muted-foreground">
                    Upon completion, you&apos;ll be recognized as a disciple with lifetime access to deeper 
                    teachings, advanced studies, and continuous spiritual growth resources.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  4
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Continue Growing</h3>
                  <p className="text-muted-foreground">
                    Access new content as it&apos;s released, dive deeper into Scripture, and continue your 
                    journey of obedience, love, and fellowship for life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Transform Your Walk with Christ?</h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of believers who are growing deeper in their faith, obedience, and love for God.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg">
                Start Your Journey Today
              </Button>
            </Link>
            <p className="mt-6 text-sm opacity-75">
              Already a member?{" "}
              <Link href="/login" className="underline hover:no-underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pneumademy. A ministry dedicated to making disciples.</p>
        </div>
      </footer>
    </div>
  );
}
