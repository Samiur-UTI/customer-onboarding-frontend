import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Customer } from "@/lib/api-client"

interface CustomerListProps {
  customers: Customer[]
  loading: boolean
  error: string | null
}

export default function CustomerList({ customers, loading, error }: CustomerListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <div className="bg-destructive/10 p-4 rounded-md text-destructive text-center">{error}</div>
  }

  if (customers.length === 0) {
    return (
      <div className="text-center p-8 bg-muted rounded-md">
        <p className="text-muted-foreground">No customers found. Add your first customer to get started.</p>
      </div>
    )
  }

  // Get all possible keys from customers to create table headers
  const allKeys = customers.reduce((keys, customer) => {
    Object.keys(customer).forEach((key) => {
      if (!keys.includes(key) && key !== "id") {
        keys.push(key)
      }
    })
    return keys
  }, [] as string[])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {allKeys.map((key) => (
                  <TableHead key={key} className="capitalize">
                    {key}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  {allKeys.map((key) => (
                    <TableCell key={`${customer.id}-${key}`}>{customer[key] || "-"}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

