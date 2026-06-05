import { useAuth } from "@/hooks/use-auth";
import { useLogin } from "@workspace/api-client-react";
import { AuthLayout } from "@/components/auth-layout";
import { Link, Redirect } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const loginMutation = useLogin();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate({ data }, {
      onSuccess: (res) => {
        login(res.token, res.user);
      },
      onError: (err) => {
        toast({
          title: "Authentication Failed",
          description: err.data?.error || "Could not log in with provided credentials.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <AuthLayout title="SYSTEM.ACCESS" subtitle="Authenticate to access the dashboard">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs text-muted-foreground uppercase">Operator Email</FormLabel>
                <FormControl>
                  <Input placeholder="sysadmin@example.com" className="font-mono" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs text-muted-foreground uppercase">Access Code</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" className="font-mono" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full font-mono uppercase tracking-widest" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Initiate Protocol"}
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Unregistered operator?{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Request Access
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
