import { Mail } from "lucide-react";

export default function MessagesPage() {
    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Messages</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Direct messages from your church leaders.
                </p>
            </div>
            <div className="rounded-lg border border-dashed bg-muted/10 p-16 text-center">
                <Mail className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="font-medium text-foreground">Coming soon</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Messaging is being prepared for the community.
                </p>
            </div>
        </div>
    );
}
