import { Link, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react'; // Menu 아이콘 추가
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
import { useContext, useState } from 'react'; // useState 추가
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

  // SheetContent 닫기 함수
  const closeSheet = () => {
    setIsSheetOpen(false);
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
        <SheetContent side="left" className={`flex flex-col ${isSheetOpen ? '' : 'hidden'}`}>
          <nav className="grid gap-2 text-lg font-medium">
            <Link to="#" className="flex items-center gap-2 text-lg font-semibold">
              <img src="/images/logo.png" alt="" className="h-[30px]" />
            </Link>
            {/* /webCommon/getMenu 에서 가져온 메뉴 아이템 데이터를 기반으로 렌더링 */}
            {menuItems?.map((item) => (
              <Link
                key={item.MENU_ID}
                to={item.SRC_PATH === '' ? '#' : item.SRC_PATH}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                onClick={closeSheet} // 링크 클릭 시 SheetContent 닫기
              >
                {/* 메뉴 아이템 텍스트 */}
                {item.MENU_NAME}
              </Link>
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
          className="fixed inset-0 bg-black/20 z-50"
          onClick={closeSheet} // 배경 클릭 시 SheetContent 닫기
        ></div>
      )}
    </header>
  );
}
