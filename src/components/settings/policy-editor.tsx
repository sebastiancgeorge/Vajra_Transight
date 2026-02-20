'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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
  };

  const handleAddPolicy = () => {
    if (newPolicyText.trim()) {
      setPolicies([...policies, newPolicyText.trim()]);
      setNewPolicyText('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Policies</CardTitle>
        <CardDescription>
          Manage the policies used to detect violations in conversation analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {policies.map((policy, index) => (
            <div key={index} className="flex items-start gap-3 rounded-md border p-4">
              {editingIndex === index ? (
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="font-code text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(index)}><Save className="mr-2 h-4 w-4"/> Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingIndex(null)}><X className="mr-2 h-4 w-4"/> Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="flex-1 text-sm">{policy}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="space-y-2 rounded-md border border-dashed p-4">
            <h4 className="text-sm font-medium">Add New Policy</h4>
             <Textarea
                placeholder="Enter new policy text..."
                value={newPolicyText}
                onChange={(e) => setNewPolicyText(e.target.value)}
                className="font-mono text-sm"
            />
            <Button onClick={handleAddPolicy}><Plus className="mr-2 h-4 w-4"/> Add Policy</Button>
        </div>
      </CardContent>
    </Card>
  );
}
