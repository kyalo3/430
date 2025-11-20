import React from 'react';

const roles = [
  { key: 'donor', label: 'Donor', description: 'Donate food or resources to those in need.' },
  { key: 'recipient', label: 'Recipient', description: 'Request and receive donations.' },
  { key: 'volunteer', label: 'Volunteer', description: 'Help with logistics and distribution.' },
];

function RoleSelectionModal({ isOpen, onSelectRole, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold text-emerald-800 mb-4 text-center">Select Your Role</h2>
        <p className="text-gray-600 mb-6 text-center">Choose how you want to use the platform:</p>
        <div className="flex flex-col gap-4">
          {roles.map((role) => (
            <button
              key={role.key}
              className="border border-emerald-300 rounded-lg px-6 py-4 text-left hover:bg-emerald-50 transition flex flex-col focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onClick={() => onSelectRole(role.key)}
            >
              <span className="text-lg font-bold text-emerald-700">{role.label}</span>
              <span className="text-gray-500 text-sm">{role.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoleSelectionModal;
