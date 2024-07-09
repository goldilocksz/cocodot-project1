import { Link, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Auth } from '@/types/data';
import { AuthContext } from './authProvider';
import { useContext, useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import request from '@/utils/request';

interface MenuItem {
  MENU_ID: string;
  MENU_NAME: string;
  OS_TYPE: string;
  SRC_PATH: string;
  MENU_TYPE: string;
}

export default function Header() {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const user = context?.user as Auth;
  const isAuthenticated = context?.isAuthenticated as () => boolean;
  const logout = context?.logout as () => void;

  // API 호출을 통해 메뉴 아이템 데이터를 가져오는 useQuery 사용
  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ['getMenu'],
    queryFn: async () => {
      const { data } = await request.post('/webCommon/getMenu', { OS_TYPE: 'WEB' });
      return data;
    },
  });

  // SheetContent 토글을 위한 상태 설정
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // useRef를 사용하여 SheetContent 외의 영역을 클릭했을 때 처리
  const sheetRef = useRef<HTMLDivElement>(null);

  // SheetContent 닫기 함수
  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  // SheetContent 외의 영역 클릭 이벤트 처리
  const handleClickOutside = (event: MouseEvent) => {
    if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
      closeSheet();
      document.body.click(); // SheetContent가 닫힌 후 빈 공간을 자동으로 클릭
    }
  };

  // useEffect를 사용하여 이벤트 리스너 설정 및 isSheetOpen 변경 시 처리
  useEffect(() => {
    if (isSheetOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('overflow-hidden'); // SheetContent가 열릴 때 body overflow 숨기기
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('overflow-hidden'); // SheetContent가 닫힐 때 body overflow 복구
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('overflow-hidden'); // 컴포넌트 언마운트 시 body overflow 복구
    };
  }, [isSheetOpen]);

  // 링크 클릭 시 SheetContent 닫기 및 메뉴 이동
  const handleLinkClick = (path: string) => {
    closeSheet(); // SheetContent 닫기
    navigate(path); // 메뉴 이동
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      {/* SheetContent */}
      <Sheet>
        <SheetTrigger asChild>
          {/* Toggle navigation menu를 Menu 아이콘으로 변경 */}
          <Button variant="outline" size="icon" className="shrink-0 md:hidden" onClick={() => setIsSheetOpen(!isSheetOpen)}>
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={`flex flex-col ${isSheetOpen ? '' : 'hidden'}`} ref={sheetRef}>
          <nav className="grid gap-2 text-lg font-medium">
            <Link to="#" className="flex items-center gap-2 text-lg font-semibold">
              <img src="/images/logo.png" alt="" className="h-[30px]" />
            </Link>
            {/* /webCommon/getMenu 에서 가져온 메뉴 아이템 데이터를 기반으로 렌더링 */}
            {menuItems?.map((item) => (
              <div
                key={item.MENU_ID}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => handleLinkClick(item.SRC_PATH)}
              >
                {/* 메뉴 아이템 텍스트 */}
                {item.MENU_NAME}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      {/* 인증된 사용자에게만 보이는 드롭다운 메뉴 */}
      {isAuthenticated && isAuthenticated() && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="ml-auto flex cursor-pointer items-center gap-2">
              <div>Customer: {user.CUSTOMER_CODE}</div>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-9 w-9 sm:flex">
                  <AvatarImage src="/images/avatars/avatar_17.jpg" alt="Avatar" />
                  <AvatarFallback>WK</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
              <div>{user.USER_NAME}</div>
            </div>
          </DropdownMenuTrigger>
          {/* 드롭다운 메뉴 컨텐츠 */}
          <DropdownMenuContent align="end">
            <div onClick={() => navigate('/my')} className="cursor-pointer">
              My page
            </div>
            <DropdownMenuSeparator />
            <div onClick={() => logout()} className="cursor-pointer">
              Logout
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {/* SheetContent 외의 영역을 클릭했을 때, 밝은 배경을 갖도록 설정 */}
      {isSheetOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-50" // 수정된 부분: bg-black/20에서 bg-white bg-opacity-50으로 변경
          onClick={() => setIsSheetOpen(false)} // 배경 클릭 시 SheetContent 닫기 및 배경 밝게 설정
        ></div>
      )}
    </header>
  );
}
