import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; 
import { useState } from "react";
import markerIcon from "/src/assets/image/IconMarkerFlower.png";
const locations = [
  { id: 1, name: "Cơ sở 1: Hoàng Mai ", lat: 20.97593, lng: 105.81557, address:"Nghiêm Xuân Yêm, Đại Kim, Hoàng Mai, Hà Nội 100000, Việt Nam (cơ sở chính)", sdt:"1900 232422" },
  { id: 2, name: "Cơ sở 2: Ba Đình", lat: 21.03712, lng: 105.83475, address:"số 1 Hùng Vương, Điện Biên, Ba Đình, Hà Nội, Việt Nam",sdt:"1900 232522"},
  { id: 3, name: "Cơ sở 3: Hoàn Kiếm", lat: 21.028975, lng: 105.853931, address:"P. Đinh Tiên Hoàng, Hàng Trống, Hoàn Kiếm, Hà Nội, Việt Nam",sdt:"1900 232622" },
  { id: 4, name: "Cơ sở 4: Tây Hồ", lat: 21.060715, lng: 105.808716, address:"292-481 Đ. Lạc Long Quân,Xuân La, Tây Hồ, Hà Nội, Việt Nam",sdt:"1900 232722"},
  { id: 5, name: "Cơ sở 5: Sóc Sơn", lat: 21.217942, lng: 105.780005, address:"Thanh Xuân, Sóc Sơn, Hà Nội, Việt Nam",sdt:"1900 232822"},
];

const customIcon = new L.Icon({
  iconUrl: markerIcon, // Icon mặc định
  iconSize: [30, 30], // Kích thước icon
  iconAnchor: [20, 41], // Điểm neo của icon
  popupAnchor: [1, -34], // Vị trí popup
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png", // Bóng của icon // Kích thước bóng
});

const ZoomToLocation = ({ lat, lng }) => {
  const map = useMap();
  map.setView([lat, lng], 15, { animate: true }); // Zoom đến vị trí khi được gọi
  return null;
};
const Findstore = () => {
  const [selectedLocation, setSelectedLocation] = useState();
  return (
    <div className="h-[750px] w-full flex gap-5 mt-2 Content-alignedMid ">
  {/* Danh sách địa chỉ */}
  <div className=" p-4  border-r-[2px] border-e-zinc-400 border-dashed ">
    <h3 className="font-bold text-[25px] text-teal-700 mb-2">Danh sách địa chỉ</h3>
    <div className="flex flex-col gap-6 ">
    {locations.map((loc) => (
      <p>
        <span className="font-bold text-[19px]">{loc.name}</span>
        <p key={loc.id}
        className="cursor-pointer text-green-700 hover:underline hover:text-orange-600 text-[18px]"
        onClick={() => setSelectedLocation(loc)}>Đ/chỉ: {loc.address}</p>
        <p className="text-gray-600 text-[18px]"> Liên hệ: {loc.sdt}</p>
      </p>
    ))}
    <div className="italic text-red-700 mt-14">
    <span className="font-bold">Lưu ý:</span> - Các cơ sở bắt đầu mở cửa lúc 7:00 và đóng cửa lúc 20:00.
           <p className="ml-12">- Các mặt hàng có thể không có sẵn ở cửa hàng, để khách hàng </p>
           <p className="ml-14"> không phải chờ lâu vui lòng liên hệ trước khi tới cửa hàng.</p>
    </div>
    </div>
  </div>

  {/* Bản đồ */}
  <div className="flex-1 w-1/2">
    <MapContainer center={[10.7769, 106.7009]} zoom={12} style={{ height: "100%", width: "100%" }}>
    <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" />

      
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={customIcon}
          eventHandlers={{
            click: () => setSelectedLocation({ lat: loc.lat, lng: loc.lng }),
          }}
        >
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}

      {selectedLocation && <ZoomToLocation lat={selectedLocation.lat} lng={selectedLocation.lng} />}
    </MapContainer>
  </div>
</div>

  );
};

export default Findstore;
