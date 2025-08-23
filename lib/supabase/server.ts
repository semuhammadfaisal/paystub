// Server-side configuration that matches client
export const isSupabaseConfigured = true

export function createClient() {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: "1", email: "user@example.com" } }, error: null }),
      getSession: () => Promise.resolve({ data: { session: { access_token: "mock-token" } }, error: null }),
      signInWithPassword: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: any) =>
            Promise.resolve({
              data: [],
              error: null,
            }),
        }),
      }),
      insert: (data: any) => ({
        select: (columns?: string) => ({
          single: () =>
            Promise.resolve({
              data: { id: "1", ...data },
              error: null,
            }),
        }),
      }),
    }),
  }
}

export const createServerClient = createClient
