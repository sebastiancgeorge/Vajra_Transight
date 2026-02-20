'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { organizationConfig } from '@/lib/organization';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ConfigurationViewer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Configurations</CardTitle>
        <CardDescription>
          General settings for the application analysis. These values are currently read-only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="businessDomain">Business Domain</Label>
          <Input id="businessDomain" value={organizationConfig.businessDomain} readOnly />
        </div>
        <div className="space-y-2">
          <Label>Products & Services</Label>
          <div className="flex flex-wrap gap-2 rounded-md border p-3 min-h-[40px]">
            {organizationConfig.products.map((product, index) => (
              <Badge key={index} variant="secondary">
                {product}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
