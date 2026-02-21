'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { organizationConfig } from '@/lib/organization';
import { Trash2, Plus, Edit, Save, X } from 'lucide-react';

export function PolicyEditor() {
  const [policies, setPolicies] = useState<string[]>(organizationConfig.policies);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [newPolicyText, setNewPolicyText] = useState('');

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(policies[index]);
  };

  const handleSave = (index: number) => {
    const updatedPolicies = [...policies];
    updatedPolicies[index] = editText;
    setPolicies(updatedPolicies);
    setEditingIndex(null);
    setEditText('');
  };

  const handleDelete = (index: number) => {
    const updatedPolicies = policies.filter((_, i) => i !== index);
    setPolicies(updatedPolicies);
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditText('');
    }
  };

  const handleAddPolicy = () => {
    if (newPolicyText.trim()) {
      setPolicies([...policies, newPolicyText.trim()]);
      setNewPolicyText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Policies</CardTitle>
        <CardDescription>
          Manage the policies used to detect violations in conversation analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy Description</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy, index) => (
                <TableRow key={index}>
                  {editingIndex === index ? (
                    <TableCell colSpan={2}>
                      <div className="space-y-2">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="font-code text-sm"
                        />
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => handleSave(index)}>
                            <Save className="mr-2 h-4 w-4" /> Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell className="text-sm align-top">
                        {policy}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(index)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(index)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={2}>
                        <div className="space-y-2 pt-4">
                            <h4 className="text-sm font-medium">Add New Policy</h4>
                             <Textarea
                                placeholder="Enter new policy text..."
                                value={newPolicyText}
                                onChange={(e) => setNewPolicyText(e.target.value)}
                                className="font-code text-sm"
                            />
                            <Button onClick={handleAddPolicy} size="sm"><Plus className="mr-2 h-4 w-4"/> Add Policy</Button>
                        </div>
                    </TableCell>
                </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
