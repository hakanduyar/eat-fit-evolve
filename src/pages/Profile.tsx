
import { useState } from 'react';
import { ProfileDisplay } from '@/components/profile/ProfileDisplay';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profil</h1>
          <p className="text-gray-600">Profil bilgilerinizi görüntüleyin ve düzenleyin</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? 'outline' : 'default'}
        >
          {isEditing ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Görüntüle
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </>
          )}
        </Button>
      </div>

      {isEditing ? <ProfileEditForm /> : <ProfileDisplay />}
    </div>
  );
}
