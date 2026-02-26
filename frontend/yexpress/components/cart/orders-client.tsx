'use client';

import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { updateOrderStatus } from '@/actions/order-actions';
import { Order } from '@/types/order';

// UI
import { OrderStats } from '@/components/orders/order-stats';
import { OrderFiltersArea } from '@/components/orders/OrderFiltersArea';
import { OrderTableRow } from '@/components/orders/OrderTableRow';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  orders: Order[];
  meta: { total: number; pages: number };
  filters: {
    search: string;
    status: string;
    hasComplaints: string;
  };
  page: number;
}

export default function OrdersClient({ orders, meta, filters, page }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const pushUrl = (nextFilters = filters, nextPage = 1) => {
    const params = new URLSearchParams({
      ...nextFilters,
      page: String(nextPage),
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    pushUrl({ ...filters, [key]: value }, 1);
  };

  const clearFilters = () => {
    pushUrl({ search: '', status: '', hasComplaints: '' }, 1);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus(id, status);
      toast.success('Order updated');
      router.refresh(); // 🔥 re-fetch SSR data
    } catch {
      toast.error('Error updating order');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <OrderStats
        total={meta.total}
        complaints={orders.filter(o => o.rating && o.rating < 3).length}
        canceled={orders.filter(o => o.status === 'canceled').length}
      />

      <OrderFiltersArea
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={clearFilters}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <td colSpan={7} className="text-center p-6">
                    No orders found
                  </td>
                </TableRow>
              ) : (
                orders.map(order => (
                  <OrderTableRow
                    key={order._id}
                    order={order}
                    onUpdate={handleUpdateStatus}
                    onView={() => console.log(order)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
