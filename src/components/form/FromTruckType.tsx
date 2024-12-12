import { Select, SelectProps } from '../ui/select';
import { Input } from '../ui/input';
import { forwardRef, useEffect, useState } from 'react';
import request from '@/utils/request';

interface TruckType {
  TRUCK_NO: string;
  TRUCK_TYPE: string;
}

interface FromTruckTypeProps extends SelectProps {
  nationcode: string | undefined;
}

const FromTruckType = forwardRef<HTMLSelectElement, FromTruckTypeProps>(
  ({ nationcode, ...props }, ref) => {
    const [truckTypeCode, setTruckTypeCode] = useState<TruckType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchInput, setSearchInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchData = async (searchValue: string) => {
      if (!nationcode) return;
      
      try {
        setIsLoading(true);
        const { data } = await request.post('/webCommon/getTrcuk', {
          FROM_NATION_CD: nationcode,
          TRUCK_NO: searchValue,
          SEARCH_TYPE: 'START'
        });

        const filteredData = searchValue 
          ? data.filter((item: TruckType) => 
              item.TRUCK_NO.toLowerCase().startsWith(searchValue.toLowerCase())
            )
          : data;

        setTruckTypeCode(filteredData);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error fetching Truck types:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleInputClick = () => {
      setShowDropdown(true);
      if (nationcode) {
        fetchData(searchInput);
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.relative')) {
          setShowDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className="relative">
        <Input
          value={searchInput}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            if (value.length <= 7) {
              setSearchInput(value);
              fetchData(value);
            }
          }}
          onClick={handleInputClick}
          onFocus={handleInputClick}
          placeholder="Enter truck number..."
        />
        {showDropdown && (
          <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
            {isLoading ? (
              <div className="p-2">Loading...</div>
            ) : truckTypeCode.length > 0 ? (
              truckTypeCode.map((item) => (
                <div
                  key={item.TRUCK_NO}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchInput(item.TRUCK_NO);
                    setShowDropdown(false);
                    if (props.onChange) {
                      const event = {
                        target: { value: item.TRUCK_NO }
                      } as any;
                      props.onChange(event);
                    }
                  }}
                >
                  {item.TRUCK_NO}
                </div>
              ))
            ) : (
              <div className="p-2">No results found</div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default FromTruckType;

