import React from "react";

interface AccountingReportStubProps {
  title: string;
}

const AccountingReportStub: React.FC<AccountingReportStubProps> = ({
  title,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-3 text-gray-600">
          Content for this report will be added here.
        </p>
      </div>
    </div>
  );
};

export default AccountingReportStub;
