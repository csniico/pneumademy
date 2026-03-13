import { SignOutButton } from "@/components/sign-out-button";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="border-b">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <span className="font-semibold text-foreground">Pneumademy</span>
                    <SignOutButton />
                </div>
            </header>
            <main className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="mt-2 text-muted-foreground">Welcome. Your dashboard is under construction.</p>
            </main>
        </div>
    );
}