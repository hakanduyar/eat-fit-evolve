
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleUpdate } from "@/hooks/useRoleUpdate";
import { User, Stethoscope, Dumbbell } from "lucide-react";

export function RoleUpdateCard() {
  const { profile } = useAuth();
  const { updateUserRole, loading } = useRoleUpdate();

  if (!profile) return null;

  const roleOptions = [
    { value: 'user' as const, label: 'Bireysel Kullanıcı', icon: User, color: 'bg-blue-500' },
    { value: 'dietitian' as const, label: 'Diyetisyen', icon: Stethoscope, color: 'bg-green-500' },
    { value: 'trainer' as const, label: 'Spor Koçu', icon: Dumbbell, color: 'bg-orange-500' }
  ];

  const currentRole = roleOptions.find(role => role.value === profile.role);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {currentRole && <currentRole.icon className="h-5 w-5" />}
          Kullanıcı Rolü
        </CardTitle>
        <CardDescription>
          Mevcut rolünüz: <Badge variant="secondary">{currentRole?.label}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Rolünüzü değiştirmek istiyorsanız aşağıdaki seçeneklerden birini kullanın:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {roleOptions.map((role) => (
              <Button
                key={role.value}
                variant={profile.role === role.value ? "default" : "outline"}
                onClick={() => updateUserRole(role.value)}
                disabled={loading || profile.role === role.value}
                className="justify-start"
              >
                <role.icon className="h-4 w-4 mr-2" />
                {role.label}
                {profile.role === role.value && <Badge className="ml-auto">Mevcut</Badge>}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
