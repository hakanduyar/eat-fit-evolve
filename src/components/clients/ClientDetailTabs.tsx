
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle } from 'lucide-react';
import { ClientNotesSection } from './ClientNotesSection';
import { ClientNutritionHistory } from './ClientNutritionHistory';
import { MessageDialog } from './MessageDialog';

interface ClientDetailTabsProps {
  clientId?: string;
  clientName?: string;
}

export function ClientDetailTabs({ clientId, clientName }: ClientDetailTabsProps) {
  return (
    <Tabs defaultValue="notes" className="space-y-4">
      <TabsList>
        <TabsTrigger value="notes">Notlar</TabsTrigger>
        <TabsTrigger value="nutrition">Beslenme Geçmişi</TabsTrigger>
        <TabsTrigger value="messages">Mesajlar</TabsTrigger>
        <TabsTrigger value="programs">Programlar</TabsTrigger>
      </TabsList>

      <TabsContent value="notes">
        <ClientNotesSection clientId={clientId} />
      </TabsContent>

      <TabsContent value="nutrition">
        <ClientNutritionHistory clientId={clientId} />
      </TabsContent>

      <TabsContent value="messages">
        <Card>
          <CardHeader>
            <CardTitle>Mesajlaşma</CardTitle>
            <CardDescription>Bu danışan ile mesaj geçmişi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Mesajlaşma</h3>
              <p className="text-gray-600 mb-4">
                Bu danışan ile mesajlaşmak için yukarıdaki "Mesaj Gönder" butonunu kullanın.
              </p>
              <MessageDialog 
                clientId={clientId}
                clientName={clientName}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="programs">
        <Card>
          <CardHeader>
            <CardTitle>Atanan Programlar</CardTitle>
            <CardDescription>Bu özellik yakında gelecek</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Program atama özelliği henüz geliştirilmemiş
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
