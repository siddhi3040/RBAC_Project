import { useAuth } from "@/hooks/use-auth";
import { useRegister } from "@workspace/api-client-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["USER", "ADMIN"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const registerMutation = useRegister();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate({ data }, {
      onSuccess: (res) => {
        login(res.token, res.user);
      },
      onError: (err) => {
        toast({
          title: "Registration Failed",
          description: err.data?.error || "Could not complete registration.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <AuthLayout title="SYSTEM.REGISTER" subtitle="Submit request for system access">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs text-muted-foreground uppercase">Designation (Name)</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" className="font-mono" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs text-muted-foreground uppercase">Operator Email</FormLabel>
                <FormControl>
                  <Input placeholder="operator@example.com" className="font-mono" {...field} />
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
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs text-muted-foreground uppercase">Clearance Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="font-mono">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USER" className="font-mono">Standard Operator (USER)</SelectItem>
                    <SelectItem value="ADMIN" className="font-mono">System Administrator (ADMIN)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full font-mono uppercase tracking-widest mt-6" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Request Access"}
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already possess clearance?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Authenticate
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
