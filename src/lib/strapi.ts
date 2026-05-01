type GraphQLResponse<T> = {
  data: T;
  errors?: any;
};

export async function fetchStrapi<T>(
  query: string,
  variables?: Record<string, any>
): Promise<GraphQLResponse<T>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: 'no-store',
    }
  );

  return res.json();
}
