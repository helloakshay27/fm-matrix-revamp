
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const AccountingDashboard = () => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Account details submitted:', { name });
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Finance &gt; Account
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">ACCOUNT EDIT/DETAIL</h1>

      {/* Welcome Message */}
      <div className="mb-6">
        <p className="text-lg">Welcome Ankit Gupta,</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            placeholder="Enter name"
          />
        </div>

        <Button 
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-8"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};
