import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
 <Navbar />
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
      </div>

      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Side */}
          <div className="space-y-8">

            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur">
              Smart Office Management
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                Modern Office
                <br />
                Management
              </h1>

              <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                Manage employees, workflow, meetings, productivity,
                and office operations from one smart dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">

              <Button
                size="lg"
                className="bg-white text-black hover:bg-slate-200 h-12 px-8 rounded-2xl font-semibold"
              >
                Get Started
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white h-12 px-8 rounded-2xl"
              >
                Learn More
              </Button>

            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-6">

              <div>
                <h2 className="text-3xl font-bold">10K+</h2>
                <p className="text-slate-500">Users</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">99%</h2>
                <p className="text-slate-500">Efficiency</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">24/7</h2>
                <p className="text-slate-500">Support</p>
              </div>

            </div>

          </div>

          {/* Right Side */}
          <div className="relative">

         <Card className="border border-border shadow-xl backdrop-blur-2xl rounded-3xl overflow-hidden bg-card">

  <CardContent className="p-8 space-y-8">

    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground text-sm">
          Active Employees
        </p>
        <h2 className="text-5xl font-bold mt-2 text-foreground">
          1,248
        </h2>
      </div>

      <div className="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 
                      border border-emerald-200 dark:border-emerald-500/30 
                      flex items-center justify-center text-3xl">
        ⚡
      </div>
    </div>

    {/* Analytics */}
    <div className="space-y-6">

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Productivity</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">86%</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-[86%] bg-emerald-500 dark:bg-emerald-400 rounded-full" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Task Completion</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">72%</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-[72%] bg-emerald-500 dark:bg-emerald-400 rounded-full" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Team Performance</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">91%</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-[91%] bg-emerald-500 dark:bg-emerald-400 rounded-full" />
        </div>
      </div>

    </div>

  </CardContent>
</Card>

          </div>

        </div>
      </section>
    </main>
  );
}