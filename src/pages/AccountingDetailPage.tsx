import React, { useState } from 'react';
import { ArrowLeft, Star, Calculator, Download, ThumbsUp, ThumbsDown, User, Building, Mail, Phone, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InstallModal } from '@/components/InstallModal';

const AccountingDetailPage = () => {
  const navigate = useNavigate();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const handleInstallClick = () => {
    setIsInstallModalOpen(true);
  };

  const tabs = ['Overview', 'Screenshots', 'Ratings & Reviews', 'Vendor'];

  const screenshots = [
    {
      id: 1,
      title: 'Financial Dashboard',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop&crop=center',
      description: 'Comprehensive financial overview and dashboard'
    },
    {
      id: 2,
      title: 'Invoice Management',
      image: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=800&h=600&fit=crop&crop=center',
      description: 'Advanced invoice creation and management tools'
    },
    {
      id: 3,
      title: 'Expense Tracking',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
      description: 'Detailed expense tracking and categorization'
    },
    {
      id: 4,
      title: 'Financial Reports',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
      description: 'Comprehensive financial reporting and analytics'
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Rachel Williams',
      rating: 5,
      date: 'March 18, 2024',
      title: 'Excellent accounting solution',
      comment: 'This software has streamlined our entire accounting process. The automation features save us hours of work every week.',
      helpful: 42,
      avatar: 'RW'
    },
    {
      id: 2,
      name: 'Mark Johnson',
      rating: 4,
      date: 'March 3, 2024',
      title: 'Great features and support',
      comment: 'Very comprehensive feature set with excellent customer support. The reporting capabilities are particularly impressive.',
      helpful: 38,
      avatar: 'MJ'
    },
    {
      id: 3,
      name: 'Sofia Rodriguez',
      rating: 5,
      date: 'February 15, 2024',
      title: 'Perfect for small business',
      comment: 'Easy to use interface with powerful features. The multi-currency support is exactly what we needed for our international business.',
      helpful: 29,
      avatar: 'SR'
    },
    {
      id: 4,
      name: 'Kevin Zhang',
      rating: 4,
      date: 'February 1, 2024',
      title: 'Solid accounting platform',
      comment: 'Reliable and feature-rich accounting solution. The integration with our existing systems was seamless.',
      helpful: 33,
      avatar: 'KZ'
    }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">About this Extension</h2>
          <p className="text-gray-600 mb-4">
            Streamline your financial operations with our comprehensive Accounting solution. Designed for businesses 
            of all sizes, this powerful tool provides complete financial management capabilities including invoicing, 
            expense tracking, financial reporting, and seamless integration with existing business systems.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Key Features</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Automated invoicing and billing with customizable templates</li>
            <li>• Real-time financial reporting and dashboard analytics</li>
            <li>• Expense tracking and categorization with receipt management</li>
            <li>• Multi-currency support and tax compliance features</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#C72030] text-white px-3 py-1 rounded text-sm">Finance</span>
            <span className="bg-[#C72030] text-white px-3 py-1 rounded text-sm">Accounting</span>
            <span className="bg-[#C72030] text-white px-3 py-1 rounded text-sm">Business</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">App Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Development team:</span>
              <span>FM Solutions</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span>Apr 18, 2023</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Language:</span>
              <span>English</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span>Finance</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pricing:</span>
              <span>Free</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Compatible Editions</h3>
          <ul className="space-y-1 text-sm">
            <li>• Standard Plus</li>
            <li>• CRM Plus</li>
            <li>• CRM One</li>
            <li>• Ultimate</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Share This App</h3>
          <div className="flex space-x-2">
            <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">f</button>
            <button className="p-2 bg-blue-400 text-white rounded hover:bg-blue-500">t</button>
            <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800">in</button>
            <button className="p-2 bg-red-600 text-white rounded hover:bg-red-700">g+</button>
          </div>
        </div>

        <button className="w-full bg-[#C72030] text-white py-2 rounded-lg hover:bg-[#A01A28] transition-colors">
          Request a Demo
        </button>
      </div>
    </div>
  );

  const renderScreenshots = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">App Screenshots</h2>
        <p className="text-gray-600">Explore the key features and interface of Accounting</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {screenshots.map((screenshot) => (
          <div key={screenshot.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src={screenshot.image} 
              alt={screenshot.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{screenshot.title}</h3>
              <p className="text-gray-600 text-sm">{screenshot.description}</p>
              <button className="mt-3 flex items-center text-[#C72030] hover:text-[#A01A28] text-sm font-medium">
                <Download className="w-4 h-4 mr-1" />
                View Full Size
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRatingsReviews = () => (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ratings & Reviews</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-2xl font-bold">4.6</span>
              </div>
              <span className="text-gray-600">(15 reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2 text-sm">
                  <span>{rating}</span>
                  <Star className="w-3 h-3 fill-gray-300 text-gray-300" />
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: rating === 5 ? '65%' : rating === 4 ? '30%' : '5%' }}
                    ></div>
                  </div>
                  <span className="text-gray-500 w-8">{rating === 5 ? '10' : rating === 4 ? '4' : rating === 3 ? '1' : '0'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[#C72030] text-white rounded-full flex items-center justify-center font-semibold">
                {review.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} 
                          />
                        ))}
                      </div>
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
                <h5 className="font-medium mb-2">{review.title}</h5>
                <p className="text-gray-600 mb-3">{review.comment}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600">
                    <ThumbsDown className="w-4 h-4" />
                    <span>Not helpful</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVendor = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-[#C72030] rounded-lg flex items-center justify-center">
            <Building className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">FM Solutions</h2>
            <p className="text-gray-600 mb-4">
              FM Solutions is a leading provider of enterprise financial software solutions specializing in accounting 
              and business management systems. With over 10 years of experience, we help businesses streamline their 
              financial operations through innovative and reliable technology solutions.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>• Founded in 2013</span>
              <span>• 50+ employees</span>
              <span>• Based in San Francisco, CA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-[#C72030]" />
              <span>support@fmsolutions.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-[#C72030]" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-[#C72030]" />
              <span>www.fmsolutions.com</span>
            </div>
          </div>
        </div>

        {/* Company Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Company Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Apps:</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Installations:</span>
              <span className="font-semibold">4,100+</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Rating:</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.6</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Years of Experience:</span>
              <span className="font-semibold">11 years</span>
            </div>
          </div>
        </div>
      </div>

      {/* Other Apps */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Other Apps by FM Solutions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Financial Analytics Pro', rating: 4.7, installs: '1.8K+' },
            { name: 'Expense Management Suite', rating: 4.5, installs: '1.3K+' },
            { name: 'Tax Compliance Manager', rating: 4.8, installs: '950+' }
          ].map((app, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h4 className="font-medium mb-2">{app.name}</h4>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{app.rating}</span>
                </div>
                <span className="text-gray-500">{app.installs}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return renderOverview();
      case 'Screenshots':
        return renderScreenshots();
      case 'Ratings & Reviews':
        return renderRatingsReviews();
      case 'Vendor':
        return renderVendor();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-[#C72030]">
      {/* Header */}
      <div className="bg-[#C72030] text-white p-6">
        <div className="flex items-center space-x-4 mb-6">
          <button 
            onClick={() => navigate('/market-place/all')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <Calculator className="w-8 h-8 text-[#C72030]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Accounting</h1>
              <p className="text-white/80">Complete accounting management system</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm">by FM Solutions</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm">(15)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-auto">
            <button 
              onClick={handleInstallClick}
              className="bg-[#C72030] hover:bg-[#A01A28] text-white px-6 py-2 rounded-lg font-medium transition-colors border border-white"
            >
              Install
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-6 border-b border-white/20">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-white text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Install Modal */}
      <InstallModal 
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        appName="Accounting"
      />
    </div>
  );
};

export default AccountingDetailPage;
