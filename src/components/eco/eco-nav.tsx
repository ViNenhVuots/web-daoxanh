import { Button } from '@/components/ui/button';
import { getMenuPages } from '@/lib/pages';
import { SearchIcon } from 'lucide-react';

export async function EcoNav({ locale }: { locale: string }) {
  const pages = await getMenuPages(locale);

  return (
    <nav className="flex justify-center gap-50 py-6 px-80">
      <Button variant="ghost" className="text-green-500 hover:text-green-400"><SearchIcon /></Button>
      <div className="flex gap-2">
        {pages.map((page: any) => {
            const href =
            page.slug === 'home'
                ? '/'
                : `/${page.slug}`;

            return (
            <a href={href}>
              <Button
                  key={page.documentId}
                  variant="ghost"
                  className="
                  text-green-600 
                  hover:text-green-500 
                  hover:underline 
                  hover:underline-offset-4"
              >
                  {page.title.toUpperCase()}
              </Button>
            </a>
            );
        })}
      </div>
      <div className="">
        <Button className="bg-amber-600 w-min hover:bg-amber-500">Đặt ngay</Button>
      </div>
    </nav>
  );
}
