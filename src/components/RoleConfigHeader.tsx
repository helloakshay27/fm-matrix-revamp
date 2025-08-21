import React from 'react';

interface RoleConfigHeaderProps {
  name: string;
  abbreviation: string;
}

const RoleConfigHeader: React.FC<RoleConfigHeaderProps> = ({ name, abbreviation }) => {
  return (
    <header className="flex items-center justify-between py-4 px-6 bg-gray-100 border-b">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
        <p className="text-sm text-gray-500">Abbreviation: {abbreviation}</p>
      </div>
    </header>
  );
};

export default RoleConfigHeader;
