import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../components/Title';

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch order details dynamically from backend
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/order/detail?orderId=${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        } else {
          console.error("Fetch order failed:", data.message);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  // Helper to compute current step index based on order status
  const getStatusStep = (status) => {
    const steps = {
      pending: 0,
      confirmed: 1,
      in_transit: 2,
      delivered: 3,
    };
    return steps[status] ?? 0;
  };

  // Timeline steps (titles and descriptions)
  const timelineSteps = [
    { title: "Order Placed", description: "Your order has been placed" },
    { title: "Confirmed", description: "Order has been confirmed" },
    { title: "In Transit", description: "Order is on the way" },
    { title: "Delivered", description: "Order has been delivered" },
  ];

  if (loading) return <p className="pt-16 text-center">Loading order details...</p>;
  if (!order) return <p className="pt-16 text-center">Order not found!</p>;

  const currentStep = getStatusStep(order.status);
  const estimatedDelivery = new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Title */}
        <div className="my-3 text-xl sm:text-2xl">
          <Title text1="TRACK" text2="ORDER" />
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order #{order._id.slice(0, 6)}</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Estimated Delivery</p>
              <p className="font-medium">{estimatedDelivery}</p>
            </div>
            <div>
              <p className="text-gray-500">Shipping Method</p>
              <p className="font-medium">{order.shippingMethod || "Standard Delivery"}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="relative space-y-8">
            {timelineSteps.map((step, index) => (
              <div key={index} className="flex">
                {index !== timelineSteps.length - 1 && (
                  <div 
                    className="absolute left-[1rem] w-0.5 bg-gray-200"
                    style={{ top: `${index * 8 + 2}rem`, height: '6rem' }}
                  />
                )}
                <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${index <= currentStep ? 'bg-green-500' : 'bg-gray-200'} text-white`}>
                  {/* Use dynamic icons or static ones */}
                  {index === 0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="ml-4 pb-10">
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                  {index <= currentStep && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()} {/* Or dynamic date per step */}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="font-semibold mb-4">Shipping Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm">Recipient</p>
              <p className="mt-1">{order.firstName} {order.lastName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Mobile</p>
              <p className="mt-1">{order.mobile}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500 text-sm">Delivery Address</p>
              <p className="mt-1">{order.address || "N/A"}</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TrackOrder;
