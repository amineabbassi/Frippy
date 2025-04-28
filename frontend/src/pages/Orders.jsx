import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "";

  useEffect(() => {
    if (!userEmail) return;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/order/user?user=${encodeURIComponent(userEmail)}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error("Orders fetch failed:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [userEmail]);

  if (!userEmail) {
    return (
      <div className='pt-16 border-t text-center'>
        <Title text1={'PLEASE'} text2={'LOGIN'} />
        <p>You need to login to view your orders.</p>
        <button className='mt-4 px-8 py-2 bg-blue-600 text-white' onClick={() => navigate('/login')}>Login</button>
      </div>
    );
  }

  return (
    <div className='pt-16 border-t'>
      <div className='text-2xl'>
        <Title text1={'YOUR'} text2={'ORDERS'} />
      </div>
      <div>
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order._id} className='flex flex-col gap-4 py-4 text-gray-700 border-t border-b md:flex-row md:items-center md:justify-between'>
              <div className='flex items-start gap-6 text-sm'>
                {order.items[0] && (
                  <img className='w-16 sm:w-20' src={order.items[0].image} alt="Order Item" />
                )}
                <div>
                  <p className='font-medium sm:text-base'>Order #{order._id.slice(0, 6)}</p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p className='text-lg'>Total: {order.total}</p>
                    <p>
                      Items: {order.items.reduce((acc, curr) => acc + curr.quantity, 0)}
                    </p>
                  </div>
                  <p className='mt-2'>
                    Date: <span className='text-gray-400'>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
              <div className='flex justify-between md:w-1/2'>
                <div className='flex items-center gap-2'>
                  <p className='h-2 bg-green-500 rounded-full min-w-2'></p>
                  <p className='text-sm md:text-base'>{order.status}</p>
                </div>
                <button 
                  onClick={() => navigate(`/track-order/${order._id}`)} 
                  className='px-4 py-2 text-sm font-medium border rounded-sm hover:bg-gray-50'
                >
                  TRACK ORDER
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className='py-8 text-center'>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
