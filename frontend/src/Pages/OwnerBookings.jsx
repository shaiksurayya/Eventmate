import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaCheck, 
  FaTimes, 
  FaBuilding, 
  FaUser, 
  FaPhoneAlt, 
  FaCalendarDay, 
  FaClock, 
  FaSpinner, 
  FaSearch, 
  FaFilter
} from "react-icons/fa";
import "./OwnerBookings.css";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, CONFIRMED, DELETE_REQUESTED, CANCELLED

  const fetchOwnerBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://eventmate-production-b589.up.railway.app/api/bookings/all");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.patch(`https://eventmate-production-b589.up.railway.app/api/bookings/${bookingId}/status?status=${status}`);
      setBookings((prev) => prev.map(b => b.bookingId === bookingId ? { ...b, status } : b));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Safe formatting helper for different date/time serializations (String vs Array)
  const formatBookingDate = (bookingTime) => {
    if (!bookingTime) return { date: "N/A", time: "" };
    
    if (Array.isArray(bookingTime)) {
      try {
        const [year, month, day, hour = 0, minute = 0] = bookingTime;
        const dateObj = new Date(year, month - 1, day, hour, minute);
        return {
          date: dateObj.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' }),
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } catch (e) {}
    }
    
    try {
      const dateObj = new Date(bookingTime);
      if (!isNaN(dateObj.getTime())) {
        return {
          date: dateObj.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' }),
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
    } catch (e) {}
    
    return { date: String(bookingTime), time: "" };
  };

  // Stats calculation
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => !b.status || b.status === "PENDING").length;
  const confirmedCount = bookings.filter(b => b.status === "CONFIRMED").length;
  const deleteRequestedCount = bookings.filter(b => b.status === "DELETE_REQUESTED").length;

  const filteredBookings = bookings.filter(b => {
    const status = b.status || "PENDING";
    const venueName = b.hall?.hallName || "";
    const clientName = b.userName || "";
    
    const matchesSearch = venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          clientName.toLowerCase().includes(searchTerm.toLowerCase());
                          
    if (!matchesSearch) return false;
    if (statusFilter === "ALL") return true;
    if (statusFilter === "PENDING") return status === "PENDING";
    if (statusFilter === "CONFIRMED") return status === "CONFIRMED";
    if (statusFilter === "DELETE_REQUESTED") return status === "DELETE_REQUESTED";
    if (statusFilter === "CANCELLED") return status === "CANCELLED";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-12 font-sans relative overflow-hidden">
      
      {/* Dynamic gradients overlay */}
      <div className="absolute top-[-10%] right-[-15%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
              Booking Management
            </h2>
            <p className="text-slate-400 mt-2 text-base">
              Monitor customer reservations, approve schedules, and review cancellation requests.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchOwnerBookings}
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 text-sm"
            >
              {loading ? <FaSpinner className="animate-spin text-indigo-400" /> : <FaCalendarDay className="text-emerald-400" />}
              Fetch Latest
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {[
            { label: "Total Bookings", count: totalCount, border: "border-slate-800", text: "text-slate-350" },
            { label: "Pending Approvals", count: pendingCount, border: "border-amber-900/35", text: "text-amber-400" },
            { label: "Confirmed Bookings", count: confirmedCount, border: "border-emerald-900/35", text: "text-emerald-400" },
            { label: "Deletion Requests", count: deleteRequestedCount, border: "border-rose-900/35", text: "text-rose-400" }
          ].map((stat, i) => (
            <div key={i} className={`bg-slate-900/40 backdrop-blur-md rounded-2xl p-5 border ${stat.border} shadow-lg flex flex-col justify-between`}>
              <span className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">{stat.label}</span>
              <span className={`text-3xl sm:text-4xl font-black mt-3 ${stat.text}`}>{loading ? "..." : stat.count}</span>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: "ALL", label: "All Lists" },
              { id: "PENDING", label: "Pending" },
              { id: "CONFIRMED", label: "Confirmed" },
              { id: "DELETE_REQUESTED", label: "Delete Requests" },
              { id: "CANCELLED", label: "Cancelled" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200
                  ${statusFilter === tab.id 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-900"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <FaSearch />
            </span>
            <input 
              type="text"
              placeholder="Search by venue or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* Data List Container */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 gap-4">
            <FaSpinner className="animate-spin text-5xl text-indigo-500" />
            <p className="text-slate-400 text-sm font-semibold">Fetching reservations logs from database...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-slate-900/20 rounded-3xl p-16 text-center border border-slate-850 shadow-inner">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500 text-3xl">
              <FaBuilding />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-2">No Active Reservations</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Any venue reservations or status requests will be shown here.
            </p>
          </div>
        ) : (
          /* Table Layout for Desktop, Flex cards for Mobile */
          <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-850 shadow-xl overflow-hidden">
            
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-850">
                <thead className="bg-slate-950/60 font-semibold text-slate-400">
                  <tr>
                    <th scope="col" className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Property & Client</th>
                    <th scope="col" className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Contact Info</th>
                    <th scope="col" className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Event Details</th>
                    <th scope="col" className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                    <th scope="col" className="py-4 px-6 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 bg-transparent">
                  {filteredBookings.map((booking) => {
                    const { date, time } = formatBookingDate(booking.bookingTime);
                    const status = booking.status || "PENDING";
                    
                    return (
                      <tr key={booking.bookingId} className="hover:bg-slate-900/30 transition-colors group">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1"><FaBuilding className="text-indigo-400" /></div>
                            <div>
                              <div className="font-bold text-slate-200 text-base">{booking.hall?.hallName || "Event Hall"}</div>
                              <div className="text-slate-400 text-sm flex items-center gap-1.5 mt-1">
                                <FaUser className="text-xs text-slate-500" /> {booking.userName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-slate-300 font-medium">
                            <FaPhoneAlt className="text-slate-550 text-xs text-indigo-400" />
                            {booking.userPhone}
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-slate-300">
                            <FaCalendarDay className="text-indigo-400" />
                            <span className="font-semibold text-sm">{date}</span>
                          </div>
                          {time && (
                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 ml-6">
                              <FaClock className="text-slate-500" /> {time}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border
                            ${status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                              status === "CANCELLED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                              status === "DELETE_REQUESTED" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse" :
                              "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                            {status === "DELETE_REQUESTED" ? "Cancel Requested" : status}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end gap-2">
                            {(status === "PENDING" || status === "DELETE_REQUESTED") && (
                              <button 
                                onClick={() => updateStatus(booking.bookingId, "CONFIRMED")} 
                                className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer">
                                <FaCheck /> Approve
                              </button>
                            )}
                            {status !== "CANCELLED" && (
                              <button 
                                onClick={() => updateStatus(booking.bookingId, "CANCELLED")} 
                                className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 text-rose-400 hover:bg-rose-955/20 hover:border-rose-500/50 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer">
                                <FaTimes /> {status === "DELETE_REQUESTED" ? "Confirm Cancel" : "Reject"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (Only shown on small screens) */}
            <div className="block md:hidden divide-y divide-slate-850">
              {filteredBookings.map((booking) => {
                const { date, time } = formatBookingDate(booking.bookingTime);
                const status = booking.status || "PENDING";
                
                return (
                  <div key={booking.bookingId} className="p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                          <FaBuilding className="text-indigo-400 text-sm" />
                          {booking.hall?.hallName || "Event Hall"}
                        </h4>
                        <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-1">
                          <FaUser className="text-slate-500 text-xs" />
                          {booking.userName}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border
                        ${status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          status === "CANCELLED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                          status === "DELETE_REQUESTED" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse" :
                          "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                        {status === "DELETE_REQUESTED" ? "Cancel Req" : status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-850/60 py-3 text-slate-350">
                      <div>
                        <p className="text-slate-500 font-semibold mb-1">Contact Phone</p>
                        <p className="font-medium">{booking.userPhone}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-semibold mb-1">Date & Time</p>
                        <p className="font-medium flex items-center gap-1">
                          <FaCalendarDay className="text-indigo-400" />
                          {date} {time && `• ${time}`}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {(status === "PENDING" || status === "DELETE_REQUESTED") && (
                        <button 
                          onClick={() => updateStatus(booking.bookingId, "CONFIRMED")} 
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95">
                          <FaCheck /> Approve
                        </button>
                      )}
                      {status !== "CANCELLED" && (
                        <button 
                          onClick={() => updateStatus(booking.bookingId, "CANCELLED")} 
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-800 border border-slate-700 text-rose-400 hover:bg-rose-955/20 hover:border-rose-500/50 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95">
                          <FaTimes /> {status === "DELETE_REQUESTED" ? "Confirm Cancel" : "Reject"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerBookings;
