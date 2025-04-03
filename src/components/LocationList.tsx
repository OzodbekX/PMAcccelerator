interface LocationListProps {
    locations: { id: number; name: string }[];
    onSelect: (id: number, name: string) => void;
  }
  
  const LocationList: React.FC<LocationListProps> = ({ locations, onSelect }) => {
    if (locations.length === 0) return null;
  
    return (
      <ul className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
        {locations.map((location) => (
          <li 
            key={location.id}
            className="p-3 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(location.id, location.name)}
          >
            {location.name}
          </li>
        ))}
      </ul>
    );
  };
  
  export default LocationList;