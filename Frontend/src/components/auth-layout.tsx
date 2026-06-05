import { ReactNode } from "react";
import { Shield } from "lucide-react";

export function AuthLayout({ children, title, subtitle }: { children: ReactNode, title: string, subtitle: string }) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 border border-primary/30">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-mono tracking-tight font-bold text-foreground text-center">{title}</h1>
          <p className="text-muted-foreground mt-2 text-center text-sm">{subtitle}</p>
        </div>
        <div className="bg-card border border-border shadow-2xl rounded-lg p-6 md:p-8 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
