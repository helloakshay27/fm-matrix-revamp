import React from 'react';
import { SearchWithSuggestions } from './SearchWithSuggestions';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';

const sampleData = [
  { name: '8Items looking for', type: 'location', category: 'building' },
  { name: '8Items looking for', type: 'location', category: 'building' },
  { name: '8Items looking for', type: 'stage', category: 'process' },
  { name: '8Items looking for', type: 'stage', category: 'process' },
  { name: '8Items looking for', type: 'stage', category: 'process' },
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto">
        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">SEARCH BAR WITH SUGGESTION</h1>
        </div>

        {/* Design System Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Reference Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-gray-900">Reference</h2>
              
              {/* Desktop */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-3 text-gray-700">Desktop</h3>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">290px</div>
                  <SearchWithSuggestions
                    placeholder="8Items looking for"
                    onSearch={handleSearch}
                    suggestions={suggestions}
                    className="w-[290px]"
                  />
                </div>
              </div>

              {/* Tablet */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-3 text-gray-700">Tablet</h3>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">250px</div>
                  <SearchWithSuggestions
                    placeholder="8Items looking for"
                    onSearch={handleSearch}
                    suggestions={suggestions}
                    className="w-[250px]"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <h3 className="text-sm font-medium mb-3 text-gray-700">Mobile</h3>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">170px</div>
                  <SearchWithSuggestions
                    placeholder="8Items looking for"
                    onSearch={handleSearch}
                    suggestions={suggestions}
                    className="w-[170px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Radius Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-gray-900">Radius</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="text-center mb-3">
                    <span className="text-sm font-medium text-gray-700">0px</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="8Items looking for"
                      className="w-full h-9 px-3 pr-10 border border-[#E5E5E5] bg-white text-[#333333] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      style={{ borderRadius: '0px' }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-[#A8A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-center mb-3">
                    <span className="text-sm font-medium text-gray-700">6px</span>
                  </div>
                  <SearchWithSuggestions
                    placeholder="8Items looking for"
                    onSearch={handleSearch}
                    suggestions={suggestions}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Spacing Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-gray-900">Spacing</h2>
              
              <div className="space-y-6">
                {/* Desktop Spacing */}
                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Desktop</h3>
                  <div className="relative">
                    <SearchWithSuggestions
                      placeholder="8Items looking for"
                      onSearch={handleSearch}
                      suggestions={suggestions}
                      className="w-[290px]"
                    />
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">290px</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">36px</span>
                    </div>
                  </div>
                </div>

                {/* Tablet Spacing */}
                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Tablet</h3>
                  <div className="relative">
                    <SearchWithSuggestions
                      placeholder="8Items looking for"
                      onSearch={handleSearch}
                      suggestions={suggestions}
                      className="w-[250px]"
                    />
                    <div className="mt-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">250px</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Spacing */}
                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Mobile</h3>
                  <div className="relative">
                    <SearchWithSuggestions
                      placeholder="8Items looking for"
                      onSearch={handleSearch}
                      suggestions={suggestions}
                      className="w-[170px]"
                    />
                    <div className="mt-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">170px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Width/Height Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-gray-900">Width/height</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Desktop</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Width: 290px</span>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Height: 36px</span>
                    </div>
                    <SearchWithSuggestions
                      placeholder="8Items looking for"
                      onSearch={handleSearch}
                      suggestions={suggestions}
                      className="w-[290px]"
                    />
                    <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
                      Suggestion Box: 290px × 160px
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Tablet</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Width: 250px</span>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Height: 36px</span>
                    </div>
                    <SearchWithSuggestions
                      placeholder="8Items looking for"
                      onSearch={handleSearch}
                      suggestions={suggestions}
                      className="w-[250px]"
                    />
                    <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
                      Suggestion Box: 250px × 160px
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Mobile</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Width: 170px</span>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Height: 36px</span>
                    </div>
                    <SearchWithSuggestions
                      placeholder="8Items looking for"
                      onSearch={handleSearch}
                      suggestions={suggestions}
                      className="w-[170px]"
                    />
                    <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
                      Suggestion Box: 170px × 160px
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shadows Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-gray-900">Shadows</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="text-center mb-3">
                    <span className="text-sm font-medium text-gray-700">None</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="8Items looking for"
                      className="w-full h-9 px-3 pr-10 border border-[#E5E5E5] rounded-md bg-white text-[#333333] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-[#A8A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-center mb-3">
                    <span className="text-sm font-medium text-gray-700">0px 2px 8px</span>
                  </div>
                  <SearchWithSuggestions
                    placeholder="8Items looking for"
                    onSearch={handleSearch}
                    suggestions={suggestions}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Padding Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-gray-900">Padding</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block mb-2">
                    Left Padding: 12px
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="8Items looking for"
                      className="w-full h-9 pr-10 border border-[#E5E5E5] rounded-md bg-white text-[#333333] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      style={{ paddingLeft: '12px' }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-[#A8A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block mb-2">
                    Right Padding: 40px
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="8Items looking for"
                      className="w-full h-9 pl-3 border border-[#E5E5E5] rounded-md bg-white text-[#333333] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      style={{ paddingRight: '40px' }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-[#A8A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colors Section */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-gray-900">Colors</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-4 text-gray-700">Search Bar</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                      <span className="text-xs text-gray-600">Color Fill: #FFFFFF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#A8A8A8] rounded"></div>
                      <span className="text-xs text-gray-600">Stroke: #A8A8A8</span>
                    </div>
                  </div>
                  <SearchWithSuggestions
                    placeholder="8Items looking for"
                    onSearch={handleSearch}
                    suggestions={suggestions}
                    className="w-full"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-4 text-gray-700">Suggestion Box</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                      <span className="text-xs text-gray-600">Color Fill: #FFFFFF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#E6F3FF] rounded"></div>
                      <span className="text-xs text-gray-600">Hover: #E6F3FF</span>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="8Items looking for"
                      className="w-full h-9 px-3 pr-10 border border-[#E5E5E5] rounded-md bg-white text-[#333333] placeholder:text-[#A8A8A8] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-[#A8A8A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E5] rounded-md shadow-lg z-10">
                      <div className="p-3 text-sm text-[#333333] hover:bg-[#E6F3FF] hover:text-[#0066CC] cursor-pointer">
                        8Items looking for
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Others Section */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-gray-900">Others</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Custom Border Radius</h3>
                  <SearchWithSuggestions
                    placeholder="8Items looking for"
                    onSearch={handleSearch}
                    suggestions={suggestions}
                    className="w-full [&>div>input]:rounded-xl"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Enhanced Shadow</h3>
                  <SearchWithSuggestions
                    placeholder="8Items looking for"
                    onSearch={handleSearch}
                    suggestions={suggestions}
                    className="w-full [&>div>input]:shadow-lg"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Colored Border</h3>
                  <SearchWithSuggestions
                    placeholder="8Items looking for"
                    onSearch={handleSearch}
                    suggestions={suggestions}
                    className="w-full [&>div>input]:border-blue-300 [&>div>input]:focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Do's Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-gray-900">Do's</h2>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-green-700 font-medium mb-2">✓ Consistent styling</div>
                    <SearchWithSuggestions
                      placeholder="8Items looking for"
                      onSearch={handleSearch}
                      suggestions={suggestions}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-green-700 font-medium mb-2">✓ Proper spacing</div>
                    <SearchWithSuggestions
                      placeholder="8Items looking for"
                      onSearch={handleSearch}
                      suggestions={suggestions}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-green-700 font-medium mb-2">✓ Clear feedback</div>
                    <SearchWithSuggestions
                      placeholder="8Items looking for"
                      onSearch={handleSearch}
                      suggestions={suggestions}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Don'ts Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-gray-900">Don't's</h2>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-xs text-red-700 font-medium mb-2">✗ Inconsistent styling</div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder=""
                    className="w-full h-12 px-2 border-4 border-red-500 bg-yellow-200 text-purple-800 placeholder:text-red-600 focus:outline-none text-lg"
                    style={{ borderRadius: '50px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-gray-900">Use cases</h2>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-blue-800">Purpose:</strong>
                    <p className="text-blue-700 mt-1">A search bar with suggestion box helps users to quickly find what they are looking for.</p>
                  </div>
                  <div>
                    <strong className="text-blue-800">Places:</strong>
                    <p className="text-blue-700 mt-1">List page and filters, forms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
