import { useState, useEffect } from 'react'
import { ChevronDown, Plus, Minus, MapPin, ShoppingCart } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface Restaurant {
    id: string
    name: string
    address: string
}

interface MenuItem {
    id: string
    name: string
    description: string
    price: number
    quantity?: number
    [key: string]: any
}

interface OrderItem {
    id: string
    quantity: number
}

const PlaceFnbOrder = () => {
    const navigate = useNavigate()
    const baseUrl = localStorage.getItem('baseUrl') || ''
    const token = localStorage.getItem('token') || ''
    const userId = JSON.parse(localStorage.getItem('user') || '{}').id || ''

    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null)
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [location, setLocation] = useState('')
    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false)
    const [isLoadingMenu, setIsLoadingMenu] = useState(false)
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const [showOrderPlaced, setShowOrderPlaced] = useState(false)
    const [restaurantDropdownOpen, setRestaurantDropdownOpen] = useState(false)

    // Fetch restaurants
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setIsLoadingRestaurants(true)
                const response = await axios.get(
                    `https://${baseUrl}/pms/admin/restaurants.json`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                setRestaurants(response.data.restaurants || [])
            } catch (error) {
                console.error('Failed to fetch restaurants:', error)
                toast.error('Failed to load restaurants')
            } finally {
                setIsLoadingRestaurants(false)
            }
        }

        if (baseUrl && token) {
            fetchRestaurants()
        }
    }, [baseUrl, token])

    // Fetch menu when restaurant is selected
    useEffect(() => {
        const fetchMenu = async () => {
            if (!selectedRestaurant) {
                setMenuItems([])
                return
            }

            try {
                setIsLoadingMenu(true)
                const response = await axios.get(
                    `https://${baseUrl}/pms/admin/restaurants/${selectedRestaurant}/restaurant_menus.json`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                const items = (response.data.restaurant_menu || []).map((item: any) => ({
                    ...item,
                    price: item.display_price || item.price || 0,
                    quantity: 0,
                }))
                setMenuItems(items)
            } catch (error) {
                console.error('Failed to fetch menu:', error)
                toast.error('Failed to load menu')
                setMenuItems([])
            } finally {
                setIsLoadingMenu(false)
            }
        }

        fetchMenu()
    }, [selectedRestaurant, baseUrl, token])

    const handleQuantityChange = (itemId: string, change: number) => {
        setMenuItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: Math.max(0, (item.quantity || 0) + change) }
                    : item
            )
        )
    }

    const getSelectedRestaurant = () => {
        return restaurants.find((r) => r.id === selectedRestaurant)
    }

    const getOrderSummary = () => {
        const items = menuItems.filter((item) => item.quantity > 0)
        const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
        return { items, total }
    }

    const handlePlaceOrder = async () => {
        if (!selectedRestaurant) {
            toast.error('Please select a restaurant')
            return
        }

        if (!location.trim()) {
            toast.error('Please enter a delivery location')
            return
        }

        const { items } = getOrderSummary()
        if (items.length === 0) {
            toast.error('Please add items to your order')
            return
        }

        try {
            setIsPlacingOrder(true)
            const orderItems = items.map((item) => ({
                menu_id: item.id,
                quantity: item.quantity,
            }))

            await axios.post(
                `https://${baseUrl}/pms/food_orders.json`,
                {
                    food_order: {
                        restaurant_id: selectedRestaurant,
                        user_id: userId,
                        requests: location,
                        items_attributes: orderItems,
                    },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setShowOrderPlaced(true)
            toast.success('Order placed successfully!')

            // Auto-redirect after 5 seconds
            setTimeout(() => {
                navigate('/employee/fnb')
            }, 5000)
        } catch (error) {
            console.error('Failed to place order:', error)
            toast.error('Failed to place order. Please try again.')
        } finally {
            setIsPlacingOrder(false)
        }
    }

    const { items: selectedItems, total: orderTotal } = getOrderSummary()

    return (
        <>
            {showOrderPlaced && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
                        <p className="text-gray-600 mb-6">
                            Your order has been successfully placed. Redirecting to orders list...
                        </p>
                        <div className="text-sm text-gray-500">Redirecting in 5 seconds</div>
                    </div>
                </div>
            )}

            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-6">Place F&B Order</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Section - Restaurant & Menu */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Select Restaurant */}
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Select Restaurant
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setRestaurantDropdownOpen(!restaurantDropdownOpen)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <span className={getSelectedRestaurant() ? 'text-gray-900' : 'text-gray-500'}>
                                        {getSelectedRestaurant()?.name || 'Choose a restaurant'}
                                    </span>
                                    <ChevronDown
                                        size={20}
                                        className={`transition-transform ${restaurantDropdownOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {restaurantDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 max-h-64 overflow-y-auto">
                                        {isLoadingRestaurants ? (
                                            <div className="p-4 text-center text-gray-500">Loading...</div>
                                        ) : restaurants.length > 0 ? (
                                            restaurants.map((restaurant) => (
                                                <button
                                                    key={restaurant.id}
                                                    onClick={() => {
                                                        setSelectedRestaurant(restaurant.id)
                                                        setRestaurantDropdownOpen(false)
                                                    }}
                                                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 ${selectedRestaurant === restaurant.id
                                                        ? 'bg-blue-100 text-blue-900'
                                                        : ''
                                                        }`}
                                                >
                                                    <div className="font-medium">{restaurant.name}</div>
                                                    <div className="text-sm text-gray-600">{restaurant.address}</div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">No restaurants available</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Menu Items */}
                        {selectedRestaurant && (
                            <div className="bg-white rounded-lg p-6 shadow-md">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Menu</h2>

                                {isLoadingMenu ? (
                                    <div className="text-center py-8 text-gray-500">Loading menu...</div>
                                ) : menuItems.length > 0 ? (
                                    <div className="space-y-4">
                                        {menuItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                                        ₹{(item.price || 0).toFixed(2)}
                                                    </p>
                                                </div>

                                                {item.quantity === 0 ? (
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                        className="ml-4 flex items-center gap-2 px-4 py-2 bg-[#c72030] text-white rounded-lg hover:bg-[#c72030] transition-colors"
                                                    >
                                                        <Plus size={18} />
                                                        Add
                                                    </button>
                                                ) : (
                                                    <div className="ml-4 flex items-center gap-2 border border-gray-300 rounded-lg p-2">
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, -1)}
                                                            className="p-1 hover:bg-gray-200 rounded"
                                                        >
                                                            <Minus size={18} className="text-gray-600" />
                                                        </button>
                                                        <span className="w-8 text-center font-semibold">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, 1)}
                                                            className="p-1 hover:bg-gray-200 rounded"
                                                        >
                                                            <Plus size={18} className="text-gray-600" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">No menu items available</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Section - Order Summary & Location */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 shadow-md sticky top-6 space-y-6">
                            {/* Order Summary */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <ShoppingCart size={20} />
                                    <h3 className="font-semibold text-gray-800">Order Summary</h3>
                                </div>

                                {selectedItems.length > 0 ? (
                                    <div className="space-y-2 border-b border-gray-200 pb-4 mb-4">
                                        {selectedItems.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-gray-700">
                                                    {item.name} x{item.quantity}
                                                </span>
                                                <span className="font-medium">
                                                    ₹{((item.price || 0) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        <p>No items added yet</p>
                                    </div>
                                )}

                                {selectedItems.length > 0 && (
                                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                                        <span>Total:</span>
                                        <span>₹{orderTotal.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Location Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Delivery Location
                                </label>
                                <div className="relative">
                                    <MapPin
                                        size={18}
                                        className="absolute left-3 top-3 text-gray-400"
                                    />
                                    <textarea
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Enter your delivery address"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                                    />
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder || !selectedRestaurant || selectedItems.length === 0}
                                className="w-full px-4 py-3 bg-[#c72030] text-white font-semibold rounded-lg hover:bg-[#c72030] disabled:bg-red-200 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <div className="animate-spin">
                                            <ShoppingCart size={20} />
                                        </div>
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={20} />
                                        Place Order
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PlaceFnbOrder