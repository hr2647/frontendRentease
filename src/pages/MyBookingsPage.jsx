// src/pages/MyBookingsPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyBookings } from '../services/api';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  let colorClass = '';
  switch (status) {
    case 'confirmed':
      colorClass = 'bg-green-500';
      break;
    case 'cancelled':
      colorClass = 'bg-red-500';
      break;
    default: // pending
      colorClass = 'bg-yellow-500';
      break;
  }
  return <span className={`px-3 py-1 text-xs font-medium text-white rounded-full ${colorClass}`}>{status}</span>;
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (err) {
        setError('Failed to load your bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading Your Bookings...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500 text-xl">{error}</div>;
  }

  const validBookings = bookings.filter(booking => booking && booking.property);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
      
      {validBookings.length > 0 ? (
        <div className="space-y-4">
          {validBookings.map((booking) => (
            <div key={booking._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center gap-4">
                <img 
                  src={booking.property.image ? `http://localhost:5000/images/${booking.property.image}` : 'https://via.placeholder.com/150'} 
                  alt={booking.property.title}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <Link to={`/property/${booking.property._id}`} className="text-lg font-semibold text-indigo-600 hover:underline">
                    {booking.property.title}
                  </Link>
                  <p className="text-sm text-gray-500">{booking.property.address}</p>
                  <p className="text-sm font-semibold mt-1">
                    {format(new Date(booking.startDate), 'MMM dd, yyyy')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm font-semibold">Total Price: ₹{booking.totalPrice.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <StatusBadge status={booking.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-xl text-gray-500">You haven't made any bookings yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
