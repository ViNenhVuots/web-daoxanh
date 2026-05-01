import { fetchStrapi } from './strapi';


export async function getMenuPages(locale: string) {
    
  const { data } : any = await fetchStrapi(
    `
    query MenuPages($locale: I18NLocaleCode) {
      pages(
        locale: $locale
        filters: { showInMenu: { eq: true } }
        sort: "order:asc"
      ) {
        documentId
        title
        slug
      }
    }
    `,
    { locale }
  );

  return data.pages;
}
