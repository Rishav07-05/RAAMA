import React, { useEffect, useState } from 'react';
import { QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { fetchAdminRooms, updateRoomStatus } from '../../services/api';

export const AdminRoomsView: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRooms = () => {
    fetchAdminRooms()
      .then((res) => {
        if (res.success) setRooms(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleStatusChange = async (roomId: string, newStatus: string) => {
    try {
      const res = await updateRoomStatus(roomId, newStatus);
      if (res.success) {
        toast.success(`Room status updated to ${newStatus}`);
        loadRooms();
      }
    } catch (err) {
      toast.error('Failed to update room status.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#0B1849]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B1849]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#0B1849]">
      <div className="border-b border-[#0B1849]/15 pb-4">
        <h1 className="text-2xl font-serif text-[#0B1849]">Rooms & QR Ordering Directory</h1>
        <p className="text-xs font-sans text-[#596277]">40 Rooms (1 to 40) + Sambhrama Party Hall live status</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-[#0B1849] text-[#FFFCE1] p-4 rounded-sm border border-[#FFFCE1]/15 space-y-3 shadow-md flex flex-col justify-between font-sans text-xs"
          >
            <div>
              <div className="flex justify-between items-center">
                <span className="text-base font-serif font-bold text-[#FFFCE1]">Room #{room.roomNumber}</span>
                <span className="text-[10px] text-[#FFFCE1]/50">Floor {room.floor}</span>
              </div>
              <p className="text-[10px] text-[#FFDE74] mt-0.5 truncate">{room.roomTypeId?.name || 'Executive'}</p>
            </div>

            <div className="space-y-2">
              <select
                value={room.status}
                onChange={(e) => handleStatusChange(room._id, e.target.value)}
                className="w-full bg-[#FFFCE1]/5 text-xs font-bold text-[#FFFCE1] border border-[#FFFCE1]/20 rounded-sm p-1.5 focus:border-[#FFDE74]"
              >
                <option value="AVAILABLE" className="bg-[#0B1849] text-[#FFFCE1]">AVAILABLE</option>
                <option value="OCCUPIED" className="bg-[#0B1849] text-[#FFFCE1]">OCCUPIED</option>
                <option value="RESERVED" className="bg-[#0B1849] text-[#FFFCE1]">RESERVED</option>
                <option value="CLEANING" className="bg-[#0B1849] text-[#FFFCE1]">CLEANING</option>
                <option value="MAINTENANCE" className="bg-[#0B1849] text-[#FFFCE1]">MAINTENANCE</option>
              </select>

              <a
                href={`/order/${room.qrToken}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 bg-[#FFFCE1] text-[#0B1849] hover:bg-[#FFDE74] text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1 transition-all"
              >
                <QrCode size={12} /> Test QR Link
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
