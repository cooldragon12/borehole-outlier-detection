function Layout({ children }: { children: React.ReactNode }) {

    return (
        <div className="m-8">
            <header className="px-4 py-6 mx-12">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between ">
                    <div className="flex-1"></div>
                    <div className="space-y-2 text-center flex-1">
                        <h1 className="text-3xl font-bold text-foreground">
                            Borehole Outlier Detection Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Analyze geotechnical data for anomalous patterns
                        </p>
                    </div>
                    <div className="flex-1"></div>
                </div>

            </header>
            <main className="container mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    )

}

export default Layout;