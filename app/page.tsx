"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import CustomerList from "@/components/customer-list"
import AddCustomerForm from "@/components/add-customer-form"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import apiClient, { type Customer } from "@/lib/api-client"

export default function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)
  const { logout } = useAuth()

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers()
  }, [])

  // Function to fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getCustomers()
      setCustomers(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch customers")
      toast({
        title: "Error",
        description: "Failed to fetch customers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to add a new customer
  const addCustomer = async (customerData: Omit<Customer, "id">) => {
    try {
      const newCustomer = await apiClient.addCustomer(customerData)
      setCustomers([...customers, newCustomer])
      setIsFormOpen(false)
      toast({
        title: "Success",
        description: "Customer added successfully!",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to sync customers to external API
  const syncCustomers = async () => {
    try {
      setSyncLoading(true)
      await apiClient.syncCustomers()
      toast({
        title: "Success",
        description: "Customers synced to external API successfully!",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to sync customers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSyncLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customer Onboarding Dashboard</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
          <Button onClick={syncCustomers} variant="outline" disabled={syncLoading}>
            {syncLoading ? "Syncing..." : "Sync to External API"}
          </Button>
          <Button onClick={logout} variant="ghost">
            Logout
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <AddCustomerForm onSubmit={addCustomer} onCancel={() => setIsFormOpen(false)} />
        </div>
      )}

      <CustomerList customers={customers} loading={loading} error={error} />
    </div>
  )
}

