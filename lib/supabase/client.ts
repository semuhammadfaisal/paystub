// Working client configuration that doesn't rely on external packages
export const isSupabaseConfigured = true

// Mock Supabase client that provides the same interface
export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Simulate authentication
      const user = { id: "1", email, user_metadata: { full_name: email.split("@")[0] } }
      localStorage.setItem("supabase.auth.token", JSON.stringify({ user, session: { access_token: "mock-token" } }))
      return { data: { user, session: { access_token: "mock-token" } }, error: null }
    },
    signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
      // Simulate signup
      const user = { id: "1", email, user_metadata: { full_name: email.split("@")[0] } }
      localStorage.setItem("supabase.auth.token", JSON.stringify({ user, session: { access_token: "mock-token" } }))
      return { data: { user, session: { access_token: "mock-token" } }, error: null }
    },
    signOut: async () => {
      localStorage.removeItem("supabase.auth.token")
      return { error: null }
    },
    getUser: async () => {
      const stored = localStorage.getItem("supabase.auth.token")
      if (stored) {
        const { user } = JSON.parse(stored)
        return { data: { user }, error: null }
      }
      return { data: { user: null }, error: null }
    },
    getSession: async () => {
      const stored = localStorage.getItem("supabase.auth.token")
      if (stored) {
        const { session } = JSON.parse(stored)
        return { data: { session }, error: null }
      }
      return { data: { session: null }, error: null }
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Mock auth state change listener
      return {
        data: { subscription: { unsubscribe: () => {} } },
      }
    },
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: any) =>
          Promise.resolve({
            data: [],
            error: null,
          }),
        single: () =>
          Promise.resolve({
            data: null,
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
    update: (data: any) => ({
      eq: (column: string, value: any) =>
        Promise.resolve({
          data: { id: "1", ...data },
          error: null,
        }),
    }),
    delete: () => ({
      eq: (column: string, value: any) =>
        Promise.resolve({
          data: null,
          error: null,
        }),
    }),
  }),
}
