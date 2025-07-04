import React from 'react';
import { SearchWithSuggestions } from './SearchWithSuggestions';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';

const sampleData = [
  { name: 'Tower A - Floor 1', type: 'location', category: 'building' },
  { name: 'Tower B - Floor 2', type: 'location', category: 'building' },
  { name: 'Units Snagging', type: 'stage', category: 'process' },
  { name: 'Common Area Snagging', type: 'stage', category: 'process' },
  { name: 'Pre-handover Snagging', type: 'stage', category: 'process' },
  { name: 'Electrical Issues', type: 'issue', category: 'technical' },
  { name: 'Plumbing Problems', type: 'issue', category: 'technical' },
  { name: 'Paint Defects', type: 'issue', category: 'cosmetic' },
  { name: 'Flooring Issues', type: 'issue', category: 'structural' },
  { name: 'Door Alignment', type: 'issue', category: 'structural' }
];

export const SearchBarShowcase = () => {
  const suggestions = useSearchSuggestions({
    data: sampleData,
    searchFields: ['name', 'type', 'category']
  });

  const handleSearch = (value: string) => {
    console.log('Search value:', value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
          SEARCH BAR WITH SUGGESTION
        </h1>

        {/* Reference Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Desktop</h3>
              <SearchWithSuggestions
                placeholder="Search..."
                onSearch={handleSearch}
                suggestions={suggestions}
                className="w-full max-w-[300px] mx-auto"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Tablet</h3>
              <SearchWithSuggestions
                placeholder="Search..."
                onSearch={handleSearch}
                suggestions={suggestions}
                className="w-full max-w-[250px] mx-auto"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Mobile</h3>
              <SearchWithSuggestions
                placeholder="Search..."
                onSearch={handleSearch}
                suggestions={suggestions}
                className="w-full max-w-[200px] mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Radius Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Radius</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">0px</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderRadius: '0px' }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">4px</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderRadius: '4px' }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">8px</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderRadius: '8px' }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">12px</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderRadius: '12px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Spacing Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Spacing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Compact</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Regular</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Large</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Width/Height Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Width/height</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Desktop</h3>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">Search Bar: Width 290px, Height 36px</div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ width: '290px', height: '36px' }}
                  />
                </div>
                <div className="text-xs text-gray-500">Suggestion Box: Width 290px, Height 160px</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Tablet</h3>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">Search Bar: Width 250px, Height 36px</div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ width: '250px', height: '36px' }}
                  />
                </div>
                <div className="text-xs text-gray-500">Suggestion Box: Width 250px, Height 160px</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Mobile</h3>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">Search Bar: Width 200px, Height 36px</div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ width: '200px', height: '36px' }}
                  />
                </div>
                <div className="text-xs text-gray-500">Suggestion Box: Width 200px, Height 160px</div>
              </div>
            </div>
          </div>
        </div>

        {/* Shadows Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Shadows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">None</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Light</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Medium</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Strong</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Padding Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Padding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-2 text-gray-600 text-center">Left Padding: 12px</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full py-2 pr-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ paddingLeft: '12px' }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-2 text-gray-600 text-center">Top Padding: 12px</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 pb-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ paddingTop: '12px' }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-2 text-gray-600 text-center">Bottom Padding: 12px</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 pt-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ paddingBottom: '12px' }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-2 text-gray-600 text-center">Right Padding: 12px</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full py-2 pl-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ paddingRight: '12px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colors Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600">Search Bar</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">Color Fill: #FFFFFF | Color Fill Opacity: 100% | Stroke: #A8A8A8 | Stroke Opacity: 100%</div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #A8A8A8'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600">Suggestion Box</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">Color Fill: #FFFFFF | Color Fill Opacity: 100%</div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div 
                      className="absolute top-full left-0 right-0 mt-1 border border-gray-300 rounded-lg shadow-lg z-10"
                      style={{ backgroundColor: '#FFFFFF', height: '120px' }}
                    >
                      <div className="p-2">
                        <div className="text-sm text-gray-600">Sample suggestion box</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Others Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Others</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Custom Border Radius</h3>
              <SearchWithSuggestions
                placeholder="Custom radius..."
                onSearch={handleSearch}
                suggestions={suggestions}
                className="w-full [&>div>input]:rounded-xl"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Enhanced Shadow</h3>
              <SearchWithSuggestions
                placeholder="With shadow..."
                onSearch={handleSearch}
                suggestions={suggestions}
                className="w-full [&>div>input]:shadow-lg"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-4 text-gray-600 text-center">Colored Border</h3>
              <SearchWithSuggestions
                placeholder="Colored border..."
                onSearch={handleSearch}
                suggestions={suggestions}
                className="w-full [&>div>input]:border-blue-300 [&>div>input]:focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Do's Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Do's</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-sm font-medium mb-4 text-green-800 text-center">Responsive Design</h3>
              <SearchWithSuggestions
                placeholder="Responsive search..."
                onSearch={handleSearch}
                suggestions={suggestions}
                className="w-full"
              />
              <p className="text-xs text-green-700 mt-2">Use responsive breakpoints for different screen sizes</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-sm font-medium mb-4 text-green-800 text-center">Clear Placeholder</h3>
              <SearchWithSuggestions
                placeholder="Search for items, locations, or issues..."
                onSearch={handleSearch}
                suggestions={suggestions}
                className="w-full"
              />
              <p className="text-xs text-green-700 mt-2">Provide descriptive placeholder text</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-sm font-medium mb-4 text-green-800 text-center">Keyboard Navigation</h3>
              <SearchWithSuggestions
                placeholder="Try arrow keys..."
                onSearch={handleSearch}
                suggestions={suggestions}
                className="w-full"
              />
              <p className="text-xs text-green-700 mt-2">Support keyboard navigation for accessibility</p>
            </div>
          </div>
        </div>

        {/* Don'ts Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Don't's</h2>
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="relative">
              <input
                type="text"
                placeholder=""
                className="w-full px-2 py-4 border-4 border-red-500 bg-yellow-200 text-purple-800 placeholder:text-red-600 focus:outline-none text-lg"
                style={{ borderRadius: '50px' }}
              />
            </div>
            <p className="text-xs text-red-700 mt-2">Avoid: Poor contrast, excessive padding, unclear styling, missing placeholder</p>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Use cases</h2>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="space-y-4">
              <div>
                <strong className="text-blue-800">Purpose:</strong>
                <span className="text-blue-700 ml-2">A search bar with suggestion box helps users to quickly find what they are looking for.</span>
              </div>
              <div>
                <strong className="text-blue-800">Places:</strong>
                <span className="text-blue-700 ml-2">List page and filters, forms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
