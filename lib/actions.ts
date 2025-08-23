"use server"

import { createServerClient } from "./supabase/server"
import { redirect } from "next/navigation"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createServerClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createServerClient()

  try {
    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function savePaystub(paystubData: any) {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("paystubs").insert(paystubData).select().single()

    if (error) {
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Save paystub error:", error)
    return { error: "Failed to save paystub" }
  }
}

export async function getUserPaystubs() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("paystubs").select("*").order("created_at", { ascending: false })

    if (error) {
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Get paystubs error:", error)
    return { error: "Failed to fetch paystubs" }
  }
}

export async function createOrder(orderData: {
  packageType: string
  amount: number
  paystubId?: string
  paymentMethod: string
}) {
  const supabase = createServerClient()

  try {
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const { data, error } = await supabase
      .from("orders")
      .insert({
        paystub_id: orderData.paystubId || null,
        package_type: orderData.packageType,
        amount: orderData.amount,
        status: "completed",
        payment_method: orderData.paymentMethod,
        transaction_id: transactionId,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Create order error:", error)
    return { error: "Failed to create order" }
  }
}

export async function getUserOrders() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (error) {
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Get orders error:", error)
    return { error: "Failed to fetch orders" }
  }
}

export async function saveTaxReturn(taxReturnData: {
  user_id: string
  tax_year: number
  filing_status: string
  total_income: number
  taxable_income: number
  tax_owed: number
  refund_amount: number
  form_data: any
}) {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("tax_returns").insert(taxReturnData).select().single()

    if (error) {
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Save tax return error:", error)
    return { error: "Failed to save tax return" }
  }
}

export async function getUserTaxReturns() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("tax_returns").select("*").order("created_at", { ascending: false })

    if (error) {
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Get tax returns error:", error)
    return { error: "Failed to fetch tax returns" }
  }
}
