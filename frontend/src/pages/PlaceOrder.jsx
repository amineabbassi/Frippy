import React, { useContext, useState, useEffect } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { cartItems, products, getCartAmount, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setIsLoggedIn(true);
      setCurrentEmail(email);
      setForm((prevForm) => ({ ...prevForm, email })); // Set email in form state
    }
  }, []);

  // Form state
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zip: '', country: '', mobile: ''
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle logout and redirect to login page
  const handleLogoutAndLogin = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token"); // Remove token if used for authentication
    setIsLoggedIn(false);
    setCurrentEmail("");
    navigate('/login'); // Redirect to login page
  };

  // Prepare order items
  const getOrderItems = () => {
    let items = [];
    for (const productId in cartItems) {
      const product = products.find(p => p._id === productId);
      if (!product) continue;
      for (const size in cartItems[productId]) {
        items.push({
          productId, // must be a valid 24-char hex string
          size,
          quantity: cartItems[productId][size],
          price: product.price,
          name: product.name,
          image: product.image[0]
        });
      }
    }
    return items;
  };

  // Handle Stripe payment
  const handleStripePayment = async (total) => {
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    const res = await fetch('/api/payment/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total * 100 }), // Stripe expects amount in cents
    });
    const { clientSecret } = await res.json();
    const result = await stripe.confirmCardPayment(clientSecret);
    if (result.error) {
      toast.error(result.error.message);
      return null;
    }
    return { paymentIntentId: result.paymentIntent.id };
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (total) => {
    const res = await fetch('/api/payment/razorpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total * 100 }), // Razorpay expects amount in paise
    });
    const { orderId } = await res.json();
    return new Promise((resolve, reject) => {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: 'INR',
        name: 'Frippy',
        description: 'Order Payment',
        order_id: orderId,
        handler: (response) => resolve(response),
        prefill: { email: form.email, contact: form.mobile },
        theme: { color: '#3399cc' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => reject(response.error));
      rzp.open();
    });
  };

  // Place order handler
  const handlePlaceOrder = async () => {
    const { firstName, lastName, email, street, city, state, zip, country, mobile } = form;
    if (!firstName || !lastName || !email || !street || !city || !state || !zip || !country || !mobile) {
      toast.error("Please fill all fields");
      return;
    }
    const address = `${street}, ${city}, ${state}, ${zip}, ${country}`;
    const items = getOrderItems();
    const total = getCartAmount();

    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    let paymentDetails = null;
    if (method === 'stripe') {
      paymentDetails = await handleStripePayment(total);
      if (!paymentDetails) return;
    } else if (method === 'razorpay') {
      try {
        paymentDetails = await handleRazorpayPayment(total);
      } catch (error) {
        toast.error("Razorpay payment failed");
        return;
      }
    }

    try {
      // Use full backend URL if needed, for example: http://localhost:4000/api/order/create
      const res = await fetch("http://localhost:4000/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: email,
          firstName,
          lastName,
          mobile,
          address, // Only the actual address
          items,
          total,
          paymentMethod: method,
          paymentDetails,
        }),
      });
      const data = await res.json();
      console.log("Order API response:", data);
      if (data.success) {
        toast.success("Order placed successfully!");
        setCartItems({});
        navigate('/orders');
      } else {
        toast.error(data.message || "Order failed");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("Order failed");
    }
  };


  return (
    <div className='flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side Content */}
      <div className='flex flex-col w-full gap-4 sm:max-w-[480px]'>
        <div className='my-3 text-xl sm:text-2xl'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        {/* Show options based on login status */}
        {isLoggedIn ? (
          <div className="mb-4">
            <p className="text-gray-700">You are logged in as <strong>{currentEmail}</strong>.</p>
            <button
              onClick={handleLogoutAndLogin}
              className="text-blue-600 underline"
            >
              Log in with another account
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-gray-700">You are not logged in.</p>
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 underline"
            >
              Log in to place an order
            </button>
          </div>
        )}

        <div className='flex gap-3'>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" name="firstName" placeholder='First Name' onChange={handleChange} />
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" name="lastName" placeholder='Last Name' onChange={handleChange} />
        </div>
        <input
          className='w-full px-4 py-2 border border-gray-300 rounded'
          type="email"
          name="email"
          placeholder='Email'
          value={isLoggedIn ? currentEmail : form.email} // Use logged-in email if available
          onChange={handleChange}
          disabled={isLoggedIn} // Disable email input if logged in
        />
        <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" name="street" placeholder='Street' onChange={handleChange} />
        <div className='flex gap-3'>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" name="city" placeholder='City' onChange={handleChange} />
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" name="state" placeholder='State' onChange={handleChange} />
        </div>
        <div className='flex gap-3'>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="number" name="zip" placeholder='Zip' onChange={handleChange} />
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" name="country" placeholder='Country' onChange={handleChange} />
        </div>
        <input className='w-full px-4 py-2 border border-gray-300 rounded' type="number" name="mobile" placeholder='Mobile' onChange={handleChange} />
      </div>
      {/* Right Side Content */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        {/* Payment Methods Selection */}
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHODS'} />
          <div className='flex flex-col gap-3 lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-600' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-600' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="RazorPay" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-600' : ''}`}></p>
              <p className='mx-4 text-sm font-medium text-gray-500'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full mt-8 text-end'>
            <button onClick={handlePlaceOrder} className='px-16 py-3 text-sm text-white bg-black active:bg-gray-800'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
