'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { organizationConfig } from '@/lib/organization';
import { Badge } from '@/components/ui/badge';

export function ConfigurationViewer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Configurations</CardTitle>
        <CardDescription>
          General settings for the application analysis. These values are currently read-only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Setting</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Business Domain</TableCell>
              <TableCell>{organizationConfig.businessDomain}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Products & Services</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {organizationConfig.products.map((product, index) => (
                    <Badge key={index} variant="secondary">
                      {product}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
