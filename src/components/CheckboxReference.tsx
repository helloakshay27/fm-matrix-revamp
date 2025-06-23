
import React from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

export const CheckboxReference = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">CHECKBOXES</h1>
        <div className="flex justify-center space-x-8 text-sm text-gray-600">
          <span>Desktop</span>
          <span>Tablet</span>
          <span>Mobile</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* References Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">References</h3>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
            {/* No label example */}
            <div>
              <p className="text-xs text-gray-600 mb-2">01 No label</p>
              <div className="flex items-center space-x-2">
                <Checkbox id="no-label-1" />
                <Checkbox id="no-label-2" checked />
                <Checkbox id="no-label-3" />
                <Checkbox id="no-label-4" checked />
                <Checkbox id="no-label-5" />
              </div>
            </div>

            {/* With label example */}
            <div>
              <p className="text-xs text-gray-600 mb-2">02 With label</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="label-1" />
                  <Label htmlFor="label-1" className="text-sm">Chat</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="label-2" checked />
                  <Label htmlFor="label-2" className="text-sm">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="label-3" />
                  <Label htmlFor="label-3" className="text-sm">Call</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="label-4" checked />
                  <Label htmlFor="label-4" className="text-sm">SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="label-5" />
                  <Label htmlFor="label-5" className="text-sm">Push</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h3 className="text-sm font-medium text-gray-900">BASIC INFO</h3>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Desktop</h3>
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
            {/* Desktop Table Example */}
            <div className="bg-white rounded border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">
                        <Checkbox />
                      </th>
                      <th className="p-3 text-left font-medium">User</th>
                      <th className="p-3 text-left font-medium">Booking ID</th>
                      <th className="p-3 text-left font-medium">Request By</th>
                      <th className="p-3 text-left font-medium">Facility Name</th>
                      <th className="p-3 text-left font-medium">Schedule Date</th>
                      <th className="p-3 text-left font-medium">Schedule Time</th>
                      <th className="p-3 text-left font-medium">Booking Status</th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3"><Checkbox /></td>
                      <td className="p-3">Wick</td>
                      <td className="p-3">Book 1</td>
                      <td className="p-3">Jack</td>
                      <td className="p-3">Conference Room</td>
                      <td className="p-3">16/06/2024</td>
                      <td className="p-3">9am to 12 pm</td>
                      <td className="p-3">Confirmed</td>
                      <td className="p-3">...</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3"><Checkbox /></td>
                      <td className="p-3">John</td>
                      <td className="p-3">Book 2</td>
                      <td className="p-3">Jane</td>
                      <td className="p-3">Meeting Room</td>
                      <td className="p-3">17/06/2024</td>
                      <td className="p-3">10am to 12 pm</td>
                      <td className="p-3">Pending</td>
                      <td className="p-3">...</td>
                    </tr>
                    <tr>
                      <td className="p-3"><Checkbox /></td>
                      <td className="p-3">Alice</td>
                      <td className="p-3">Book 3</td>
                      <td className="p-3">Bob</td>
                      <td className="p-3">Auditorium</td>
                      <td className="p-3">18/06/2024</td>
                      <td className="p-3">2pm to 5 pm</td>
                      <td className="p-3">Cancelled</td>
                      <td className="p-3">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Filter Options */}
            <div className="flex gap-4 text-sm">
              <span>Any Text</span>
              <span>Bookings</span>
              <span>Mandatory</span>
            </div>

            {/* Checkbox Properties */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Checkbox Properties</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Width: 16</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Height: 16</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Border: 1px solid #C72030</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Background: White</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Check Color: #C72030</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h3 className="text-sm font-medium text-gray-900">BASIC INFO</h3>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Tablet</h3>
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
            {/* Tablet Table Example */}
            <div className="bg-white rounded border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">
                        <Checkbox className="h-3 w-3" />
                      </th>
                      <th className="p-2 text-left font-medium">User</th>
                      <th className="p-2 text-left font-medium">Booking ID</th>
                      <th className="p-2 text-left font-medium">Request By</th>
                      <th className="p-2 text-left font-medium">Facility Name</th>
                      <th className="p-2 text-left font-medium">Schedule Date</th>
                      <th className="p-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2"><Checkbox className="h-3 w-3" /></td>
                      <td className="p-2">Wick</td>
                      <td className="p-2">Book 1</td>
                      <td className="p-2">Jack</td>
                      <td className="p-2">Conference</td>
                      <td className="p-2">16/06/24</td>
                      <td className="p-2">...</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2"><Checkbox className="h-3 w-3" /></td>
                      <td className="p-2">John</td>
                      <td className="p-2">Book 2</td>
                      <td className="p-2">Jane</td>
                      <td className="p-2">Meeting</td>
                      <td className="p-2">17/06/24</td>
                      <td className="p-2">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Filter Options */}
            <div className="flex gap-3 text-sm">
              <span>Mandatory</span>
              <span>Bookings</span>
              <span>Any Text</span>
            </div>

            {/* Tablet Checkbox Properties */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Tablet Checkbox Properties</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Width: 12</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Height: 12</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Border: 1px solid #C72030</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Background: White</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h3 className="text-sm font-medium text-gray-900">BASIC INFO</h3>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Mobile</h3>
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
            {/* Mobile Layout */}
            <div className="bg-white rounded border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox className="h-3 w-3" />
                  <span className="text-sm font-medium">Wick</span>
                </div>
                <span className="text-xs text-gray-500">Book 1</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox className="h-3 w-3" />
                  <span className="text-sm font-medium">John</span>
                </div>
                <span className="text-xs text-gray-500">Book 2</span>
              </div>
            </div>

            {/* Filter Options */}
            <div className="flex flex-col gap-2 text-sm">
              <span>Any Text</span>
              <span>Bookings</span>
              <span>Mandatory</span>
            </div>

            {/* Mobile Checkbox Properties */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Mobile Checkbox Properties</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Width: 12</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Height: 12</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Border: 1px solid #C72030</span>
              </div>
            </div>
          </div>
        </div>

        {/* Use cases Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Use cases</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Purpose:</strong> Allow users to select multiple options from a list.</p>
            <p><strong>Places:</strong> Drop Down and Filter.</p>
            <p><strong>Responsive:</strong> Adapts sizing and layout across desktop, tablet, and mobile devices.</p>
            <p><strong>Interactive:</strong> Supports checked, unchecked, and indeterminate states.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
