
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

const BreadcrumbNav = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNames: Record<string, string> = {
    '': 'Dashboard',
    'nutrition': 'Beslenme',
    'activity': 'Aktivite', 
    'clients': 'Danışanlar',
    'profile': 'Profil',
    'settings': 'Ayarlar'
  };

  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      {
        name: 'Dashboard',
        path: '/',
        isLast: pathnames.length === 0
      }
    ];

    pathnames.forEach((pathname, index) => {
      const isLast = index === pathnames.length - 1;
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const name = breadcrumbNames[pathname] || pathname;

      breadcrumbs.push({
        name,
        path,
        isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbItem key={breadcrumb.path}>
            {breadcrumb.isLast ? (
              <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink href={breadcrumb.path}>
                  {breadcrumb.name}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
