export default function MaintenancePage() {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="max-w-lg text-center space-y-6">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100">
                    <span className="text-4xl">🛠️</span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight">
                    We'll be back soon.
                </h1>

                <p className="text-muted-foreground text-lg">
                    Schemae is currently undergoing scheduled maintenance to improve
                    your experience.
                </p>

                <p className="text-sm text-muted-foreground">
                    Please check back after September 1st.
                </p>

                <div className="pt-4">
                    <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
                        <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                        Maintenance in progress
                    </div>
                </div>
            </div>
        </main>
    );
}