
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppointments } from "@/hooks/useAppointments";
import { CreateAppointmentDialog } from "@/components/appointments/CreateAppointmentDialog";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { Calendar, Clock, Users } from "lucide-react";

const Appointments = () => {
  const { profile } = useAuth();
  const { 
    appointments, 
    loading, 
    updateAppointment, 
    deleteAppointment,
    getUpcomingAppointments,
    getTodaysAppointments 
  } = useAppointments();

  const handleComplete = async (appointmentId: string) => {
    await updateAppointment(appointmentId, { 
      status: 'completed',
      notes: 'Randevu tamamlandı'
    });
  };

  const upcomingAppointments = getUpcomingAppointments();
  const todaysAppointments = getTodaysAppointments();
  const pastAppointments = appointments.filter(apt => 
    apt.status === 'completed' || apt.status === 'cancelled'
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Randevular</h1>
          <p className="text-gray-600 mt-2">
            Randevularınızı yönetin ve takip edin
          </p>
        </div>
        {profile?.role !== 'user' && <CreateAppointmentDialog />}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugünkü Randevular</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAppointments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yaklaşan Randevular</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Randevu</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Tabs */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Bugün ({todaysAppointments.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Yaklaşan ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="all">Tümü ({appointments.length})</TabsTrigger>
          <TabsTrigger value="past">Geçmiş ({pastAppointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bugünkü Randevular</CardTitle>
              <CardDescription>
                Bugün için planlanmış randevularınız
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todaysAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Bugün için planlanmış randevu bulunmuyor
                </div>
              ) : (
                <div className="grid gap-4">
                  {todaysAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onComplete={handleComplete}
                      onDelete={deleteAppointment}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yaklaşan Randevular</CardTitle>
              <CardDescription>
                Gelecek için planlanmış randevularınız
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Yaklaşan randevu bulunmuyor
                </div>
              ) : (
                <div className="grid gap-4">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onComplete={handleComplete}
                      onDelete={deleteAppointment}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tüm Randevular</CardTitle>
              <CardDescription>
                Tüm randevularınızın listesi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Henüz randevu bulunmuyor
                </div>
              ) : (
                <div className="grid gap-4">
                  {appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onComplete={handleComplete}
                      onDelete={deleteAppointment}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geçmiş Randevular</CardTitle>
              <CardDescription>
                Tamamlanmış ve iptal edilmiş randevular
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pastAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Geçmiş randevu bulunmuyor
                </div>
              ) : (
                <div className="grid gap-4">
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
