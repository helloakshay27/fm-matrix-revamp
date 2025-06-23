
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";

export const AccountingDashboard = () => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Account details submitted:', { name });
  };

  return (
    <div className="p-grid-margin-mobile md:p-grid-margin-tablet lg:p-grid-margin-desktop bg-bg-primary min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4 body-text-4 text-ds-secondary">
        Finance &gt; Account
      </div>

      {/* Page Title */}
      <Heading level="h1" className="mb-6 uppercase">ACCOUNT EDIT/DETAIL</Heading>

      {/* Welcome Message */}
      <div className="mb-6">
        <p className="body-text-1">Welcome Ankit Gupta,</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-md space-y-ds-4">
        <div>
          <label className="block body-text-4 font-medium mb-2 text-ds-primary">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-field w-full"
            placeholder="Enter name"
          />
        </div>

        <Button 
          type="submit"
          className="btn-primary"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};
