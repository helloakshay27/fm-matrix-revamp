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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
          SEARCH BAR WITH SUGGESTION
        </h1>

        {/* Reference Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex">
              <div className="w-32 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Reference</h2>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Desktop</h3>
                    <div className="flex justify-center">
                      <SearchWithSuggestions
                        placeholder="Search..."
                        onSearch={handleSearch}
                        suggestions={suggestions}
                        className="w-[290px]"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Tablet</h3>
                    <div className="flex justify-center">
                      <SearchWithSuggestions
                        placeholder="Search..."
                        onSearch={handleSearch}
                        suggestions={suggestions}
                        className="w-[250px]"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Mobile</h3>
                    <div className="flex justify-center">
                      <SearchWithSuggestions
                        placeholder="Search..."
                        onSearch={handleSearch}
                        suggestions={suggestions}
                        className="w-[170px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Radius Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex">
              <div className="w-32 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Radius</h2>
              </div>
              <div className="flex-1">
                <div className="text-center">
                  <div className="mb-4">
                    <span className="text-lg font-medium text-gray-900">0px</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative w-[290px]">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-9 px-3 pr-10 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        style={{ borderRadius: '0px' }}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacing Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex">
              <div className="w-32 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Spacing</h2>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Desktop</h3>
                    <div className="relative flex justify-center">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-[290px] h-9 px-3 pr-10 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        {/* Dimension annotations */}
                        <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500">
                          <span>290px</span>
                          <span>36px</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Tablet</h3>
                    <div className="relative flex justify-center">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-[250px] h-9 px-3 pr-10 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500">
                          <span>250px</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Mobile</h3>
                    <div className="relative flex justify-center">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-[170px] h-9 px-3 pr-10 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500">
                          <span>170px</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Width/Height Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex">
              <div className="w-32 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Width/height</h2>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Desktop</h3>
                    <div className="space-y-2">
                      <div className="flex justify-center gap-2 text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">Width: 290px</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Height: 36px</span>
                      </div>
                      <div className="flex justify-center">
                        <SearchWithSuggestions
                          placeholder="Search..."
                          onSearch={handleSearch}
                          suggestions={suggestions}
                          className="w-[290px]"
                        />
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">Suggestion Box: Width 290px, Height 160px</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Tablet</h3>
                    <div className="space-y-2">
                      <div className="flex justify-center gap-2 text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">Width: 250px</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Height: 36px</span>
                      </div>
                      <div className="flex justify-center">
                        <SearchWithSuggestions
                          placeholder="Search..."
                          onSearch={handleSearch}
                          suggestions={suggestions}
                          className="w-[250px]"
                        />
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">Suggestion Box: Width 250px, Height 160px</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Mobile</h3>
                    <div className="space-y-2">
                      <div className="flex justify-center gap-2 text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">Width: 170px</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Height: 36px</span>
                      </div>
                      <div className="flex justify-center">
                        <SearchWithSuggestions
                          placeholder="Search..."
                          onSearch={handleSearch}
                          suggestions={suggestions}
                          className="w-[170px]"
                        />
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">Suggestion Box: Width 170px, Height 160px</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shadows Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex">
              <div className="w-32 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Shadows</h2>
              </div>
              <div className="flex-1">
                <div className="text-center">
                  <div className="mb-4">
                    <span className="text-lg font-medium text-gray-900">None</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative w-[290px]">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-9 px-3 pr-10 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Padding Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex">
              <div className="w-32 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Padding</h2>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="mb-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Left Padding: 12px</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="relative w-[200px]">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full h-9 pr-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          style={{ paddingLeft: '12px' }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Top Padding: 12px</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="relative w-[200px]">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full px-3 pr-10 pb-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          style={{ paddingTop: '12px' }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Bottom Padding: 12px</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="relative w-[200px]">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full px-3 pr-10 pt-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          style={{ paddingBottom: '12px' }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Right Padding: 12px</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="relative w-[200px]">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full py-2 pl-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          style={{ paddingRight: '12px' }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colors Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex">
              <div className="w-32 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Colors</h2>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Search Bar</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">Color Fill: #FFFFFF</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Color Fill Opacity: 100%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">Stroke: #A8A8A8</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Stroke Opacity: 100%</span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="relative w-[290px]">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full h-9 px-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          style={{ 
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #A8A8A8',
                            borderRadius: '6px'
                          }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Suggestion Box</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">Color Fill: #FFFFFF</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Color Fill Opacity: 100%</span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="relative w-[290px]">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full h-9 px-3 pr-10 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div 
                          className="absolute top-full left-0 right-0 mt-1 border border-gray-300 rounded-md shadow-lg z-10"
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
          </div>
        </div>

        {/* Others Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex">
              <div className="w-32 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Others</h2>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Custom Border Radius</h3>
                    <SearchWithSuggestions
                      placeholder="Custom radius..."
                      onSearch={handleSearch}
                      suggestions={suggestions}
                      className="w-full [&>div>input]:rounded-xl"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Enhanced Shadow</h3>
                    <SearchWithSuggestions
                      placeholder="With shadow..."
                      onSearch={handleSearch}
                      suggestions={suggestions}
                      className="w-full [&>div>input]:shadow-lg"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-4 text-gray-700">Colored Border</h3>
                    <SearchWithSuggestions
                      placeholder="Colored border..."
                      onSearch={handleSearch}
                      suggestions={suggestions}
                      className="w-full [&>div>input]:border-blue-300 [&>div>input]:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Do's Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex">
              <div className="w-32 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Do's</h2>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="text-sm font-medium mb-4 text-green-800 text-center">8Items looking for</h3>
                    <div className="flex justify-center mb-2">
                      <SearchWithSuggestions
                        placeholder="8Items looking for"
                        onSearch={handleSearch}
                        suggestions={suggestions}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-center mb-2">
                      <SearchWithSuggestions
                        placeholder="8Items looking for"
                        onSearch={handleSearch}
                        suggestions={suggestions}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-center mb-2">
                      <SearchWithSuggestions
                        placeholder="8Items looking for"
                        onSearch={handleSearch}
                        suggestions={suggestions}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="text-sm font-medium mb-4 text-green-800 text-center">8Items looking for</h3>
                    <div className="flex justify-center mb-2">
                      <SearchWithSuggestions
                        placeholder="8Items looking for"
                        onSearch={handleSearch}
                        suggestions={suggestions}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-center mb-2">
                      <SearchWithSuggestions
                        placeholder="8Items looking for"
                        onSearch={handleSearch}
                        suggestions={suggestions}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-center mb-2">
                      <SearchWithSuggestions
                        placeholder="8Items looking for"
                        onSearch={handleSearch}
                        suggestions={suggestions}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="text-sm font-medium mb-4 text-green-800 text-center">8Items looking for</h3>
                    <div className="flex justify-center mb-2">
                      <SearchWithSuggestions
                        placeholder="8Items looking for"
                        onSearch={handleSearch}
                        suggestions={suggestions}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-center mb-2">
                      <SearchWithSuggestions
                        placeholder="8Items looking for"
                        onSearch={handleSearch}
                        suggestions={suggestions}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-center mb-2">
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
          </div>
        </div>

        {/* Don'ts Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex">
              <div className="w-32 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Don't's</h2>
              </div>
              <div className="flex-1">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex justify-center">
                    <div className="relative w-[290px]">
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
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex">
              <div className="w-32 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Use cases</h2>
              </div>
              <div className="flex-1">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="space-y-2">
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
        </div>
      </div>
    </div>
  );
};
