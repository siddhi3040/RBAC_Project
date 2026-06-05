import { useAuth } from "@/hooks/use-auth";
import { 
  useGetMe, 
  useGetPublicContent, 
  useGetUserContent, 
  useGetAdminContent,
  getGetMeQueryKey,
  getGetPublicContentQueryKey,
  getGetUserContentQueryKey,
  getGetAdminContentQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, ShieldAlert, Globe, Lock, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  // Verify token is still valid
  useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
    }
  });

  const { data: publicContent, isLoading: isPublicLoading } = useGetPublicContent({
    query: { queryKey: getGetPublicContentQueryKey() }
  });

  const canAccessUserContent = user?.role === "USER" || user?.role === "ADMIN";
  const { data: userContent, isLoading: isUserLoading } = useGetUserContent({
    query: { 
      enabled: canAccessUserContent,
      queryKey: getGetUserContentQueryKey()
    }
  });

  const canAccessAdminContent = user?.role === "ADMIN";
  const { data: adminContent, isLoading: isAdminLoading } = useGetAdminContent({
    query: { 
      enabled: canAccessAdminContent,
      queryKey: getGetAdminContentQueryKey()
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h1 className="font-mono font-bold tracking-tight text-lg">SYSTEM.CONTROL</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground hidden sm:flex">
              <UserIcon className="w-4 h-4" />
              <span className="font-mono">{user?.email}</span>
            </div>
            <Badge variant={user?.role === "ADMIN" ? "destructive" : "default"} className="font-mono rounded-sm">
              {user?.role}
            </Badge>
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant="ghost" size="sm" onClick={logout} className="font-mono text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              DISCONNECT
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight font-mono mb-2">Welcome, {user?.name}</h2>
          <p className="text-muted-foreground">Your clearance level allows access to the following nodes.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Public Node */}
          <Card className="border-border bg-card relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-lg">
                <Globe className="w-5 h-5 text-blue-500" />
                Public Node
              </CardTitle>
              <CardDescription>Open access channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background border border-border p-4 rounded-md font-mono text-sm">
                {isPublicLoading ? (
                  <span className="text-muted-foreground animate-pulse">Establishing connection...</span>
                ) : (
                  <>
                    <div className="text-muted-foreground mb-2">[{publicContent?.message}]</div>
                    <div className="text-foreground">{publicContent?.data}</div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Node */}
          <Card className={`border-border relative overflow-hidden transition-all ${canAccessUserContent ? 'bg-card' : 'bg-card/30 opacity-75'}`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${canAccessUserContent ? 'bg-primary' : 'bg-muted'}`} />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-lg">
                <Lock className={`w-5 h-5 ${canAccessUserContent ? 'text-primary' : 'text-muted-foreground'}`} />
                Operator Node
              </CardTitle>
              <CardDescription>Clearance level: USER</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background border border-border p-4 rounded-md font-mono text-sm h-[100px] flex flex-col justify-center">
                {!canAccessUserContent ? (
                  <span className="text-destructive/80 flex items-center justify-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> ACCESS DENIED
                  </span>
                ) : isUserLoading ? (
                  <span className="text-muted-foreground animate-pulse">Establishing connection...</span>
                ) : (
                  <>
                    <div className="text-muted-foreground mb-2">[{userContent?.message}]</div>
                    <div className="text-foreground">{userContent?.data}</div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin Node */}
          <Card className={`border-border relative overflow-hidden transition-all ${canAccessAdminContent ? 'bg-card' : 'bg-card/30 opacity-75'}`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${canAccessAdminContent ? 'bg-destructive' : 'bg-muted'}`} />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-lg">
                <ShieldAlert className={`w-5 h-5 ${canAccessAdminContent ? 'text-destructive' : 'text-muted-foreground'}`} />
                Command Node
              </CardTitle>
              <CardDescription>Clearance level: ADMIN</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background border border-border p-4 rounded-md font-mono text-sm h-[100px] flex flex-col justify-center">
                {!canAccessAdminContent ? (
                  <span className="text-destructive/80 flex items-center justify-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> ACCESS DENIED
                  </span>
                ) : isAdminLoading ? (
                  <span className="text-muted-foreground animate-pulse">Establishing connection...</span>
                ) : (
                  <>
                    <div className="text-destructive mb-2">[{adminContent?.message}]</div>
                    <div className="text-foreground">{adminContent?.data}</div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
